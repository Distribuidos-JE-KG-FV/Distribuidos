package imagepdf;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.imageio.ImageIO;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.S3Event;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.event.S3EventNotification.S3EventNotificationRecord;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.amazonaws.services.s3.model.GetObjectTaggingRequest;
import com.amazonaws.services.s3.model.GetObjectTaggingResult;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.Tag;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;

public class Handler implements
        RequestHandler<S3Event, String> {
    //private static final float MAX_WIDTH = 100;
    //private static final float MAX_HEIGHT = 100;
    private final String JPG_TYPE = (String) "jpg";
    //private final String JPG_MIME = (String) "image/jpeg";
    private final String JPEG_TYPE = (String) "jpeg";
    //private final String JPEG_MIME = (String) "image/jpeg";
    private final String PNG_TYPE = (String) "png";
    //private final String PNG_MIME = (String) "image/png";

    public String handleRequest(S3Event s3event, Context context) {
        try {
            S3EventNotificationRecord record = s3event.getRecords().get(0);

            String srcBucket = record.getS3().getBucket().getName();

            // Object key may have spaces or unicode non-ASCII characters.
            String srcKey = record.getS3().getObject().getUrlDecodedKey();
            System.out.print(srcKey);
            String dstBucket = "bucket-dist-emisor";
            String dstKey = srcKey+".pdf";

            GetObjectTaggingRequest getTaggingRequest = new GetObjectTaggingRequest(srcBucket, srcKey);
            AmazonS3 s3Client = AmazonS3ClientBuilder.defaultClient();
            GetObjectTaggingResult getTagsResult = s3Client.getObjectTagging(getTaggingRequest);
            List<Tag> tags=getTagsResult.getTagSet();
            String channel="";
            if(!tags.isEmpty()) {
            	channel=tags.get(0).getValue();
            }
            // Sanity check: validate that source and destination are different
            // buckets.
            if (srcBucket.equals(dstBucket)) {
                System.out
                        .println("Destination bucket must not match source bucket.");
                return "";
            }

            // Infer the image type.
            Matcher matcher = Pattern.compile(".*\\.([^\\.]*)").matcher(srcKey);
            if (!matcher.matches()) {
                System.out.println("Unable to infer image type for key "
                        + srcKey);
                return "";
            }
            String imageType = matcher.group(1);
            if (!(JPG_TYPE.equals(imageType)) && !(PNG_TYPE.equals(imageType))&& !(JPEG_TYPE.equals(imageType))) {
                System.out.println("Skipping non-image " + srcKey);
                return "";
            }

            // Download the image from S3 into a stream
            S3Object s3Object = s3Client.getObject(new GetObjectRequest(
                    srcBucket, srcKey));
            InputStream objectData = s3Object.getObjectContent();

            // Read the source image
            BufferedImage srcImage = ImageIO.read(objectData);
            
            //Create de PdfConverter
            ByteArrayOutputStream os = new ByteArrayOutputStream();
            ImagePdfConverter newpdf=null;
            if(channel.equals("1"))
            	newpdf= new ImagePdfBuilder().image(srcImage).center(true).buildConverter();
            else
            	newpdf= new ImagePdfBuilder().image(srcImage).fit(true).buildConverter();
            newpdf.generarPDF(os);
            InputStream is = new ByteArrayInputStream(os.toByteArray());
            // Set Content-Length and Content-Type
            ObjectMetadata meta = new ObjectMetadata();
            meta.setContentLength(os.size());
            meta.setContentType("application/pdf");
            /*if (JPG_TYPE.equals(imageType)) {
                meta.setContentType(JPG_MIME);
            }
            if (PNG_TYPE.equals(imageType)) {
                meta.setContentType(PNG_MIME);
            }
            if (JPEG_TYPE.equals(imageType)) {
                meta.setContentType(JPEG_MIME);
            }*/

            // Uploading to S3 destination bucket
            System.out.println("Writing to: " + dstBucket + "/" + dstKey);
            try {
                s3Client.putObject(dstBucket, dstKey, is, meta);
            }
            catch(AmazonServiceException e)
            {
                System.err.println(e.getErrorMessage());
                System.exit(1);
            }
            System.out.println("Successfully resized " + srcBucket + "/"
                    + srcKey + " and uploaded to " + dstBucket + "/" + dstKey);
            return "Ok";
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
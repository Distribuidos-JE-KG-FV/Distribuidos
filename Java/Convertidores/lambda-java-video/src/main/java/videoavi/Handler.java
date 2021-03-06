package videoavi;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;



import com.amazonaws.AmazonServiceException;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.S3Event;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.event.S3EventNotification.S3EventNotificationRecord;
import com.amazonaws.services.s3.model.GetObjectTaggingRequest;
import com.amazonaws.services.s3.model.GetObjectTaggingResult;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import com.amazonaws.services.s3.model.Tag;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;

public class Handler implements RequestHandler<S3Event, String> {
	

    private final String MP4_TYPE = (String) "mp4";
    

    public String handleRequest(S3Event s3event, Context context) {
        
            S3EventNotificationRecord record = s3event.getRecords().get(0);

            String srcBucket = record.getS3().getBucket().getName();

            // Object key may have spaces or unicode non-ASCII characters.
            String srcKey = record.getS3().getObject().getUrlDecodedKey();
            System.out.println(srcKey);
            String dstBucket = "bucket-dist-emisor";
            String dstKey = srcKey+".avi";

            // Sanity check: validate that source and destination are different
            // buckets.
            if (srcBucket.equals(dstBucket)) {
                System.out
                        .println("Destination bucket must not match source bucket.");
                return "";
            }

            // Infer the video type.
            Matcher matcher = Pattern.compile(".*\\.([^\\.]*)").matcher(srcKey);
            if (!matcher.matches()) {
                System.out.println("Unable to infer video type for key "
                        + srcKey);
                return "";
            }
            String imageType = matcher.group(1);
            if (!MP4_TYPE.equals(imageType)) {
                System.out.println("Skipping non-video " + srcKey);
                return "";
            }

            GetObjectTaggingRequest getTaggingRequest = new GetObjectTaggingRequest(srcBucket, srcKey);
            AmazonS3 s3Client = AmazonS3ClientBuilder.defaultClient();
            GetObjectTaggingResult getTagsResult = s3Client.getObjectTagging(getTaggingRequest);
            List<Tag> tags=getTagsResult.getTagSet();
            String channel="";
            if(!tags.isEmpty()) {
            	channel=tags.get(0).getValue();
            }
            
            File originalVideo=new File("/tmp/"+srcKey.split("/")[1]);
            try {
                S3Object o = s3Client.getObject(srcBucket, srcKey);
                S3ObjectInputStream s3is = o.getObjectContent();
                FileOutputStream fos = new FileOutputStream(originalVideo);
                byte[] read_buf = new byte[1024];
                int read_len = 0;
                while ((read_len = s3is.read(read_buf)) > 0) {
                    fos.write(read_buf, 0, read_len);
                }
                s3is.close();
                fos.close();
            } catch (AmazonServiceException e) {
            	System.out.println("a");
                System.err.println(e.getErrorMessage());
                System.exit(1);
            } catch (FileNotFoundException e) {
            	System.out.println("e");
                System.err.println(e.getMessage());
                System.exit(1);
            } catch (IOException e) {
            	System.out.println("i");
                System.err.println(e.getMessage());
                System.exit(1);
            }
            
            VideoAviConverter video=new VideoAviConverter();
            File newVideo=video.videoConvert(originalVideo.getName(), dstKey, Integer.parseInt(channel));
   
            // Uploading to S3 destination bucket
            System.out.println("Writing to: " + dstBucket + "/" + dstKey);
            try {
                s3Client.putObject(dstBucket, dstKey, newVideo);
            }
            catch(AmazonServiceException e)
            {
            	System.out.println("o");
                System.err.println(e.getErrorMessage());
                System.exit(1);
            }
            System.out.println("Successfully retrieve " + srcBucket + "/"
                    + srcKey + " and uploaded to " + dstBucket + "/" + dstKey);
            return "Ok";
       
    }
}

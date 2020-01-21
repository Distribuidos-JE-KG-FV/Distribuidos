package audiowav;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;



import com.amazonaws.AmazonServiceException;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.S3Event;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.event.S3EventNotification.S3EventNotificationRecord;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;

public class Handler implements RequestHandler<S3Event, String> {
	

    private final String MP3_TYPE = (String) "mp3";
    

    public String handleRequest(S3Event s3event, Context context) {
        
            S3EventNotificationRecord record = s3event.getRecords().get(0);

            String srcBucket = record.getS3().getBucket().getName();

            // Object key may have spaces or unicode non-ASCII characters.
            String srcKey = record.getS3().getObject().getUrlDecodedKey();
            System.out.println(srcKey);
            String dstBucket = "bucket-dist-emisor";
            String dstKey = srcKey+".wav";

            // Sanity check: validate that source and destination are different
            // buckets.
            if (srcBucket.equals(dstBucket)) {
                System.out
                        .println("Destination bucket must not match source bucket.");
                return "";
            }

            // Infer the audio type.
            Matcher matcher = Pattern.compile(".*\\.([^\\.]*)").matcher(srcKey);
            if (!matcher.matches()) {
                System.out.println("Unable to infer audio type for key "
                        + srcKey);
                return "";
            }
            String imageType = matcher.group(1);
            if (!MP3_TYPE.equals(imageType)) {
                System.out.println("Skipping non-audio " + srcKey);
                return "";
            }

           
            AmazonS3 s3Client = AmazonS3ClientBuilder.defaultClient();
            /*S3Object s3Object = s3Client.getObject(new GetObjectRequest(
                    srcBucket, srcKey));
            InputStream objectData = s3Object.getObjectContent();
            //URL objectURL=s3Client.getUrl(srcBucket, srcKey);*/
            File originalAudio=new File("/tmp/"+srcKey.split("/")[1]);
            try {
                S3Object o = s3Client.getObject(srcBucket, srcKey);
                S3ObjectInputStream s3is = o.getObjectContent();
                FileOutputStream fos = new FileOutputStream(originalAudio);
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
            
            AudioWavConverter audio=new AudioWavConverter();
            File newAudio=audio.audioConvert(originalAudio.getName(), dstKey);
   
            // Uploading to S3 destination bucket
            System.out.println("Writing to: " + dstBucket + "/" + dstKey);
            try {
                s3Client.putObject(dstBucket, dstKey, newAudio);
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
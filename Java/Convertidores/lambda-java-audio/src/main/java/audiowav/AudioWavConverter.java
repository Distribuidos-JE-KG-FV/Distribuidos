package audiowav;

import ws.schild.jave.AudioAttributes;
import ws.schild.jave.Encoder;
import ws.schild.jave.EncoderException;
import ws.schild.jave.EncodingAttributes;
import ws.schild.jave.MultimediaObject;
//import ws.schild.jave.VideoAttributes;
import java.io.File;
import java.util.logging.Level;
import java.util.logging.Logger;


/**
 *
 * @author SmartPC593
 */
public class AudioWavConverter {
    
    /*public static void convertVid(String in, String out ) {
        File source = new File(in);
        File target = new File(out);
        AudioAttributes audio = new AudioAttributes();
        audio.setCodec("libmp3lame");
        audio.setBitRate(new Integer(56000));
        audio.setChannels(new Integer(1));
        audio.setSamplingRate(new Integer(22050));
        VideoAttributes video = new VideoAttributes();
        video.setCodec(VideoAttributes.DIRECT_STREAM_COPY);
        EncodingAttributes attrs = new EncodingAttributes();
        attrs.setFormat("avi");
        attrs.setAudioAttributes(audio);
        attrs.setVideoAttributes(video);
        Encoder encoder = new Encoder();
        try {
            encoder.encode(new MultimediaObject(source), target, attrs);
        } catch (IllegalArgumentException ex) {
            Logger.getLogger(AudioWavConverter.class.getName()).log(Level.SEVERE, null, ex);
        } catch (EncoderException ex) {
            Logger.getLogger(AudioWavConverter.class.getName()).log(Level.SEVERE, null, ex);
        }
        
    }*/
    
    public File audioConvert(String in, String out) {
    	File source = new File("/tmp/"+in);
        File target = new File("/tmp/"+out);

        final AudioAttributes audio = new AudioAttributes();
        audio.setCodec("libmp3lame");
        audio.setBitRate(88000);
        audio.setChannels(2);
        audio.setSamplingRate(44100);   

        EncodingAttributes attrs = new EncodingAttributes();
        attrs.setFormat("wav");
        attrs.setAudioAttributes(audio);

        Encoder encoder = new Encoder();
        try {
            encoder.encode(new MultimediaObject(source), target, attrs);
        } catch (IllegalArgumentException ex) {
        	System.out.println("ae");
            Logger.getLogger(AudioWavConverter.class.getName()).log(Level.SEVERE, null, ex);
        } catch (EncoderException ex) {
        	System.out.println("ai");
            Logger.getLogger(AudioWavConverter.class.getName()).log(Level.SEVERE, null, ex);
        }
        return target;
        
    }
}



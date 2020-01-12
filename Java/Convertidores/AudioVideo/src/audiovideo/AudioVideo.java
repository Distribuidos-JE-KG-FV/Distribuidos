/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package audiovideo;

/**
 *
 * @author SmartPC593
 */
public class AudioVideo {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        // TODO code application logic here
        Funciones.convertVid("kimetsu.mp4", "kimetsu.avi");
        Funciones.audConvert("Unravel.mp3", "Unravel.wav");
    }
    
}

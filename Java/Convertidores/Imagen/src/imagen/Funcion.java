/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package imagen;

import com.itextpdf.text.Document;
import com.itextpdf.text.Element;
import com.itextpdf.text.Image;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.pdf.PdfWriter;
import java.io.FileOutputStream;



/**
 *
 * @author SmartPC593
 */
public class Funcion {
    
    public static void generarPDF(String imagen, String salida ){
        
        try{
            Document doc= new Document(PageSize.A4,36,36,10,10);
            PdfWriter.getInstance(doc, new FileOutputStream(salida));
            doc.open();
            Image image = Image.getInstance(imagen);
            image.scaleAbsolute(100, 100);
            image.setAlignment(Element.ALIGN_CENTER);
            doc.add(image);
            doc.close();
            
        }catch(Exception e){
            
        }
            
    }
    
}

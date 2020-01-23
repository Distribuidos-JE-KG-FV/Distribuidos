/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package imagepdf;

import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Image;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.pdf.PdfWriter;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

/**
 *
 * @author SmartPC593
 */
public class ImagePdfConverter {

	private final BufferedImage _image;
	private final String _filename;
	//private final String _output;
	private final Boolean _fit;
	private final Boolean _center;
	private final float _marginLeft;
	private final float _marginRight;
	private final float _marginTop;
	private final float _marginBottom;

	public ImagePdfConverter(BufferedImage _image, String filename /*,String _output*/, Boolean _fit, Boolean _center, float _marginLeft,
			float _marginRight, float _marginTop, float _marginBottom) {
		this._image = _image;
		this._filename=filename;
		/*if (_output.equals("")) {
			this._output = _image;
		} else {
			this._output = _output;
		}*/
		this._fit = _fit;
		this._marginLeft = _marginLeft;
		this._marginRight = _marginRight;
		this._marginBottom = _marginBottom;
		this._marginTop = _marginTop;
		this._center = _center;
	}

	public void generarPDF(ByteArrayOutputStream os) {
		try {
			Document doc = new Document(PageSize.A4, this._marginLeft, this._marginRight, this._marginTop, this._marginBottom);
			PdfWriter.getInstance(doc, os);
            doc.open();
            Image image = Image.getInstance(this._image,null);
            if (this._fit || image.getWidth() > PageSize.A4.getWidth() || image.getHeight() > PageSize.A4.getHeight()) {
                image.scaleToFit(
                        PageSize.A4.getWidth() - (this._marginLeft + this._marginRight),
                        PageSize.A4.getHeight() - (this._marginBottom + this._marginTop));
            }
            if (this._center) {
                float x = (PageSize.A4.getWidth() - image.getScaledWidth()) / 2;
                float y = (PageSize.A4.getHeight() - image.getScaledHeight()) / 2;
                image.setAbsolutePosition(x, y);
            }
            
            doc.add(image);
            doc.close();
            System.out.println("Archivo guardado como: " + this._filename);
            

        } catch (DocumentException | IOException e) {
            //PUEDE QUE VAYA ALGO RELACIONADO CON LAMBDA
        	System.out.println("Error en funcion de convertir");
        }
	}

}

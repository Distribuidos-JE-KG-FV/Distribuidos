/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package imagepdf;

import java.awt.image.BufferedImage;

/**
 *
 * @author josea
 */
public class ImagePdfBuilder {
    private BufferedImage _image;
    private String _filename;
    private Boolean _fit=false;
    private Boolean _center=true;
    private float _marginLeft=0;
    private float _marginRight=0;
    private float _marginTop=0;
    private float _marginBottom=0;


    public ImagePdfBuilder() { }

    public ImagePdfConverter buildConverter()
    {
        return new ImagePdfConverter(_image,_filename, _fit,_center,_marginLeft,_marginRight,_marginTop,_marginBottom);
    }

    public ImagePdfBuilder image(BufferedImage _image)
    {
        this._image = _image;
        return this;
    }

    public ImagePdfBuilder filename(String filename)
    {
        this._filename = filename;
        return this;
    }

    public ImagePdfBuilder fit(Boolean _fit)
    {
        this._fit = _fit;
        return this;
    }
    
    public ImagePdfBuilder center(Boolean _center)
    {
        this._center = _center;
        return this;
    }
    
    public ImagePdfBuilder marginLeft(float _marginLeft)
    {
        this._marginLeft = _marginLeft;
        return this;
    }
    
    public ImagePdfBuilder marginRight(float _marginRight)
    {
        this._marginRight = _marginRight;
        return this;
    }
    
    public ImagePdfBuilder marginBottom(float _marginBottom)
    {
        this._marginBottom = _marginBottom;
        return this;
    }
    
    public ImagePdfBuilder marginTop(float _marginTop)
    {
        this._marginTop = _marginTop;
        return this;
    }
}

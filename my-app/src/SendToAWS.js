import React, { Component } from "react";

const AWS = require('aws-sdk');
const path = require('path');
const keys = require('./keys.js');

const r_bucket_name = 'bucket-dist-receptor'
const e_bucket_name = 'bucket-dist-emisor'


const s3 = new AWS.S3({ region: "sa-east-1" });


function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

class SendToAWS extends Component {

    valores = {};
    constructor(props) {
        super(props);
        this.valores = this.props.valores;
        this.handleSubmit = this.handleSubmit.bind(this);
        this.fileInput = React.createRef()
    }


    handleSubmit(event) {
        event.preventDefault();
        var newFileName=path.basename(this.fileInput.current.files[0].originalname, path.extname(this.fileInput.current.files[0].originalname)) + '-' + Date.now() + path.extname(this.fileInput.current.files[0].originalname)
        var params={
            Bucket: r_bucket_name,
            Key: this.valores.action+newFileName,
            Body: this.fileInput.current.files[0].buffer,
            ContentType: this.fileInput.current.files[0].mimetype,
            ACL: "public-read"
        }
        switch (this.valores.action) {
            case "images":
                console.log(params.Key)
                s3.putObject(params, function(err, data) {
                    if (err)
                      console.log(err)
                    else
                      console.log("Successfully uploaded data to " + params.Bucket + "/" + params.Key);
                  });

                break;
            case "audios":
                alert(
                    `Selected file - ${
                    this.fileInput.current.files[0].name
                    } - ${this.valores.action} - AUDIO`
                );
                break;
            case "videos":
                alert(
                    `Selected file - ${
                    this.fileInput.current.files[0].name
                    } - ${this.valores.action}- VIDEO`
                );
                break;
            default:
                break;
        }

    }



    render() {
        return (
            <form method="POST" encType="multipart/form-data" onSubmit={this.handleSubmit} action={this.valores.action}>
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title" id="exampleModalLongTitle">{this.valores.title}</h3>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true"> &times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <h5> Elige el archivo que deseas convertir </h5>
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text"></span>
                                </div>
                                <div className="custom-file">
                                    <input type="file" className="custom-file-input" lang="es" ref={this.fileInput} name="upload" accept={this.valores.files}></input>
                                    <label className="custom-file-label">...</label>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal"> Cerrar</button>
                                <button type="submit" className="btn btn-primary form-submit"> Enviar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form >
        );
    }
}

export default SendToAWS;
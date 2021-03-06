import React, { Component } from "react";
import $ from 'jquery';
import * as path from 'path';
import * as mime from 'mime-types'
import * as keys from './keys.js'
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'

const AWS = require('aws-sdk');
const r_bucket_name = 'bucket-dist-receptor'
const e_bucket_name = 'bucket-dist-emisor'
const s3 = new AWS.S3({
    accessKeyId: keys.iam_access_id || process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: keys.iam_secret || process.env.AWS_SECRET_ACCESS_KEY,
    region: "sa-east-1"
});

function checkFileTypeSize(file, filetypes, fileSize, limitSize) {
    if (fileSize > limitSize) {
        return false;
    }
    const extname = filetypes.test(file);
    const mimetype = filetypes.test(file);
    if (mimetype && extname) {
        return true;
    } else {
        return false;
    }
}

class SendToAWS extends Component {

    valores = {};
    constructor(props) {
        super(props);
        this.valores = this.props.valores;
        this.handleSubmit = this.handleSubmit.bind(this);
        if (this.valores.action === "images") {
            this.options = [{ value: 1, label: "Centrado y ajustado" }, { value: 2, label: "Estrecho a la página" }]
            this.defSelected = 1;
        }
        else {
            this.options = [{ value: 1, label: "Mono" }, { value: 2, label: "Stereo" }]
            this.defSelected = 1;
        }
        this.state = {
            selectedFile: undefined
        }
    }

    changeParam = event =>{
        this.defSelected=event.value
    }

    onChangeHandler = event => {

        this.setState({
            selectedFile: event.target.files[0],
        })
    }
    handleSubmit(event) {
        event.preventDefault();

        if (this.state.selectedFile === undefined) {
            alert("No se ha elegido un archivo")
            return;
        }
        var newFileName = "";
        var time = new Date();
        if (this.customfilename.value === undefined || this.customfilename.value === "") {
            newFileName = path.basename(this.state.selectedFile.name.replace(/\.[^/.]+$/, ""), path.extname(this.state.selectedFile).toLowerCase()) + '-' + time.getSeconds() + path.extname(this.state.selectedFile.name).toLowerCase();
        }
        else {
            newFileName = path.basename(this.customfilename.value, path.extname(this.state.selectedFile).toLowerCase()) + '-' + time.now() + path.extname(this.state.selectedFile.name).toLowerCase();
        }
        var pathfile = this.valores.action + '/' + newFileName;
        var params = {
            Bucket: r_bucket_name,
            Key: pathfile,
            Body: this.state.selectedFile,
            ContentType: mime.lookup(newFileName.toLowerCase()),
            ACL: "public-read",
            Tagging: "channel="+this.defSelected
        }
        var limitImg = 10000000;//10MB
        var limitAudio = 15000000;//15MB
        var limitVideo = 15000000; //15MB
        console.log(pathfile);
        switch (this.valores.action) {
            case "images":
                const imgTypes = /jpeg|jpg|png|PNG|JPG|JPEG/;
                if (checkFileTypeSize(this.state.selectedFile.name, imgTypes, this.state.selectedFile.size, limitImg)) {
                    $(".modal").modal('hide');
                    $("input[type=file]").val('');
                    $(".custom-file-label").html("...");
                    this.props.enviar();
                    s3.putObject(
                        params,
                        function (err, data) {
                            if (err) {
                                alert('Ha ocurrido un error al subir tu archivo');
                            } else {
                                $('#gg').html("Tu imagen está siendo procesada");
                                waitForFile(".pdf", pathfile, 3);
                            }
                        }
                    )
                }
                else {
                    alert("El archivo seleccionado no es válido")
                    $("input[type=file]").val('');
                    $(".custom-file-label").html("...");
                }
                break;
            case "audio":
                //HAY QUE CAMBIAR ESTO PARA LOS AUDIOS
                const audioTypes = /mp3/;
                if (checkFileTypeSize(this.state.selectedFile.name, audioTypes, this.state.selectedFile.size, limitAudio)) {
                    $(".modal").modal('hide');
                    $("input[type=file]").val('');
                    $(".custom-file-label").html("...");
                    this.props.enviar();
                    s3.putObject(
                        params,
                        function (err, data) {
                            if (err) {
                                alert('Ha ocurrido un error al subir tu archivo');
                            } else {
                                $('#gg').html("Tu audio está siendo procesado");
                                waitForFile(".wav", pathfile, 4);
                            }
                        }
                    )
                }
                else {
                    alert("El archivo seleccionado no es válido")
                    $("input[type=file]").val('');
                    $(".custom-file-label").html("...");
                }
                break;
            case "video":
                //HAY QUE CAMBIAR ESTO PARA LOS VIDEOS
                const videoTypes = /mp4/;
                if (checkFileTypeSize(this.state.selectedFile.name, videoTypes, this.state.selectedFile.size, limitVideo)) {
                    $(".modal").modal('hide');
                    $("input[type=file]").val('');
                    $(".custom-file-label").html("...");
                    this.props.enviar();
                    s3.putObject(
                        params,
                        function (err, data) {
                            if (err) {
                                alert('Ha ocurrido un error al subir tu archivo');
                            } else {
                                $('#gg').html("Tu video está siendo procesado");
                                waitForFile(".avi", pathfile, 4);
                            }
                        }
                    )
                }
                else {
                    alert("El archivo seleccionado no es válido")
                    $("input[type=file]").val('');
                    $(".custom-file-label").html("...");
                }
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
                            <h3 className="modal-title">{this.valores.title}</h3>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true"> &times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="md-form">
                                <input type="text" id={"form1" + this.valores.id} ref={(c) => this.customfilename = c} className="form-control"></input>
                                <label htmlFor={"form1" + this.valores.id}>Nombre de tu archivo de salida</label>
                            </div>
                            <p> Elige el archivo que deseas convertir </p>
                            <div className="input-group">
                                <input type="file" name="upload" onChange={this.onChangeHandler} accept={this.valores.files} id={"customFile" + this.valores.id}></input>
                            </div>
                            <div className="my-4 dropdown">
                                <label>Elige una opción de conversion</label>
                                <Dropdown options={this.options} onChange={this.changeParam} value={this.defSelected} placeholder="Selecciona una opción" />
                            </div>
                            <div className="modal-footer text-center">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal"> Cerrar</button>
                                <button type="submit" className="sendbtn btn btn-primary form-submit"> Enviar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form >
        );
    }
}




function waitForFile(ext, fileToDownload, wait) {
    var filename = fileToDownload + ext;
    const getParams = {
        Bucket: e_bucket_name,
        Key: filename,
        Expires: 60 * 5
    };
    const wt = {
        Bucket: e_bucket_name,
        Key: filename,
        $waiter: {
            maxAttempts: 20,
            delay: wait
        }
    }
    s3.waitFor('objectExists', wt, function (err, data) {
        if (err) {
            alert("Ha ocurrido un error. Lo sentimos")
        } // an error occurred
        else { //success
            s3.getSignedUrl("getObject", getParams, function (err, url) {
                if (err) {
                    alert("Ha ocurrido un error. Lo sentimos")
                }
                else {
                    $('#gg').html("<a href='" + url + "' target='_blank' download class='btn indigo white-text'>Descargar</a>");
                    $('#titu').html("Tu descarga está lista");
                    console.log('Tu url de descarga es:' + url);
                }
            });
        }
    });
}


export default SendToAWS;
import React, { Component } from "react";
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Cookies from 'js-cookie'
import * as path from 'path';
import * as mime from 'mime-types'
import axios from 'axios';
import * as keys from './keys.js'
import {Redirect} from 'react-router-dom';

const AWS = require('aws-sdk');
const r_bucket_name = 'bucket-dist-receptor'
const e_bucket_name = 'bucket-dist-emisor'
const s3 = new AWS.S3({accessKeyId: keys.iam_access_id,
    secretAccessKey: keys.iam_secret,
    region: "sa-east-1"});

function checkFileType(file, filetypes) {
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
        this.state = {
            selectedFile: undefined
          }
    }
    onChangeHandler=event=>{

        console.log(event.target.files[0])
        this.setState({
            selectedFile: event.target.files[0],
          })
    }
/*
    onClickHandler = () => {
        const data = new FormData() 
        data.append('file', this.state.selectedFile)
        axios.post("http://localhost:3000/upload", data, { // receive two parameter endpoint url ,form data 
      })
      .then(res => { // then print response status
        console.log(res.statusText)
      })
    }
*/
    handleSubmit(event) {
        event.preventDefault();

        if (this.state.selectedFile === undefined) {
            alert("No se ha elegido un archivo")
            return;
        }
        //var newFileName = path.basename(this.state.selectedFile.name.replace(/\.[^/.]+$/, ""), path.extname(this.state.selectedFile)) + '-'+Date.now() + path.extname(this.state.selectedFile.name)
        //var pathfile=this.valores.action+'/'+newFileName;
        //console.log(newFileName);
        /*
        var params = {
            Bucket: r_bucket_name,
            Key: this.valores.action + '/' + newFileName,
            Body: this.state.selectedFile.buffer,
            ContentType: mime.lookup(newFileName.toLowerCase()),
            ACL: "public-read"
        }
        console.log(params);*/
        switch (this.valores.action) {
            case "images":
                const imgTypes = /jpeg|jpg|png|PNG/;
                if (checkFileType(this.state.selectedFile.name, imgTypes)) {
                    $(".modal").modal('hide');
                    $("input[type=file]").val('');
                    $(".custom-file-label").html("...");
                    const data = new FormData() 
                    data.append('file', this.state.selectedFile);
                    this.props.enviar();
                    axios.post("http://localhost:8000/upload-image", data, { // receive two parameter endpoint url ,form data 
                    })
                    .then(res => { // then print response status
                        var fileToDownload=res.data.key;
                        $('#gg').html("Tu imagen está siendo procesada");
                        waitForFile(".pdf", fileToDownload);
                    })
                }
                else {
                    alert("El archivo seleccionado no es válido")
                    $("input[type=file]").val('');
                    $(".custom-file-label").html("...");
                }

                break;
            case "audios":
                //HAY QUE CAMBIAR ESTO PARA LOS AUDIOS
                const audioTypes = /jpeg|jpg|png|PNG/;
                if (checkFileType(this.state.selectedFile.name, audioTypes)) {
                    $(".modal").modal('hide');
                    $("input[type=file]").val('');
                    $(".custom-file-label").html("...");
                    const data = new FormData() 
                    data.append('file', this.state.selectedFile);
                    this.props.enviar();
                    axios.post("http://localhost:8000/upload-audio", data, { // receive two parameter endpoint url ,form data 
                    })
                    .then(res => { // then print response status
                        var fileToDownload=res.data.key;
                        $('#gg').html("Tu audio está siendo procesado");
                        //HAY QUE AGREGAR LA EXTENSION RESULTANTE
                        waitForFile(".", fileToDownload);
                    })
                }
                else {
                    alert("El archivo seleccionado no es válido")
                    $("input[type=file]").val('');
                    $(".custom-file-label").html("...");
                }
                break;
            case "videos":
                //HAY QUE CAMBIAR ESTO PARA LOS VIDEOS
                const videoTypes = /jpeg|jpg|png|PNG/;
                if (checkFileType(this.state.selectedFile.name, videoTypes)) {
                    $(".modal").modal('hide');
                    $("input[type=file]").val('');
                    $(".custom-file-label").html("...");
                    const data = new FormData() 
                    data.append('file', this.state.selectedFile);
                    this.props.enviar();
                    axios.post("http://localhost:8000/upload-video", data, { // receive two parameter endpoint url ,form data 
                    })
                    .then(res => { // then print response status
                        var fileToDownload=res.data.key;
                        $('#gg').html("Tu video está siendo procesado");
                        //HAY QUE AGREGAR LA EXTENSION RESULTANTE
                        waitForFile(".", fileToDownload);
                    })
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
                            <h5> Elige el archivo que deseas convertir </h5>
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id={"inputGroupFileAddon" + this.valores.id}></span>
                                </div>
                                <div className="custom-file">
                                    <input id={"input" + this.valores.id} type="file" aria-describedby={"inputGroupFileAddon" + this.valores.id} className="custom-file-input" lang="es" onChange={this.onChangeHandler} name="upload" accept={this.valores.files}></input>
                                    <label htmlFor={"input" + this.valores.id} className="custom-file-label">...</label>
                                </div>
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



function Download(url){
    return(
        $('<iframe>', { id:'idown', src:url }).hide().appendTo('body').click()
    );
}

function waitForFile(ext, fileToDownload) {
    var filename = fileToDownload + ext;
    const getParams = {
        Bucket: e_bucket_name,
        Key: filename,
        Expires: 60*3
    };
    const wt = {
        Bucket: e_bucket_name,
        Key: filename,
        $waiter: {
            maxAttempts: 12,
            delay: 5
        }
    }
    s3.waitFor('objectExists', wt, function (err, data) {
        if (err) {
            alert("Ha ocurrido un error. Lo sentimos")
        } // an error occurred
        else { //success
            s3.getSignedUrl("getObject",getParams, function (err, url) {
                if (err) {
                    alert("Ha ocurrido un error. Lo sentimos")
                }
                else {
                    $('#gg').html("<a href='"+url+"' target='_blank' download='"+Cookies.get('pathfile')+"' class='btn indigo white-text'>Descargar</a>");
                    console.log('Tu url de descarga es:'+url);
                }
            });
        }
    });
}


export default SendToAWS;
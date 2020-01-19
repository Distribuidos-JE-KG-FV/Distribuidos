import React, { Component } from "react";
import SendToAWS from "./SendToAWS"

class Conversion extends Component {
    cards = [
        { id: "id1", title: "Convertidor Imagen a PDF", text: "Convierta cualquier tipo de imagen en un archivo PDF.", action: "images", files:"image/x-png,,image/jpeg"},
        { id: "id2", title: "Convertidor de Audio", text: "Convierta archivos de audio a uno de los diferentes formatos disponibles.", action: "audios", files:"audio/*" },
        { id: "id3", title: "Convertidor de Video", text: "Convierta archivos de video a uno de los diferentes formatos disponibles.", action: "videos", files:"video/*" }
    ];

    items = [];

    modales = [];

    constructor(props) {
        super(props);
        this.items = this.cards.map((card, key) =>
            conversion(card)
        );
        this.modales = this.cards.map((modal, key) =>
            modals(modal)
        );
    }
    render() {
        return (
            <>
                {this.items}
                {this.modales}
            </>
        );
    }
}

function conversion(c) {
    return (
        <div className="card mr-2">
            <div className="card-body">
                <h5 className="card-title">{c.title}</h5>
                <p className="card-text">{c.text}</p>
                <a href="#" className="btn white-text indigo" data-toggle="modal" data-target={"#"+c.id}>Realizar conversión</a>
            </div>
        </div>
    );
}

function modals(c) {
    return (
        <div className="modal fade" id={c.id} tabIndex="-1" role="dialog" aria-hidden="true">
            <SendToAWS  valores={c}/>
        </div >
    );
}
export default Conversion;
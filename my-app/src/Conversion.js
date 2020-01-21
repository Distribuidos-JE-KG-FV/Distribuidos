import React, { Component } from "react";
import SendToAWS from "./SendToAWS"

class Conversion extends Component {
    cards = [
        { id: "id1", title: "Convertidor Imagen a PDF", text: "Convierta images tipo png y jpeg en un archivo PDF.", action: "images", files: ".png,.jpeg,.jpg" },
        { id: "id2", title: "Convertidor de Audio", text: "Convierta archivos de audio MP3 a WAV.", action: "audio", files: ".mp3" },
        { id: "id3", title: "Convertidor de Video", text: "Convierta archivos de video MP4 a AVI.", action: "video", files: ".mp4*" }
    ];

    constructor(props) {
        super(props);
        this.state = { noEnviado: true }
    }

    triggerEnviado = () => {
        this.setState({
            noEnviado: false,
            enviado: true,
            text: "Tu archivo se está subiendo"
        })
    }

    changeText = () => {
        this.setState({
            text: "Tu archivo se está convirtiendo"
        })
    }
    render() {
        return (
            <>
                {this.state.noEnviado && this.cards.map((card) => <Cards key={card.id} values={card} enviar={this.triggerEnviado} cambiar={this.changeText} />)}

                {this.state.enviado && <Espera text={this.state.text} />}
            </>

        );
    }
}


class Cards extends Component {
    constructor(props) {
        super(props);
        this.values = this.props.values;
    };
    render() {
        return (
            <>
                <div className="card mr-2">
                    <div className="card-body">
                        <h5 className="card-title">{this.values.title}</h5>
                        <p className="card-text">{this.values.text}</p>
                        <div className="text-center">
                            <button className="btn white-text indigo" data-toggle="modal" data-target={"#" + this.values.id}>Realizar conversión</button>
                        </div>
                    </div>
                </div>
                <Modals values={this.values} enviar={this.props.enviar} cambiar={this.props.cambiar} />
            </>
        );
    }
}


class Modals extends Component {
    constructor(props) {
        super(props);
        this.values = this.props.values;
    }

    render() {
        return (
            <div className="modal fade" id={this.values.id} tabIndex="-1" role="dialog" aria-hidden="true">
                <SendToAWS valores={this.values} enviar={this.props.enviar} cambiar={this.props.cambiar} />
            </div >
        );
    }
}

class Espera extends Component {

    constructor(props) {
        super(props);
        this.text = this.props.text;
    }
    render() {
        return (
            <div className="container text-center white-text">
                <div className="white-text text-center black">
                    <h2 id="titu">Espera...</h2>
                    <br></br>
                    <h5 id="gg">{this.text}</h5>
                </div>
            </div>
            
        )
    };
}

export default Conversion;
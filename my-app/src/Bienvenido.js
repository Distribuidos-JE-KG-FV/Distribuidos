import React, { Component } from "react";
class Bienvenido extends Component {
  render() {
    return (
      <div className="container text-center white-text">
        <div className="white-text text-center black">
          <h2>Proyecto Final</h2>
          <h5>SISTEMAS DISTRIBUIDOS</h5>
          <br></br>
          <p>2019 - II S</p>
        </div>
      </div>
    );
  }
}

function Mensaje() {
  return (
    <main className="text-center py-5">

      <div className="container">
        <div className="row">
          <div className="col-md-12">

            <p align="justify">
              Proyecto Final de la materia Sistemas Distribuidos del término 2019-II dictado por la Doctora
              Cristina Abad. El proyecto trata de un sistema distribuido basado en servicios para la
              conversión de archivos en diferentes formatos.
                    <br></br>
              Para este caso, tenemos conversión de archivos de audio, video e imagen.

                </p>

          </div>
        </div>
      </div>

    </main>
  )
}

export default Bienvenido;
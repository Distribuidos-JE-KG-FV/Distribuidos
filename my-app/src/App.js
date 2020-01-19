import React, { Component } from 'react';
import './App.css';

import {
  Route,
  NavLink,
  HashRouter, Switch
} from "react-router-dom";

import Bienvenido from "./Bienvenido";
import Conversion from "./Conversion";

class Main extends Component {
  render() {
    return (
      <HashRouter>
        <header>
          <nav className="navbar fixed-top navbar-expand-lg navbar-dark indigo">
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav mr-auto">
                <Links/>
              </ul>
            </div>
          </nav>
        </header>
      <div className="view">
        <div className="full-bg-img">
          <div className="mask rgba-black-light flex-center">
            <Switch>
              <Route exact path="/" component={Bienvenido} />
              <Route path="/conversion" component={Conversion} />
            </Switch>
          </div>
        </div>
      </div>
      </HashRouter >
    );
  }
}

function Links() {
  return (
    <>
      <li className="nav-item">
        <NavLink to="/" className="nav-link" activeClassName="active nav-link" exact>Principal </NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/conversion" className="nav-link" activeClassName="active nav-link" exact>Conversion</NavLink>
      </li>
    </>
  );
}

export default Main;

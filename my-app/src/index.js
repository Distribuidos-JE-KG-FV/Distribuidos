import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Main from './App';
import * as serviceWorker from './serviceWorker';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Archivo CSS de Bootstrap 4 
import 'bootstrap/dist/js/bootstrap.min.js';

import $ from 'jquery';

ReactDOM.render(<Main />, $("#root")[0])//document.getElementByClass(''));
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

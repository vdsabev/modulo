import './assets/logo.png';
import './manifest.json';
import './style.scss';

// import { Compote, h1 } from 'compote/html';

// const container = document.querySelector('#container');
// const spinnerView = document.querySelector('#spinner-view');

initialize();

function initialize() {
  initializeFirebase();
  registerServiceWorker();
  // render();
}

function initializeFirebase() {
  firebase.initializeApp({
    apiKey: 'AIzaSyCaEORMD6L4JE6tTSFbRRQEUVTnOIGRiVA',
    authDomain: 'modulo-one.firebaseapp.com',
    databaseURL: 'https://modulo-one.firebaseio.com',
    storageBucket: 'modulo-one.appspot.com',
    messagingSenderId: '816213681270'
  });
}

function registerServiceWorker() {
  if (navigator.serviceWorker) {
    navigator.serviceWorker.register('service-worker.js', { scope: './' });
  }
}

// function render() {
//   Compote.render(container, [
//     h1('%1')
//   ]);
// }

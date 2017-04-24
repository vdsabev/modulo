import './assets/logo.png';
import './manifest.json';
import './style.scss';

import { redraw } from 'mithril';
import { Compote } from 'compote/html';

import { initializeFirebase } from './firebase';
import { initializeRouter } from './router';
import { store } from './store';

const spinnerView = document.querySelector('#spinner-view');

initialize();

function initialize() {
  initializeFirebase();
  registerServiceWorker();
  initializeRouter();
  subscribeToStore();
}

function registerServiceWorker() {
  if (navigator.serviceWorker) {
    navigator.serviceWorker.register('service-worker.js', { scope: './' });
  }
}

function subscribeToStore() {
  store.subscribe(redraw);

  const unsubscribeSpinnerView = store.subscribe(() => {
    spinnerView.classList.add('loaded');
    unsubscribeSpinnerView();
  });
}

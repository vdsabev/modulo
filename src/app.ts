import './assets/logo.png';
import './manifest.json';
import './style.scss';

import { redraw } from 'mithril';

import { initializeFirebase } from './firebase';
import { initializeRouter, setRouteIfNew } from './router';
import { store } from './store';

const header = document.querySelector('#header');
const spinnerView = <HTMLAnchorElement>document.querySelector('#spinner-view');

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

  const unsubscribeContainers = store.subscribe(() => {
    applicationLoaded();
    unsubscribeContainers();
  });
}

function applicationLoaded() {
  header.classList.add('loaded');
  spinnerView.classList.add('loaded');

  spinnerView.onclick = (e) => {
    e.preventDefault();
    setRouteIfNew(spinnerView.getAttribute('href'));
  };
}

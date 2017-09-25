import './assets/logo.png';
import './manifest.json';
import './style.scss';

import { setHyperscriptFunction } from 'compote';
import * as m from 'mithril';

import { initializeFirebaseApp } from './firebase';
import { Header } from './header';
import { initializeRouter, setRouteIfNew } from './router';
import { store } from './store';

setHyperscriptFunction(m);
initializeApp();

function initializeApp() {
  initializeFirebaseApp();
  registerServiceWorker();
  subscribeToStore();
  initializeRouter();
}

function registerServiceWorker() {
  if (navigator.serviceWorker) {
    navigator.serviceWorker.register('service-worker.js', { scope: './' });
  }
}

function subscribeToStore() {
  store.subscribe(m.redraw);

  const unsubscribeContainers = store.subscribe(() => {
    applicationLoaded();
    unsubscribeContainers();
  });
}

function applicationLoaded() {
  // Header
  const header = document.querySelector('#header');
  header.classList.add('loaded');

  m.mount(header, { view: Header });

  // Spinner
  const spinnerView = <HTMLAnchorElement>document.querySelector('#spinner-view');
  spinnerView.classList.add('loaded');
  spinnerView.onclick = (e) => {
    // TODO: Support ctrl+click
    e.preventDefault();
    setRouteIfNew(spinnerView.getAttribute('href'));
  };
}

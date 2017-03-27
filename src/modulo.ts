import './assets/logo.png';
import './manifest.json';
import './style.scss';

import { Compote } from 'compote/html';
import throttle = require('lodash/throttle');

import { getPosts, PostList } from './post';
import { store } from './store';

const container = document.querySelector('#container');
const spinnerView = document.querySelector('#spinner-view');

initialize();

function initialize() {
  initializeFirebase();
  registerServiceWorker();
  subscribeToStore();
  getPosts();
}

function initializeFirebase() {
  firebase.initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID
  });
}

function registerServiceWorker() {
  if (navigator.serviceWorker) {
    navigator.serviceWorker.register('service-worker.js', { scope: './' });
  }
}

function subscribeToStore() {
  store.subscribe(throttle(render, 10));

  const unsubscribeSpinnerView = store.subscribe(() => {
    spinnerView.classList.add('loaded');
    unsubscribeSpinnerView();
  });
}

function render() {
  const { posts } = store.getState();
  Compote.render(container, [
    PostList(posts)
  ]);
}

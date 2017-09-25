import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

import { Actions, store } from './store';
import { User } from './user';

export interface DataSnapshot<T> extends firebase.database.DataSnapshot {
  val(): T;
}

export function initializeFirebaseApp() {
  firebase.initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID
  });

  firebase.auth().onAuthStateChanged(async (auth: firebase.User) => {
    const action = auth ? Actions.USER_LOGGED_IN : Actions.USER_LOGGED_OUT;
    store.dispatch({ type: action, auth });

    if (!auth) return;

    const userSnapshot: DataSnapshot<User> = await firebase.database().ref(`users/${auth.uid}`).once('value').catch(console.error);
    store.dispatch({ type: Actions.USER_DETAILS_LOADED, user: new User(userSnapshot.val()) });
  });
}

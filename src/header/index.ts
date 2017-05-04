import { a, div } from 'compote/html';
import * as firebase from 'firebase/app';
import { route } from 'mithril';

import { store } from '../store';

// Header
export const Header = () => {
  const { currentUser } = store.getState();
  return (
    currentUser ?
      LoggedInHeader(currentUser)
      :
      LoggedOutHeader(currentUser)
  );
};

// Logged in
const LoggedInHeader = (currentUser: firebase.User) => [
  div(store.getState().currentUser.email),
  a({ classList: 'pointer2', onclick: logout }, 'Logout')
];

export const logout = () => firebase.auth().signOut().catch(console.log).then(() => route.set('/'));

// Logged out
const LoggedOutHeader = (currentUser: firebase.User) => [
  a({ oncreate: route.link, href: '/login' }, 'Login')
];

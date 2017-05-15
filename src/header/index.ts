import './style.scss';

import { div, a, br } from 'compote/html';
import * as firebase from 'firebase/app';
import { route } from 'mithril';

import { store } from '../store';
import { User } from '../user';

// Header
export const Header = () => {
  const { currentUser } = store.getState();
  return (
    currentUser.isLoggedIn() ?
      LoggedInHeader(currentUser)
      :
      LoggedOutHeader(currentUser)
  );
};

// Logged in
const LoggedInHeader = (currentUser: User) => [
  currentUser.canWrite() ? div({ style: { 'margin-right': 'auto' } }, [
    a({ oncreate: route.link, href: '/posts/new' }, '+ New Post'),
    br(),
    a({ target: '_blank', href: `https://console.firebase.google.com/project/${process.env.FIREBASE_PROJECT_ID}/database/data` }, '+ Edit Data')
  ]) : null,
  div({ className: 'text-right' }, [
    div(currentUser.auth.email),
    a({ onclick: logout }, 'Logout')
  ])
];

export const logout = () => firebase.auth().signOut().catch(console.error).then(() => route.set('/'));

// Logged out
const LoggedOutHeader = (currentUser: User) => [
  a({ oncreate: route.link, href: '/login' }, 'Login')
];

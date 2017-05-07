import './style.scss';

import { a, div } from 'compote/html';
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
const LoggedInHeader = (currentUser: User) => (
  div({ className: 'text-right' }, [
    currentUser.canWrite() ? a({ oncreate: route.link, href: '/posts/new' }, 'New Post') : null,
    div(currentUser.auth.email),
    a({ oncreate: route.link, onclick: logout }, 'Logout')
  ])
);

export const logout = () => firebase.auth().signOut().catch(console.error).then(() => route.set('/'));

// Logged out
const LoggedOutHeader = (currentUser: User) => [
  a({ oncreate: route.link, href: '/login' }, 'Login')
];

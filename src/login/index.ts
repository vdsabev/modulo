import './style.scss';

import { form, fieldset, input, br, button } from 'compote/html';
import { Keyboard } from 'compote/components/keyboard';
import { setFlag } from 'compote/components/utils';
import * as firebase from 'firebase/app';
import { route, withAttr } from 'mithril';

let data: {
  email?: string
  password?: string
  loading?: boolean
} = {};

export const LoginForm = () => (
  form({
    className: 'login-form',
    oncreate: () => data = {},
    onsubmit: () => false
  },
    fieldset({ className: 'login-form-container', disabled: data.loading }, [
      input({
        className: 'login-form-input',
        type: 'email', name: 'email', placeholder: 'Email',
        onkeyup: loginOnEnter,
        oninput: setEmail
      }),
      br(),
      input({
        className: 'login-form-input',
        type: 'password', name: 'password', placeholder: 'Password',
        onkeyup: loginOnEnter,
        oninput: setPassword
      }),
      br(),
      button({ className: 'login-form-button', type: 'submit', onclick: login }, 'Login')
    ])
  )
);

const loginOnEnter = (e: KeyboardEvent) => {
  if (e.keyCode === Keyboard.ENTER) {
    login();
  }
};

const setData = (propertyName: keyof typeof data) => (value: any) => data[propertyName] = value;
const setEmail = withAttr('value', setData('email'));
const setPassword = withAttr('value', setData('password'));

export const login = () => {
  const loginPromise = firebase.auth().signInWithEmailAndPassword(data.email, data.password).catch(console.log).then(() => route.set('/'));
  setFlag(data, 'loading').whileAwaiting(loginPromise);

  return loginPromise;
};

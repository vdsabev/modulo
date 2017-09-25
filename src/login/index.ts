import { div, form, fieldset, input, br, button } from 'compote/html';
import { Keyboard } from 'compote/components/keyboard';
import { get, when, equal } from 'compote/components/utils';
import * as firebase from 'firebase/app';
import { route, withAttr } from 'mithril';

let data: {
  email?: string
  password?: string
  loading?: boolean
} = {};

const setData = (propertyName: keyof typeof data) => (value: any) => data[propertyName] = value;
const setEmail = withAttr('value', setData('email'));
const setPassword = withAttr('value', setData('password'));

const login = async () => {
  data.loading = true;
  try {
    await firebase.auth().signInWithEmailAndPassword(data.email, data.password);
    route.set('/');
  }
  catch (error) {
    console.error(error);
  }
  data.loading = false;
};

const loginOnEnter = when(equal(get<KeyboardEvent>('keyCode'), Keyboard.ENTER), login);

// TODO: Use form data
// TODO: Add validation
export const LoginForm = () => (
  form({
    class: 'form',
    oncreate: () => data = {},
    onsubmit: () => false
  },
    fieldset({ class: 'form-panel', disabled: data.loading }, [
      input({
        class: 'form-input',
        type: 'email', name: 'email', placeholder: 'Email',
        onkeyup: loginOnEnter, oninput: setEmail
      }),
      br(),
      input({
        class: 'form-input',
        type: 'password', name: 'password', placeholder: 'Password',
        onkeyup: loginOnEnter, oninput: setPassword
      }),
      br(),
      button({ class: 'form-button', type: 'submit', onclick: login }, 'Login')
    ])
  )
);

export const Login = () => (
  div({ class: 'container' }, LoginForm())
);

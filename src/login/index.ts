import { div, form, fieldset, input, br, button } from 'compote/html';
import { Keyboard } from 'compote/components/keyboard';
import { get, setFlag, when } from 'compote/components/utils';
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

const login = () => {
  const promise = firebase.auth().signInWithEmailAndPassword(data.email, data.password);
  setFlag(data, 'loading').whileAwaiting(promise).catch(console.error).then(() => route.set('/'));
};

const loginOnEnter = when(get<KeyboardEvent>('keyCode'), Keyboard.ENTER, login);

// TODO: Use form data
// TODO: Add validation
export const LoginForm = () => (
  form({
    className: 'form',
    oncreate: () => data = {},
    onsubmit: () => false
  },
    fieldset({ className: 'form-panel', disabled: data.loading }, [
      input({
        className: 'form-input',
        type: 'email', name: 'email', placeholder: 'Email',
        onkeyup: loginOnEnter, oninput: setEmail
      }),
      br(),
      input({
        className: 'form-input',
        type: 'password', name: 'password', placeholder: 'Password',
        onkeyup: loginOnEnter, oninput: setPassword
      }),
      br(),
      button({ className: 'form-button', type: 'submit', onclick: login }, 'Login')
    ])
  )
);

export const Login = () => (
  div({ className: 'container' }, LoginForm())
);

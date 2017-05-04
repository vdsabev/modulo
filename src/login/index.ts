import { form, input, br, button } from 'compote/html';
import { Keyboard } from 'compote/components/keyboard';
import * as firebase from 'firebase/app';
// TODO: Lazy load
import 'firebase/auth';

let email: string;
let password: string;

const loginOnEnter = (e: KeyboardEvent) => {
  if (e.keyCode === Keyboard.ENTER) {
    login();
  }
};

// TODO: Finish
const login = () => {
  firebase.auth().signInWithEmailAndPassword(email, password)
    .catch((error) => {
      console.log(error);
    })
    .then((...args: any[]) => {
      console.log(args);
    });
};

export const Login = () => (
  form({
    oncreate: () => email = password = '',
    onsubmit: () => false
  }, [
    input({
      type: 'email', name: 'email', placeholder: 'Email',
      onkeyup: loginOnEnter,
      oninput(e: Event) {
        email = (<HTMLInputElement>e.currentTarget).value;
      }
    }),
    br(),
    input({
      type: 'password', name: 'password', placeholder: 'Password',
      onkeyup: loginOnEnter,
      oninput(e: Event) {
        password = (<HTMLInputElement>e.currentTarget).value;
      }
    }),
    br(),
    button({ type: 'submit', onclick: login }, 'Login')
  ])
);

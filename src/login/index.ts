import { form, fieldset, input, br, button } from 'compote/html';
import { Keyboard } from 'compote/components/keyboard';
import * as firebase from 'firebase/app';
import { route } from 'mithril';

let data: {
  email?: string,
  password?: string,
  loading?: boolean
};

export const Login = () => (
  form({
    oncreate: () => data = {},
    onsubmit: () => false
  },
    fieldset({ disabled: data.loading }, [
      input({
        type: 'email', name: 'email', placeholder: 'Email',
        onkeyup: loginOnEnter,
        oninput(e: Event) {
          data.email = (<HTMLInputElement>e.currentTarget).value;
        }
      }),
      br(),
      input({
        type: 'password', name: 'password', placeholder: 'Password',
        onkeyup: loginOnEnter,
        oninput(e: Event) {
          data.password = (<HTMLInputElement>e.currentTarget).value;
        }
      }),
      br(),
      button({ type: 'submit', onclick: login }, 'Login')
    ])
  )
);

export const login = () => {
  data.loading = true;
  return firebase.auth().signInWithEmailAndPassword(data.email, data.password)
    .catch((error) => {
      data.loading = false;
      console.log(error); // TODO: Rewrite
    })
    .then(() => {
      data.loading = false;
      route.set('/');
    });
};

const loginOnEnter = (e: KeyboardEvent) => {
  if (e.keyCode === Keyboard.ENTER) {
    login();
  }
};

// TODO: Lazy-load chunk

import { form, fieldset, input, br, textarea, button } from 'compote/html';
import { Keyboard } from 'compote/components/keyboard';
import { constant, get, when } from 'compote/components/utils';
import * as firebase from 'firebase/app';
import { route, withAttr } from 'mithril';

import { Post } from '../post';

let data: {
  post?: Post
  content?: string
  loading?: boolean
} = { post: new Post() };

const initializeData = () => data = { post: new Post() };
const returnFalse = constant(false);

const setPostData = (propertyName: keyof typeof data.post) => (value: any) => data.post[propertyName] = value;
const setImageUrl = withAttr('value', setPostData('imageUrl'));
const setTitle = withAttr('value', (title: string) => {
  data.post.title = title;
  data.post.slug = suggestedSlug(title);
});
const setSlug = withAttr('value', setPostData('slug'));
const setSubtitle = withAttr('value', setPostData('subtitle'));

const suggestedSlug = (text: string) => (text || '').toLowerCase().split(/[\s\W_]+/g).join('-');

const setData = (propertyName: keyof typeof data) => (value: any) => data[propertyName] = value;
const setContent = withAttr('value', setData('content'));

const createPost = async () => {
  try {
    data.loading = true;
    const newPost: Post = { ...data.post, created: firebase.database.ServerValue.TIMESTAMP };
    const createdPost = await firebase.database().ref('posts').push(newPost);
    if (data.content) {
      await firebase.database().ref(`postContent/${createdPost.key}`).set(data.content);
    }
    route.set(`/posts/${newPost.slug}`);
  }
  catch (error) {
    console.error(error);
  }
  finally {
    data.loading = false;
  }
};

const createPostOnEnter = when(get<KeyboardEvent>('keyCode'), Keyboard.ENTER, createPost);

// TODO: Use form data
// TODO: Add validation
export const PostCreateForm = () => (
  form({
    className: 'form',
    oncreate: initializeData,
    onsubmit: returnFalse
  },
    fieldset({ className: 'form-panel lg', disabled: data.loading }, [
      input({
        className: 'form-input',
        type: 'text', name: 'imageUrl', placeholder: 'Image URL', required: true,
        onkeyup: createPostOnEnter, oninput: setImageUrl, value: data.post.imageUrl
      }),
      input({
        className: 'form-input',
        type: 'text', name: 'title', placeholder: 'Title', required: true,
        onkeyup: createPostOnEnter, oninput: setTitle, value: data.post.title
      }),
      br(),
      input({
        className: 'form-input',
        type: 'text', name: 'slug', placeholder: 'Slug',
        onkeyup: createPostOnEnter, oninput: setSlug, value: data.post.slug
      }),
      br(),
      textarea({
        className: 'form-input',
        name: 'subtitle', placeholder: 'Subtitle', rows: 3,
        onkeyup: createPostOnEnter, oninput: setSubtitle, value: data.post.subtitle
      }),
      br(),
      textarea({
        className: 'form-input',
        name: 'content', placeholder: 'Content', rows: 6,
        onkeyup: createPostOnEnter, oninput: setContent, value: data.content
      }),
      br(),
      button({ className: 'form-button', type: 'submit', onclick: createPost }, 'Create')
    ])
  )
);

// TODO: Lazy-load chunk

import './style.scss';

import { div, form, fieldset, input, br, textarea, button } from 'compote/html';
import { Keyboard } from 'compote/components/keyboard';
import { flex } from 'compote/components/flex';
import { constant } from 'compote/components/utils';
import * as firebase from 'firebase/app';
import { route, withAttr } from 'mithril';

import { Post, PostItem } from '../post';

let data: Data = { post: new Post() };
type Data = {
  post?: Post
  content?: string
  loading?: boolean
};

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

const suggestedSlug = (text: string) => (
  (text || '')
    .replace(`'`, '')
    .replace(/(\d+)%/g, '\\$1-percent')
    .replace(/[\s\W_]+/g, '-')
    .toLowerCase()
);

const setData = (propertyName: keyof typeof data) => (value: any) => data[propertyName] = value;
const setContent = withAttr('value', setData('content'));

const createPost = async () => {
  try {
    data.loading = true;
    const newPost: Post = { ...data.post, created: firebase.database.ServerValue.TIMESTAMP };
    const createdPost = await firebase.database().ref('posts').push(newPost);

    if (!data.content) return;

    await firebase.database().ref(`postContent/${createdPost.key}`).set(data.content);
    route.set(`/posts/${newPost.slug}`);
  }
  catch (error) {
    console.error(error);
  }
  finally {
    data.loading = false;
  }
};

export const PostCreate = () => (
  div({ class: 'flex-row justify-content-stretch align-items-stretch', oncreate: initializeData }, [
    div({ style: flex(1) }, PostForm()),
    div({ class: 'post-preview', style: flex(1) }, PostItem(new Post({ content: data.content }, data.post)))
  ])
);

// TODO: Use form data
// TODO: Add validation
export const PostForm = () => (
  form({ class: 'form', onsubmit: returnFalse },
    fieldset({ class: 'form-panel lg', disabled: data.loading }, [
      input({
        class: 'form-input',
        type: 'text', name: 'imageUrl', placeholder: 'Image URL', required: true,
        value: data.post.imageUrl, oninput: setImageUrl
      }),
      input({
        class: 'form-input',
        type: 'text', name: 'title', placeholder: 'Title', required: true,
        value: data.post.title, oninput: setTitle
      }),
      br(),
      input({
        class: 'form-input',
        type: 'text', name: 'slug', placeholder: 'Slug',
        value: data.post.slug, oninput: setSlug
      }),
      br(),
      textarea({
        class: 'form-input',
        name: 'subtitle', placeholder: 'Subtitle', rows: 3,
        value: data.post.subtitle, oninput: setSubtitle
      }),
      br(),
      textarea({
        class: 'form-input',
        name: 'content', placeholder: 'Content', rows: 15,
        value: data.content, oninput: setContent
      }),
      br(),
      button({ class: 'form-button', type: 'submit', onclick: createPost }, 'Create')
    ])
  )
);

import './style.scss';

import { section, article, h1, div } from 'compote/html';

import { Actions } from '../actions';
import { html } from '../marked';
import Model from '../model';
import { store } from '../store';

export class Post extends Model<Post> {
  id?: string;
  title?: string;
  subtitle?: string;
}

export function getPosts() {
  const postsRef = firebase.database().ref('posts');
  postsRef.off('child_added');
  postsRef.on('child_added', addPost);
}

export function addPost(postChildSnapshot: FirebaseSnapshot<Post>) {
  const post = new Post({ id: postChildSnapshot.key }, postChildSnapshot.val());
  store.dispatch({ type: Actions.ADD_POST, post });
}

export const PostItem = (post: Post) => (
  article({ className: 'post-item fade-in-animation' }, [
    h1({ className: 'post-item-title' }, post.title),
    div(html(post.subtitle))
  ])
);

export const PostList = (posts: Post[]) => (
  section({ className: 'post-list' },
    posts.map(PostItem)
  )
);

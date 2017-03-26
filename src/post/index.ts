import './style.scss';

import { section, article, h1, img, div } from 'compote/html';

import { Actions } from '../actions';
import { flex } from '../flex';
import { html } from '../marked';
import Model from '../model';
import { store } from '../store';

export class Post extends Model<Post> {
  id?: string;
  imageUrl?: string;
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
  article({ className: 'post-item fade-in-animation' },
    div({ className: 'flex-row-md justify-content-start align-items-start' }, [
      div({ className: 'flex-item', style: flex('1 1 50%') },
        // NOTE: The img tag needs to be wrapped with a div, otherwise the flex box breaks in Chrome
        // http://codepen.io/vdsabev/pen/mWjpXN
        img({ src: post.imageUrl })
      ),
      div({ className: 'flex-item', style: flex('1 1 50%') }, [
        h1({ className: 'post-item-title' }, post.title),
        div(html(post.subtitle))
      ])
    ])
  )
);

export const PostList = (posts: Post[]) => (
  section({ className: 'post-list' },
    posts.map(PostItem)
  )
);

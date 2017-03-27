import './style.scss';

import { section, article, h1, img, div, small } from 'compote/html';

import { Timeago } from '../timeago';
import { AspectRatioContainer } from '../aspect-ratio-container';
import { Actions } from '../actions';
import { flex } from '../flex';
import { toHTML } from '../marked';
import Model from '../model';
import { store } from '../store';

export class Post extends Model<Post> {
  id?: string;
  imageUrl?: string;
  title?: string;
  subtitle?: string;
  created?: number;
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
  article({ className: 'post-item flex-row-md justify-content-start align-items-stretch fade-in-animation' }, [
    div({ className: 'flex-item', style: flex(1) },
      AspectRatioContainer({ x: 4, y: 3 },
        // NOTE: The img tag needs to be wrapped with a div, otherwise the flex box breaks in Chrome
        // http://codepen.io/vdsabev/pen/mWjpXN
        img({ className: 'absolute stretch', src: post.imageUrl })
      )
    ),
    div({ className: 'flex-item', style: flex(1) }, [
      h1({ className: 'post-item-title' }, <any>toHTML(post.title)),
      div({ className: 'post-item-subtitle' }, <any>toHTML(post.subtitle)),
      small(Timeago(new Date(post.created)))
    ])
  ])
);

export const PostList = (posts: Post[]) => (
  section({ className: 'post-list' },
    posts.map(PostItem)
  )
);

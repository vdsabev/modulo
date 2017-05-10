import './style.scss';

import { section, article, a, img, div, small } from 'compote/html';
import { AspectRatioContainer } from 'compote/components/aspect-ratio-container';
import { flex } from 'compote/components/flex';
import { Model } from 'compote/components/model';
import { Timeago } from 'compote/components/timeago';
import * as firebase from 'firebase/app';
import { route } from 'mithril';

import { DataSnapshot } from '../firebase';
import { toHTML } from '../marked';
import { Actions, store } from '../store';

export class Post extends Model<Post> {
  id?: string;
  imageUrl?: string;
  title?: string;
  slug?: string;
  subtitle?: string;
  created?: number | Object;
  content?: string;
}

export function loadPosts() {
  store.dispatch({ type: Actions.RESET_POSTS });

  const postsRef = firebase.database().ref('posts');
  postsRef.off('child_added');
  postsRef.on('child_added', (postChildSnapshot: DataSnapshot<Post>) => {
    const post = new Post({ id: postChildSnapshot.key }, postChildSnapshot.val());
    store.dispatch({ type: Actions.POST_ADDED, post });
  });
}

export function loadPostBySlug({ slug }: Record<string, string>) {
  firebase.database().ref('posts').orderByChild('slug').equalTo(slug).once('value').then((postsSnapshot: DataSnapshot<Record<string, Post>>) => {
    const posts = postsSnapshot.val();
    const [id] = Object.keys(posts);
    const post = new Post({ id }, posts[id]);
    store.dispatch({ type: Actions.POST_LOADED, post });

    firebase.database().ref(`postContent/${post.id}`).once('value').then((postContentSnapshot: DataSnapshot<string>) => {
      store.dispatch({ type: Actions.POST_CONTENT_LOADED, content: postContentSnapshot.val() });
    });
  });
}

export const PostItem = (post: Post) => (
  post == null ? null :
  article({ key: post.id, className: 'post-item fade-in-animation' }, [
    div({ className: 'flex-row-md justify-content-start align-items-stretch' }, [
      div({ className: 'flex-item', style: flex(1) },
        AspectRatioContainer({ x: 4, y: 3 },
          // NOTE: The img tag needs to be wrapped with a div, otherwise the flex box breaks in Chrome
          // http://codepen.io/vdsabev/pen/mWjpXN
          img({ className: 'absolute stretch', src: post.imageUrl })
        )
      ),
      div({ className: 'flex-item', style: flex(1) }, [
        a({ className: 'post-item-title h1', href: `/posts/${post.slug}`, oncreate: route.link }, toHTML(post.title)),
        div({ className: 'post-item-subtitle' }, toHTML(post.subtitle)),
        post.created ? small(Timeago(new Date(post.created))) : null
      ])
    ]),
    post.content ? div({ className: 'post-item-content' }, post.content) : null
  ])
);

export const PostList = (posts: Post[]) => (
  section({ className: 'post-list container' },
    posts.map(PostItem)
  )
);

export const PostDetails = (post: Post) => (
  div({ className: 'container' },
    PostItem(post)
  )
);

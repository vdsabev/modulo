import './style.scss';

import { section, article, a, img, div, small } from 'compote/html';
import { Timeago } from 'compote/components/timeago';
import { route } from 'mithril';

import { AspectRatioContainer } from 'compote/components/aspect-ratio-container';
import { Actions } from '../actions';
import { flex } from 'compote/components/flex';
import { toHTML } from '../marked';
import Model from '../model';
import { store } from '../store';

export class Post extends Model<Post> {
  id?: string;
  imageUrl?: string;
  title?: string;
  slug?: string;
  subtitle?: string;
  created?: number;
  content?: string;
}

export function loadPosts() {
  store.dispatch({ type: Actions.RESET_POSTS });

  const postsRef = firebase.database().ref('posts');
  postsRef.off('child_added');
  postsRef.on('child_added', (postChildSnapshot: FirebaseSnapshot<Post>) => {
    const post = new Post({ id: postChildSnapshot.key }, postChildSnapshot.val());
    store.dispatch({ type: Actions.POST_ADDED, post });
  });
}

export function loadPostBySlug(slug: string) {
  firebase.database().ref(`posts`).orderByChild('slug').equalTo(slug).once('value').then((postsSnapshot: FirebaseSnapshot<Record<string, Post>>) => {
    const posts = postsSnapshot.val();
    const [id] = Object.keys(posts);
    const post = new Post({ id }, posts[id]);
    store.dispatch({ type: Actions.POST_LOADED, post });

    firebase.database().ref(`postContent/${post.id}`).once('value').then((postContentSnapshot: FirebaseSnapshot<string>) => {
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
        small(Timeago(new Date(post.created)))
      ])
    ]),
    post.content ? div({ className: 'post-item-content' }, post.content) : null
  ])
);

export const PostList = (posts: Post[]) => (
  section({ className: 'post-list' },
    posts.map(PostItem)
  )
);

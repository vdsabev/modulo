import { route } from 'mithril';

import { Forbidden } from '../403-forbidden';
import { Login } from '../login';
import { loadPosts, loadPostBySlug, PostList, PostDetails } from '../post';
import { PostCreate } from '../post-create';
import { Actions, store } from '../store';

export function setRouteIfNew(newRoute: string) {
  if (newRoute !== route.get()) {
    route.set(newRoute);
  }
}

export const requireWriterAccess = (component: Function, ...args: any[]) => () => {
  const { currentUser } = store.getState();
  return currentUser.canWrite() ? component(...args) : Forbidden();
};

export function initializeRouter() {
  route.prefix('');

  const container = document.querySelector('#container');
  route(container, '/', {
    '/': { onmatch: loadPosts, render: PostListPage },
    '/posts/new': { render: PostCreatePage },
    '/posts/:slug': { onmatch: loadPostBySlug, render: PostDetailsPage },
    '/login': { render: Login }
  });
}

export const PostListPage = () => {
  const { posts } = store.getState();
  return PostList(posts);
};

export const PostCreatePage = requireWriterAccess(PostCreate);

export const PostDetailsPage = () => {
  const { post } = store.getState();
  return PostDetails(post);
};

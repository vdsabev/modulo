import { route } from 'mithril';

import { Login } from '../login';
import { loadPosts, loadPostBySlug, PostList, PostItem } from '../post';
import { Actions, store } from '../store';

export function setRouteIfNew(newRoute: string) {
  if (newRoute !== route.get()) {
    route.set(newRoute);
  }
}

export function applicationLoaded() {
  store.dispatch({ type: Actions.APPLICATION_LOADED });
}

export function initializeRouter() {
  route.prefix('');

  const container = document.querySelector('#container');
  route(container, '/', {
    // TODO: Load application after data is resolved
    '/': { onmatch: loadPosts, render: PostListPage },
    '/posts/:slug': { onmatch: loadPostBySlug, render: PostDetailsPage },
    '/login': { onmatch: applicationLoaded, render: Login }
  });
}

export const PostListPage = () => {
  const { posts } = store.getState();
  return PostList(posts);
};

export const PostDetailsPage = () => {
  const { post } = store.getState();
  return PostItem(post);
};

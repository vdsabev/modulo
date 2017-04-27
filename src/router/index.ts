import { route } from 'mithril';

import { loadPosts, loadPostBySlug, PostList, PostItem } from '../post';
import { store } from '../store';

export const PostListPage = () => {
  const { posts } = store.getState();
  return PostList(posts);
};

export const PostDetailsPage = () => {
  const { post } = store.getState();
  return PostItem(post);
};

export const LoginPage = () => {
  // TODO
  const { post } = store.getState();
  return PostItem(post);
};

export function initializeRouter() {
  route.prefix('');

  const container = document.querySelector('#container');
  route(container, '/', {
    '/': { onmatch: loadPosts, render: PostListPage },
    '/posts/:slug': { onmatch: loadPostBySlug, render: PostDetailsPage },
    '/login': { render: LoginPage }
  });
}

export function setRouteIfNew(newRoute: string) {
  if (newRoute !== route.get()) {
    route.set(newRoute);
  }
}

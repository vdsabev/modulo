import { route } from 'mithril';

import { Forbidden } from '../403-forbidden';
import { LoginForm } from '../login';
import { loadPosts, loadPostBySlug, PostList, PostItem } from '../post';
import { PostCreateForm } from '../post-create';
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
    // TODO: Load application after data is resolved
    '/': { onmatch: loadPosts, render: PostListPage },
    '/posts/new': { render: PostCreatePage },
    '/posts/:slug': { onmatch: loadPostBySlug, render: PostDetailsPage },
    '/login': { onmatch: applicationLoaded, render: LoginForm }
  });
}

export const PostListPage = () => {
  const { posts } = store.getState();
  return PostList(posts);
};

export const PostCreatePage = requireWriterAccess(PostCreateForm);

export const PostDetailsPage = () => {
  const { post } = store.getState();
  return PostItem(post);
};

export function applicationLoaded() {
  store.dispatch({ type: Actions.APPLICATION_LOADED });
}

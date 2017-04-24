import { route } from 'mithril';

import { loadPosts, loadPostBySlug, PostList, PostItem } from './post';
import { store } from './store';

const container = document.querySelector('#container');

export function initializeRouter() {
  route.prefix('');
  route(container, '/', {
    '/': {
      onmatch: () => loadPosts(),
      render() {
        const { posts } = store.getState();
        return PostList(posts);
      }
    },
    '/posts/:slug': {
      onmatch: ({ slug }) => loadPostBySlug(slug),
      render() {
        const { post } = store.getState();
        return PostItem(post);
      }
    }
  });
}

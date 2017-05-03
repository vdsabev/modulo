import { logger } from 'compote/components/logger';
import { createStore, combineReducers, applyMiddleware } from 'redux';

import { Actions } from './actions';
import { Post } from './post';

export type State = {
  posts: Post[],
  post: Post
};

const reducers = combineReducers<State>({ posts, post });
export const store = createStore(
  reducers,
  process.env.NODE_ENV === 'production' ? undefined : applyMiddleware(logger)
);

export type Action = {
  [key: string]: any;
  type?: Actions
};

export function posts(state: Post[] = [], action: Action = {}): Post[] {
  switch (action.type) {
  case Actions.RESET_POSTS:
    return [];
  case Actions.POST_ADDED:
    return [action.post, ...state];
  default:
    return state;
  }
}

export function post(state: Post = null, action: Action = {}): Post {
  switch (action.type) {
  case Actions.POST_LOADED:
    return action.post;
  case Actions.POST_CONTENT_LOADED:
    return { ...state, content: action.content };
  default:
    return state;
  }
}

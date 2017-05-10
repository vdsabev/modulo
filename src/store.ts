import { logger } from 'compote/components/logger';
import { createStore, combineReducers, applyMiddleware } from 'redux';

import { Post } from './post';
import { User } from './user';

type State = {
  /** Post list */
  posts: Post[]
  /** Post details */
  post: Post,
  /** Current user */
  currentUser: User
};

export enum Actions {
  RESET_POSTS = <any>'RESET_POSTS',
  POST_ADDED = <any>'POST_ADDED',

  POST_LOADED = <any>'POST_LOADED',
  POST_CONTENT_LOADED = <any>'POST_CONTENT_LOADED',

  USER_DETAILS_LOADED = <any>'USER_DETAILS_LOADED',
  USER_LOGGED_IN = <any>'USER_LOGGED_IN',
  USER_LOGGED_OUT = <any>'USER_LOGGED_OUT'
}

export const store = createStore(
  combineReducers<State>({ posts, post, currentUser }),
  process.env.NODE_ENV === 'production' ? undefined : applyMiddleware(logger)
);

export function posts(state: Post[] = [], action: Action<Actions> = {}): Post[] {
  switch (action.type) {
  case Actions.RESET_POSTS:
    return [];
  case Actions.POST_ADDED:
    return [action.post, ...state];
  default:
    return state;
  }
}

export function post(state: Post = null, action: Action<Actions> = {}): Post {
  switch (action.type) {
  case Actions.POST_LOADED:
    return action.post;
  case Actions.POST_CONTENT_LOADED:
    return { ...state, content: action.content };
  default:
    return state;
  }
}

export function currentUser(state: User = new User(), action: Action<Actions> = {}): User {
  switch (action.type) {
  case Actions.USER_DETAILS_LOADED:
    return new User({ ...state, ...action.user });
  case Actions.USER_LOGGED_IN:
    return new User({ auth: action.auth });
  case Actions.USER_LOGGED_OUT:
    return new User();
  default:
    return state;
  }
}

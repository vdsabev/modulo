import { logger } from 'compote/components/logger';
import { createStore, combineReducers, applyMiddleware } from 'redux';

import { Post } from './post';

type State = {
  /** A dummy property used to trigger a store subscriptions */
  applicationLoaded: boolean
  /** Post list */
  posts: Post[]
  /** Post details */
  post: Post
};

export enum Actions {
  APPLICATION_LOADED = <any>'APPLICATION_LOADED',
  RESET_POSTS = <any>'RESET_POSTS',
  POST_ADDED = <any>'POST_ADDED',
  POST_LOADED = <any>'POST_LOADED',
  POST_CONTENT_LOADED = <any>'POST_CONTENT_LOADED'
}

export const store = createStore(
  combineReducers<State>({ applicationLoaded, posts, post }),
  process.env.NODE_ENV === 'production' ? undefined : applyMiddleware(logger)
);

export function applicationLoaded(state = false, action: Action<Actions> = {}): boolean {
  switch (action.type) {
  case Actions.APPLICATION_LOADED:
    return true;
  default:
    return state;
  }
}

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

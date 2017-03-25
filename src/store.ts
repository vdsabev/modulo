import { createStore, combineReducers, applyMiddleware } from 'redux';

import { Actions } from './actions';
import { logger } from './logger';
import { Post } from './post';

export type State = {
  posts: Post[]
};

const reducers = combineReducers<State>({ posts });
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
  case Actions.ADD_POST:
    return [action.post, ...state];
  default:
    return state;
  }
}

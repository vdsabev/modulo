import 'jest';

import { logger } from './index';
import { store } from '../store';

const result = { a: 0 };
const action = { b: 1 };

it(`should log the action & the next state`, () => {
  console.log = jest.fn();
  logger(store)(() => result)(action);
  expect(console.log).toHaveBeenCalledWith('dispatching', action);
  expect(console.log).toHaveBeenCalledWith('next state', store.getState());
});

it(`should return the result of next function`, () => {
  expect(logger(store)(() => result)(action)).toBe(result);
});

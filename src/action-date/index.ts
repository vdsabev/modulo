import { div } from 'compote/html';
import timeago from 'timeago.js';

import { Clock } from '../clock';

export const ActionDate = (date: Date) => (
  div({
    className: 'flex-row justify-content-start align-items-center',
    title: date.toLocaleString()
  }, [
    Clock(date),
    // TODO: Cache instance & automatically update `timeago`
    timeago().format(date)
  ])
);

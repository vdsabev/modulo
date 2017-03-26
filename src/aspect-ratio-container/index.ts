import './style.scss';

import { div } from 'compote/html';

export const AspectRatioContainer = (aspectRatio: { x: number, y: number }, content: Mithril.Children) => (
  div({ className: 'aspect-ratio-container' }, [
    div({ style: { 'padding-bottom': `${100 * aspectRatio.y / aspectRatio.x}%` } }),
    content
  ])
);

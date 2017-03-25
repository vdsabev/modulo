import marked = require('marked');
import { trust } from 'mithril';

export const isLocal = (href: string): boolean => href.indexOf(`//${window.location.host}`) !== -1;

const renderer = new marked.Renderer();
renderer.link = (href, title, text) => {
  const target = isLocal(href) ? '_self' : '_blank';
  return `<a target="${target}" href="${href}" title="${title || ''}">${text || ''}</a>`;
};

export const html = (text: string) => trust(marked(text, { renderer }));

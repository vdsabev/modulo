import { a } from 'compote/html';
import { route } from 'mithril';

export const Header = () => (
  a({ oncreate: route.link, href: '/login' }, 'Login')
);

// @flow

import type { Node, VFile, NextFunction } from 'unified';

type Options = {
  env?: string,
  visitor?: (Node, ?string) => string,
  className?: string,
};

export default function attacher(options: Options = {}) {
  const env = options.env || process.env.NODE_ENV || 'production';
  const className = options.className || 'galley-comment galley-comment-block';

  function transformer(tree: Node, _: VFile, next: NextFunction) {
    tree.children.reverse().forEach((node: Node, i: number) => {
      const { lang } = node;
      if (lang !== 'comment') {
        return;
      }

      if (env === 'production') {
        tree.children.splice(i, 1);
        return;
      }

      const galleyComments = node.value
        .replace(/\r\n/, '\n')
        .split('\n')
        .map((line: string) => {
          return {
            type: 'text',
            value: line,
          };
        })
        .reduce((acc, item) => {
          return acc.concat(item, { type: 'break' });
        }, []);
      const astItem = {
        type: 'paragraph',
        children: galleyComments.slice(0, galleyComments.length - 1),
        data: {
          hProperties: {
            className: className ? className : null,
          },
        },
      };

      tree.children.splice(i, 1, astItem);
    });

    tree.children.reverse();

    next(null, tree);
  }

  return transformer;
}

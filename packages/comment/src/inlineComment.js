// @flow

import type { VFile, Node, NextFunction } from 'unified';

type Options = {
  env?: string,
  visitor?: (Node, ?string) => string,
  className?: string,
};

const commentRegExp = /#\[(.+?)\]/;

export default function attacher(options: Options = {}) {
  const { Parser, Compiler } = this;
  const env = options.env || process.env.NODE_ENV || 'production';
  const className = options.className || 'galley-comment galley-comment-inline';

  Parser.prototype.inlineTokenizers.inlineComment = inlineTokenizer;
  Parser.prototype.inlineMethods.splice(Parser.prototype.inlineMethods.indexOf('autoLink'), 0, 'inlineComment');
  inlineTokenizer.locator = locator;

  if (Compiler != null) {
    const { visitors } = Compiler.prototype;
    if (visitors) {
      visitors.inlineComment = (node: Node): string => {
        return (options.visitor || visitor)(node, env);
      };
    }
  }

  return transformer;

  function transformer(tree: Node, file: VFile, next: NextFunction) {
    tree.children.reverse().forEach((node: Node, i: number) => {
      if (node.children.length >= 1) {
        return;
      }

      if (node.type !== 'paragraph') {
        return;
      }

      tree.children.splice(i, 1);
    });

    tree.children.reverse();

    next(null, tree, file);
  }

  function inlineTokenizer(eat, value: string) {
    const match = commentRegExp.exec(value);
    if (!match) {
      return null;
    }

    const [matchText, text] = match;

    if (env === 'production') {
      return eat(matchText);
    }

    return eat(matchText)({
      type: 'inlineComment',
      data: {
        hName: 'span',
        hProperties: {
          className: className ? className : null,
        },
        hChildren: [
          {
            type: 'text',
            value: text,
          },
        ],
      },
      children: [
        {
          type: 'text',
          value: text,
        },
      ],
    });
  }
}

function locator(value: string, fromIndex: number) {
  return value.indexOf('#[', fromIndex);
}

function visitor(node: Node, env: string) {
  if (env === 'production') {
    return '';
  }

  return `#[${node.children[0].value}]`;
}

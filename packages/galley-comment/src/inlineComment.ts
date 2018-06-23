/// <reference path="types.d.ts" />

export interface Options {
  readonly env: string;
  readonly visitor: (node: ASTNode, env: string) => string;
  readonly className: string | null;
}

export type PartialOptions = { [O in keyof Options]?: Options[O] };

const commentRegExp = /#\[(.+?)\]/;
const defaultOptions: Options = {
  env: process.env.NODE_ENV || 'production',
  className: 'galley-comment galley-comment-inline',
  visitor: visitor,
};

export default function attacher(_options: PartialOptions = {}) {
  // @ts-ignore
  const { Parser, Compiler } = this;
  const options = { ...defaultOptions, ..._options };
  const { env, className, visitor } = options;

  Parser.prototype.inlineTokenizers.inlineComment = inlineTokenizer;
  Parser.prototype.inlineMethods.splice(Parser.prototype.inlineMethods.indexOf('autoLink'), 0, 'inlineComment');
  // @ts-ignore
  inlineTokenizer.locator = locator;

  if (Compiler != null) {
    Compiler.prototype.visitors.inlineComment = visitor;
  }

  return transformer;

  function transformer(tree: ASTNode, file: any, next: NextFunction) {
    tree.children.reverse().forEach((node: ASTNode, i: number) => {
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

  function inlineTokenizer(eat: any, value: string) {
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

function visitor(node: ASTNode, env: string) {
  if (env === 'production') {
    return '';
  }

  return `#[${node.children[0].value}]`;
}

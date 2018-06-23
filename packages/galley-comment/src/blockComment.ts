/// <reference path="types.d.ts" />

export interface Options {
  readonly env: string;
  readonly className: string | null;
}

export type PartialOptions = { [O in keyof Options]?: Options[O] };

const defaultOptions: Options = {
  env: process.env.NODE_ENV || 'production',
  className: 'galley-comment galley-comment-block',
};

export default function attacher(_options: PartialOptions = {}) {
  const options = { ...defaultOptions, ..._options };
  const { env, className } = options;

  function transformer(tree: ASTNode, _: any, next: NextFunction) {
    tree.children.reverse().forEach((node: ASTNode, i: number) => {
      if (node.lang !== 'comment') {
        return;
      }

      if (env === 'production') {
        tree.children.splice(i, 1);
        return;
      }

      const galleyComments: ASTNode[] = node.value
        .replace(/\r\n/, '\n')
        .split('\n')
        .map(
          (line: string): ASTNode => {
            return {
              type: 'text',
              value: line,
            };
          },
        )
        .reduce((acc: ASTNode[], item: ASTNode): ASTNode[] => {
          return acc.concat(item, { type: 'break' });
        }, []);
      const astItem = {
        type: 'paragraph',
        children: galleyComments.slice(0, galleyComments.length - 1),
        data: {
          hProperties: {
            className: className,
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

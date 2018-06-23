interface Options {
  readonly env: string;
  readonly visitor: (node: Node, env: string) => string;
  readonly className: string | null;
}

type PartialOptions = { [O in keyof Options]?: Options[O] };

export default function attacher(_options: PartialOptions = {}) {
  const options = { ...defaultOptions, ..._options };

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

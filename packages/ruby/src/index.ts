import optionParser from './optionParser';

interface Options {
  readonly env: string;
  readonly visitor: (node: Node, env: string) => string;
  readonly className: string | null;
  readonly rpBefore: string;
  readonly rpAfter: string;
}

type PartialOptions = { [O in keyof Options]?: Options[O] };

type Node = any;

const rubyRegExp = /\[(.+?)\]\((.+?)\)\{(.+?)\}/;
const defaultOptions: Options = {
  env: 'development',
  className: null,
  visitor: visitor,
  rpBefore: '(',
  rpAfter: ')',
};

export default function attacher(_options: PartialOptions) {
  // @ts-ignore
  const { Parser, Compiler } = this;
  const options = { ...defaultOptions, ..._options };

  Parser.prototype.inlineTokenizers.ruby = inlineTokenizer;
  Parser.prototype.inlineMethods.splice(Parser.prototype.inlineMethods.indexOf('autoLink'), 0, 'ruby');
  // @ts-ignore
  inlineTokenizer.locator = locator;

  if (Compiler != null) {
    Compiler.prototype.visitors.ruby = options.visitor;
  }

  function inlineTokenizer(eat: any, value: string): any {
    const match = rubyRegExp.exec(value);
    if (!match) {
      return null;
    }

    const [matchText, baseText, rubyText, optionString] = match;
    const braceOptions = optionParser(optionString);

    if (braceOptions.ruby !== true) {
      return eat(matchText)({
        type: 'text',
        value: matchText,
      });
    }

    return eat(matchText)({
      type: 'ruby',
      data: {
        baseText: baseText,
        rubyText: rubyText,
        hName: 'ruby',
        hProperties: {
          className: options.className,
        },
        hChildren: [
          {
            type: 'text',
            value: baseText,
          },
          {
            type: 'element',
            tagName: 'rp',
            children: [
              {
                type: 'text',
                value: options.rpBefore,
              },
            ],
          },
          {
            type: 'element',
            tagName: 'rt',
            children: [
              {
                type: 'text',
                value: rubyText,
              },
            ],
          },
          {
            type: 'element',
            tagName: 'rp',
            children: [
              {
                type: 'text',
                value: options.rpAfter,
              },
            ],
          },
        ],
      },
    });
  }
}

function locator(value: string, fromIndex: number): number {
  const re = new RegExp(rubyRegExp.source);
  re.lastIndex = fromIndex - 1;
  const match = re.exec(value);
  if (match == null) {
    return -1;
  }

  return match.index;
}

function visitor(node: Node): string {
  return `[${node.data.baseText}](${node.data.rubyText}){ruby}`;
}

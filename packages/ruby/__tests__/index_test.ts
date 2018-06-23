/// <reference path="index_test.d.ts" />
import unified from 'unified';
import markdown from 'remark-parse';
import remark2rehype from 'remark-rehype';
import stringify from 'rehype-stringify';
import ruby from '../src/index';

jest.setTimeout(500);

interface ParseResult {
  contents: string;
}

async function parse(text: string, options: Object = {}): Promise<ParseResult> {
  const processor = unified()
    .use(markdown)
    .use(ruby, options)
    .use(remark2rehype)
    .use(stringify);

  const ret = await processor.process(text);

  return ret;
}

describe('ruby', () => {
  it('should return <ruby />', async () => {
    const ast = await parse(`[base text](ruby text){ruby}`);

    expect(ast.contents).toBe('<p><ruby>base text<rp>(</rp><rt>ruby text</rt><rp>)</rp></ruby></p>');
  });
});

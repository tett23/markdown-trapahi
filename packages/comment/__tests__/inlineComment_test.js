// @flow

// import jest, { describe, it, expect } from 'jest';
import unified from 'unified';
import markdown from 'remark-parse';
import remark2rehype from 'remark-rehype';
import stringify from 'rehype-stringify';
import parser from '../src/inlineComment';

jest.setTimeout(500);

async function parse(text: string): Object {
  const processor = unified()
    .use(markdown)
    .use(parser)
    .use(remark2rehype)
    .use(stringify);

  const ret = await processor.process(text);

  return ret;
}

describe('inlineComment parser', () => {
  it('hoge', async () => {
    const ast = await parse('hoge');

    expect(ast.contents).toBe('<p>hoge</p>');
  });

  it('#[comment]', async () => {
    const ast = await parse('#[comment]');

    expect(ast.contents).toBe('<p><span>comment</span></p>');
  });
});

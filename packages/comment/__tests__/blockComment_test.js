// @flow

// import jest, { describe, it, expect } from 'jest';
import unified from 'unified';
import markdown from 'remark-parse';
import remark2rehype from 'remark-rehype';
import stringify from 'rehype-stringify';
import parser from '../src/blockComment.js';

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

describe('blockComment parser', () => {
  it('hoge', async () => {
    const text = `
\`\`\` comment
comment
\`\`\`
    `;
    const ast = await parse(text);

    expect(ast.contents).toBe('<p class="galley-comment galley-comment-block">comment</p>');
  });
});

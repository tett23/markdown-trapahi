/// <reference path="blockComment_test.d.ts" />
/// <reference path="../src/blockComment.d.ts" />
import unified from 'unified';
import markdown from 'remark-parse';
import remark2rehype from 'remark-rehype';
import stringify from 'rehype-stringify';
import parser from '../src/blockComment';

jest.setTimeout(500);

interface ParseResult {
  contents: string;
}

async function parse(text: string, options: PartialOptions = {}): Promise<ParseResult> {
  const processor = unified()
    .use(markdown)
    .use(parser, options)
    .use(remark2rehype)
    .use(stringify);
  const ret = await processor.process(text);

  return ret;
}

describe('blockComment', () => {
  it('should transform to paragraph from code fence', async () => {
    const text = `
\`\`\` comment
comment text
\`\`\`
    `;
    const ast = await parse(text);

    expect(ast.contents).toBe('<p class="galley-comment galley-comment-block">comment text</p>');
  });

  it('should replace \\n to mdast break', async () => {
    const text = `
\`\`\` comment
line1
line2
\`\`\`
    `;
    const ast = await parse(text);

    expect(ast.contents).toBe('<p class="galley-comment galley-comment-block">line1<br>\nline2</p>');
  });

  it('when environment is "production" should remove fenced comment', async () => {
    const text = `
\`\`\` comment
comment text
\`\`\`
    `;
    const ast = await parse(text, { env: 'production' });

    expect(ast.contents).toBe('');
  });

  it('when pass className option should attach class attribute to paragraph', async () => {
    const text = `
\`\`\` comment
comment text
\`\`\`
    `;
    const ast = await parse(text, { className: 'test-class' });

    expect(ast.contents).toBe('<p class="test-class">comment text</p>');
  });

  it('when lang is not comment, attacher should nothing to do', async () => {
    const text = `
\`\`\` comment
comment text
\`\`\`
    `;
    const ast = await parse(text, { className: 'test-class' });

    expect(ast.contents).toBe('<p class="test-class">comment text</p>');
  });
});

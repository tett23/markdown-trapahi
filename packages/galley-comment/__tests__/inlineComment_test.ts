/// <reference path="inlineComment_test.d.ts" />
import unified from 'unified';
import markdown from 'remark-parse';
import remark2rehype from 'remark-rehype';
import stringify from 'rehype-stringify';
import inlineComment from '../src/inlineComment';

jest.setTimeout(500);

interface ParseResult {
  contents: string;
}

async function parse(text: string, options: PartialOptions = {}): Promise<ParseResult> {
  const processor = unified()
    .use(markdown)
    .use(inlineComment, options)
    .use(remark2rehype)
    .use(stringify);
  const ret = await processor.process(text);

  return ret;
}

describe('blockComment', () => {
  it('should return span', async () => {
    const ast = await parse(`#[comment text]`);

    expect(ast.contents).toBe('<p><span class="galley-comment galley-comment-inline">comment text</span></p>');
  });

  it('when environment is "production" should remove inline comment', async () => {
    const ast = await parse(`#[comment text]text`, { env: 'production' });

    expect(ast.contents).toBe('<p>text</p>');
  });

  it('if children is empty when after tokenizer processed should remove inline comment', async () => {
    const ast = await parse(`#[comment text]`, { env: 'production' });

    expect(ast.contents).toBe('');
  });

  it('when pass className option should attach class attribute to span', async () => {
    const ast = await parse(`#[comment text]`, { className: 'test-class' });

    expect(ast.contents).toBe('<p><span class="test-class">comment text</span></p>');
  });
});

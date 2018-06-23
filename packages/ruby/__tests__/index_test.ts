/// <reference path="index_test.d.ts" />
import unified from 'unified';
import markdown from 'remark-parse';
import remark2rehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import html from 'remark-html';
import remarkStringify from 'remark-stringify';
import ruby from '../src/index';

jest.setTimeout(500);

interface ParseResult {
  contents: string;
}

async function parse(processor, text: string): Promise<ParseResult> {
  const ret = await processor.process(text);

  return ret;
}

describe('ruby', () => {
  describe('rehype', () => {
    let options = {}
    const processor = unified()
      .use(markdown)
      .use(ruby, options)
      .use(remark2rehype)
      .use(rehypeStringify);

    it('should return <ruby />', async () => {
      const ast = await parse(processor, `[base text](ruby text){ruby}`);

      expect(ast.contents).toBe('<p><ruby>base text<rp>(</rp><rt>ruby text</rt><rp>)</rp></ruby></p>');
    });
  });

  describe('remark', () => {
    let options = {}
    const processor = unified()
      .use(markdown)
      .use(ruby, options)
      .use(html);

    it('should return <ruby />', async () => {
      const ast = await parse(processor, `[base text](ruby text){ruby}`);

      expect(ast.contents.trim()).toBe('<p><ruby>base text<rp>(</rp><rt>ruby text</rt><rp>)</rp></ruby></p>');
    });
  });

  describe('remark-stringify', () => {
    let options = {}
    const processor = unified()
      .use(markdown)
      .use(remarkStringify)
      .use(ruby, options);

    it('should return <ruby />', async () => {
      const ast = await parse(processor, `[base text](ruby text){ruby}`);

      expect(ast.contents.trim()).toBe('[base text](ruby text){ruby}');
    });
  });
});

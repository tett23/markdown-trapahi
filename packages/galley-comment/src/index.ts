// @flow

type Attributes = {
  [string]: string | number | boolean,
};

// const inlineRegExp = /\[(.+?)\]\((.+?)\)\{(.+?)\}/;
// const inlineComment = /#\[(.+?)\]/;

// it provide some comment styles.
// if some option given
// {inlineComment: true, fenceComment: true, blockComment: true, attributeStyle: true}
// it enable comment options.

export default function comment(options: Object) {
  // const Parser = this.Parser.prototype;
  //
  // Parser.inlineTokenizer.comment = inlineTokenizer;
  // inlineTokenizer.locater = locater;
  //
  // return transformer;

  function transformer(tree, file, next) {
    next(null, tree, file);
    return tree;
  }
}

function locator(value, fromIndex) {
  return value.indexOf('[', fromIndex);
}

function inlineTokenizer(eat, value) {
  const match = inlineRegExp.exec(value);
  if (!match) {
    return null;
  }

  const [value1, _, attributes] = split(match[0]);
  if (attributes.comment !== true) {
    return null;
  }

  return eat(match[0])({
    type: 'comment',
    children: [
      {
        type: 'text',
        value: value1,
      },
    ],
  });
}

function split(text: string): [string, string, Attributes] {
  const result = inlineRegExp.exec(text);

  const [_, base, ruby, attributeText] = result;

  return [base, ruby, parseAttribute(attributeText)];
}

function parseAttribute(text: string): Attributes {
  return text
    .split(',')
    .map((item) => {
      let [name, value] = item.trim().split('=');
      if (name === '') {
        value = true;
      }

      return [name, value];
    })
    .reduce((acc, [name, value]) => {
      acc[name] = value;

      return acc;
    }, {});
}

// function blockTokenizer(eat, value) {}

import optionParser from '../src/optionParser';

jest.setTimeout(500);

describe('optionParser', () => {
  it('parse null option', () => {
    expect(optionParser('opt=null').opt).toBe(null);
  });

  it('parse boolean option', () => {
    expect(optionParser('opt').opt).toBe(true);
    expect(optionParser('opt=true').opt).toBe(true);
    expect(optionParser('opt=false').opt).toBe(false);
  });

  it('parse number option', () => {
    expect(optionParser('opt=1').opt).toBe(1);
    expect(optionParser('opt=1.1').opt).toBe(1.1);
  });

  it('parse string option', () => {
    expect(optionParser('opt=foo').opt).toBe('foo');
  });

  it('parse multiple option', () => {
    const options = optionParser('opt1 opt2=true');

    expect(options.opt1).toBe(true);
    expect(options.opt2).toBe(true);
  });
});

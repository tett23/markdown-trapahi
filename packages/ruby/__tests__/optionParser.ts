import optionParser from '../src/optionParser'

jest.setTimeout(500);

describe('optionParser', () => {
  it('parse boolean option', () => {
    const options = optionParser('opt')
    console.log(options)

    expect(options.opt).toBe(true)
  });

  it('parse boolean option', () => {
    const options = optionParser('opt=true')
    console.log(options)

    expect(options.opt).toBe(true)
  });

  it('parse boolean option', () => {
    const options = optionParser('opt=false')
    console.log(options)

    expect(options.opt).toBe(false)
  });

  it('parse boolean option', () => {
    const options = optionParser('opt=1')
    console.log(options)

    expect(options.opt).toBe(1)
  });

  it('parse boolean option', () => {
    const options = optionParser('opt=1.1')
    console.log(options)

    expect(options.opt).toBe(1.1)
  });

  it('parse boolean option', () => {
    const options = optionParser('opt=foo')
    console.log(options)

    expect(options.opt).toBe('foo')
  });
});

type OptionValue = string | number | boolean | null;
interface RubyOptions {
  [key: string]: OptionValue
}


export default function optionParser(optionText: string): RubyOptions {
  return splitValues(optionText).reduce((acc: RubyOptions, [key, value]) => {
    acc[key] = castValue(value);

    return acc;
  }, {});
}

type ExcludesNull = <T>(x: T | null) => x is T;
type OptionPair = [string, string | null];

function splitValues(optionText: string): Array<OptionPair> {
  const ret = optionText.split(' ').map(
    (pair): OptionPair | null => {
      const [key, value] = pair.trim().split('=');
      if (key === '') {
        return null;
      }

      return [key, value];
    },
  );

  return ret.filter((Boolean as any) as ExcludesNull);
}

const numbeRegExp = /^\d+(\.\d+){0,1}$/;

function castValue(value: string | null): OptionValue {
  if (value == null) {
    return true;
  }

  if (value === 'null') {
    return null;
  }
  if (value === 'true') {
    return true;
  }
  if (value === 'false') {
    return false;
  }

  if (numbeRegExp.test(value)) {
    return Number(value);
  }

  return value;
}

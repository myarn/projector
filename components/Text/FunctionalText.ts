import { Text } from '../../mod.ts';

export class FunctionalText extends Text {
  constructor (protected renderFunction: () => string) {
    super();
  }

  addParentLine () {
    return this;
  }

  get renderedText(): string {
    return this.renderFunction();
  }
}

export const toTemplateText = (fragments: TemplateStringsArray, ...values: (Text | unknown)[]): [Text[], () => string] => {
  const arr: (unknown)[] = [];

  for (let i=0; i < values.length; i++) {
    arr.push(fragments[i]);
    arr.push(values[i]);
  }

  arr.push(fragments[values.length]);

  return [
    values.filter<Text>((v): v is Text => v instanceof Text),
    () => arr.join('')
  ];
}

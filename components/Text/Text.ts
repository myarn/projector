import { Line } from '../../mod.ts';

export type TextComponent = string | Text | ((text: Text) => Text) | [Text[], () => string];

export class Text {
  protected parentLines: Line[] = [];

  constructor (
    protected _renderedText: string = ''
  ) {
  }

  addParentLine (line: Line): Text {
    if (!this.parentLines.includes(line)) this.parentLines.push(line);
    return this;
  }

  get renderedText() : string {
    return this._renderedText;
  }

  render () {
    this.parentLines.forEach(line => line.update());
  }

  toString () {
    return this.renderedText;
  }
}

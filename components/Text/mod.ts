import { Line } from '../Line/mod.ts';

export type TextComponent = Text;

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

export class LoadingIndicator extends Text {
  id?: number;
  completeText = '✔';

  #index = 0;
  #isCompleted = false;

  constructor (
    protected indicators: string[] = ['⠙', '⠸', '⠴', '⠦' , '⠇', '⠋'],
    protected updateInterval: number = 200
  ) {
    super();

    this.next();
    this.start();
  }

  set index (value: number) { this.#index = value; this.render() }
  get index (): number { return this.#index; }

  set isCompleted (value: boolean) { this.#isCompleted = value; this.render() }
  get isCompleted (): boolean { return this.#isCompleted; }

  start () {
    this.id = setInterval(() => this.next(), this.updateInterval);
  }

  next () {
     this.index++;
    if(this.index >= this.indicators.length) this.index = 0;
  }

  get renderedText (): string {
    return (this.isCompleted && this.completeText) ? this.completeText : this.indicators[this.index];
  }

  complete () {
    this.isCompleted = true;
    this.stop();
  }

  stop () {
    this.id && clearInterval(this.id);
    this.id = undefined;
  }
}

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

export class ProgressBar extends Text {

  #value: number;
  #max: number;

  constructor (
    value: number,
    max: number,
    protected width: number = 50,
    protected option: {
      filled: string,
      empty: string
    } = {
      filled: '=',
      empty: '-'
    }
  ) {
    super();

    this.#value = value;
    this.#max = max;
  }

  set value (value: number) { this.#value = value;this.render(); }
  get value () { return this.#value }

  set max (value: number) { this.#max = value; this.render();}
  get max () { return this.#max }

  get renderedText(): string {
    const filledCount = Math.min(this.width, Math.round(this.value / this.max * this.width));
    const emptyCount = this.width - filledCount;
    return `${this.option.filled.repeat(filledCount)}${this.option.empty.repeat(emptyCount)}`;
  }
}

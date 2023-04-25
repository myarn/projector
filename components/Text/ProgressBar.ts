import { Text } from '../../mod.ts';

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

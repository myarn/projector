import { Text } from '../../mod.ts';

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
    if (this.index > this.indicators.length) this.index = 0;
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
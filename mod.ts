import { findIndexs } from './utils.ts';
import { cursorDown, cursorHide, cursorRestore, cursorSave, cursorShow, cursorUp, eraseLine } from './deps.ts'
import { Line } from './components/Line/mod.ts';

export class Projector {
  public lines: Line[] = [];

  constructor () {
    this.write(cursorUp() + cursorSave);
  }

  addLine (line: Line | ((line: Line) => void) = new Line(this)): this {
    if (typeof line === 'function') {
      line(new Line(this));
    }

    return this;
  }

  update (index: number) {
    const line = this.lines[index];
    this.write(
      cursorHide +
      cursorRestore + cursorDown(index + 1) + eraseLine +
      line.renderedText +
      this.cursorEnd
    );
  }

  get cursorEnd () {
    return cursorRestore + cursorDown(this.lines.length) + cursorShow;
  }

  updateLine (line: Line) {
    const indexes = findIndexs(this.lines, (l) => l === line);
    for (const index of indexes) this.update(index);
  }

  write (val: string) {
    console.log(val);
  }
}

export * from './components/Line/mod.ts';
export * from './components/Text/mod.ts';

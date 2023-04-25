import { filesize } from '../../../deps.ts';
import { Projector } from '../../mod.ts';
import { FunctionalText, LoadingIndicator, ProgressBar, Text, TextComponent, toTemplateText } from '../Text/mod.ts';

export class Line {
   texts: TextComponent[] = [];
  constructor (
    protected projector: Projector
  ) {
    this.projector.lines.push(this);
  }

  update () {
    this.projector.updateLine(this);
  }

  get renderedText (): string {
    return this.texts.map((text) => text.renderedText).join('');
  }

  addText (text: string | TextComponent): TextComponent {
    if (text instanceof Text) {
      text.addParentLine(this);
      this.texts.push(text);
      this.update();
      return text;
    } else {
      return this.addText(new Text(text));
    }
  }

  addTemplateText ([texts, renderFunction]: [Text[], () => string]) {
    for (const text of texts) {
      text.addParentLine(this);
    }

    this.addText(new FunctionalText(renderFunction));
  }

  addTexts (...texts: (TextComponent | string)[]): TextComponent[] {
    return texts.map(text => this.addText(text));
  }
}

export class DwonloadProgress extends Line {
  progressBar: ProgressBar;
  loadingIngicator: LoadingIndicator;

  constructor (
    projector: Projector,
    protected filename: string,
    protected value: number,
    protected max: number) {
    super(projector);

    this.progressBar = new ProgressBar(value, max, 20);
    this.loadingIngicator = new LoadingIndicator();

    this.addTemplateText(toTemplateText`[${this.progressBar}] ${this.loadingIngicator} ${filename} (${filesize(this.value)}/${filesize(this.max)})`);
  }

  updateSize (size: number) {
    this.progressBar.value = size;
    this.value = size;
  }

  stop () {
    this.loadingIngicator.complete();
  }
}
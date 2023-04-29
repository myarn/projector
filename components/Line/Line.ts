import { FunctionalText, Text, TextComponent , Projector } from '../../mod.ts';

export class Line {
  texts: Text[] = [];
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

  addText (tc: TextComponent): this {
    if (tc instanceof Text) {
      tc.addParentLine(this);
      this.texts.push(tc);
      this.update();
    } else if (typeof tc === 'function') {
      this.addText(tc(new Text()));
    } else if (Array.isArray(tc)) {
      const [texts, renderFunction] = tc
      for (const text of texts) {
        text.addParentLine(this);
      }
  
      this.addText(new FunctionalText(renderFunction));
    } else {
      this.addText(new Text(tc));
    }

    return this;
  }

  addTexts (...texts: TextComponent[]): this {
    texts.map(text => this.addText(text));

    return this;
  }
}
import { FunctionalText, Text, TextComponent , Projector } from '../../mod.ts';

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
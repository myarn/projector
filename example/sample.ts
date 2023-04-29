import { LoadingIndicator, ProgressBar, Projector, toTemplateText } from '../mod.ts';

const loadingIndicator = new LoadingIndicator(undefined, 100);
const progress = new ProgressBar(0, 2, 25);

setInterval(() => {
  const now = Math.sin(performance.now() / 1000) + 1;
  progress.value = now;
}, 100)

new Projector()
  .addLine(line => line.addText('This is sample text'))
  // Progress bar sample
  .addLine(line => line.addText('[').addText(loadingIndicator).addText('] [').addText(progress).addText(']'))
  // More simple
  .addLine(line => line.addText(toTemplateText`[${loadingIndicator}] [${progress}] `));

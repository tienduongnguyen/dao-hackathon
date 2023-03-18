/* eslint-disable @typescript-eslint/no-var-requires */
const ArrowDown = require('./source/arrow-down.svg');
const ArrowUp = require('./source/arrow-up.svg');
const HorizontalDots = require('./source/horizontal-dots.svg');
const Loupe = require('./source/loupe.svg');
const Plush = require('./source/plus.svg');

export const SvgComponent = {
  loupe: Loupe,
  plus: Plush,
  arrowUp: ArrowDown,
  arrowDown: ArrowUp,
  horizontalDots: HorizontalDots,
};
export type SvgIconTypes = keyof typeof SvgComponent;

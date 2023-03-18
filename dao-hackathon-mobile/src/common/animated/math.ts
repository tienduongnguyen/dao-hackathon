export const sharedBin = (value: boolean): 0 | 1 => {
  'worklet';
  return value ? 1 : 0;
};
export const sharedClamp = (
  value: number,
  lowerValue: number,
  upperValue: number,
) => {
  'worklet';
  return Math.min(Math.max(lowerValue, value), upperValue);
};

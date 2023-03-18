import { Colors } from '@src/themes';

export interface InfoPopupProps {
  text: string;
  backgroundColor: keyof Colors;
  animatedInDuration?: number;
  animatedOutDuration?: number;
  onBackdropPress?: () => void;
  popupShownDuration?: number;
}

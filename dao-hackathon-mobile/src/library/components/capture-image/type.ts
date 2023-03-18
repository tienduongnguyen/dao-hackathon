export interface CaptureImageProps {
  onClose?: () => void;
  onNext?: (uriImages: Array<string>) => void;
  waitToNext?: boolean;
  type?: TypePresetNames;
}

export type TypePresetNames = '1-sided' | '2-sided';

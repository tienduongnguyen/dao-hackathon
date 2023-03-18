export interface SelectActionScanProps {
  showPermission?: () => void;
  optionsCapture: Array<OptionData>;
  optionsGallery: Array<OptionData>;
  isGrantPhotoPermission: boolean;
}
export interface OptionData {
  text: string;
  itemCallback: () => void;
}

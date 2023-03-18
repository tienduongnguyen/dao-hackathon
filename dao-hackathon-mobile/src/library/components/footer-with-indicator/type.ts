export interface FooterWithIndicatorProps {
  current: number;
  total?: number;
  onPress?: () => void;
  btnLabel?: string;
  isValid?: boolean;
  twoButton?: boolean;
  secondBtnLabel?: string;
  onPressSecondButton?: () => void;
}

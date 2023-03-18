import React from 'react';
export interface BottomSheetProps {
  isVisible: boolean;
  title: string;
  onClose: () => void;
  description: React.ReactNode;
  disabled?: boolean;
  onPressCancel: () => void;
  onPressSubmit?: () => void;
  buttonCancelText: string;
  buttonSubmitText: string;
  animatedInDuration?: number;
  animatedOutDuration?: number;
  onBackdropPress?: () => void;
  showOnUnAuthen?: boolean;
}

export interface ModalInputProps {
  onClose: () => void;
  disabled: boolean;
  onPressSubmit: () => void;
  title: string;
  password: string;
  isError: boolean;
  onChangeText: (text: string) => void;
  isAuth: boolean;
  address: string;
  privateKey: string;
}

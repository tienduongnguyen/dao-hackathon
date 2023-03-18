import { StackScreenProps } from '@react-navigation/stack';
import {
  AUTHORIZE_STACK,
  AuthorizeParamsList,
} from '@src/navigation/screen-types';

export interface RenameHeaderProps {
  header: string;
}

export interface ImageTwoSideProps {
  source: string;
  side: string;
}

export interface FormRenameType {
  card_name: string;
  description: string;
}

export interface FormRenameProps {
  onSubmit: (data: FormRenameType) => void;
  fee: number;
  isVisible: boolean;
  onCloseModal: () => void;
  onMintNFT: () => void;
  // onConfirm: () => void;
}

export interface NFTCardTwoSideProps {
  img: string[];
  card_name: string;
  description: string;
}

export type RenameCardTwoSideNavigationProps = StackScreenProps<
  AuthorizeParamsList,
  AUTHORIZE_STACK.RENAME_TWO_SIDE
>;

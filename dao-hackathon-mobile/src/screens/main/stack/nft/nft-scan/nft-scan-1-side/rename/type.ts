import { StackScreenProps } from '@react-navigation/stack';
import {
  AUTHORIZE_STACK,
  AuthorizeParamsList,
} from '@src/navigation/screen-types';
export interface FormRenameType {
  card_name: string;
  description: string;
}

export type RenameCardOneSideNavigationProps = StackScreenProps<
  AuthorizeParamsList,
  AUTHORIZE_STACK.RENAME_CARD_ONE_SIDE
>;

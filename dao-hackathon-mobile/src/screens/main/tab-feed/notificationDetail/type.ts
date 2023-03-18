import { StackScreenProps } from '@react-navigation/stack';
import {
  AUTHORIZE_STACK,
  RootStackParamList,
} from '@src/navigation/screen-types';

export type NotificationDetailProps = StackScreenProps<
  RootStackParamList,
  AUTHORIZE_STACK.NOTIFICATION_DETAIL
>;

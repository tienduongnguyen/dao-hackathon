export interface CheckboxProps {
  type?: 'circle' | 'square';

  /**
   * Disable checkbox
   * @default undefined
   */
  disable?: boolean;

  /**
   * Default value of checkbox
   * @default undefined
   */
  initialValue?: boolean;

  /**
   * Overwrite value of check box
   * @default undefined
   */
  value?: boolean;

  /**
   * Text to display
   * @default undefined
   */
  text?: string;

  /**
   * Key to using i18n
   * @default undefined
   */
  tx?: string;

  /**
   * On change function
   * @default undefined
   */
  onToggle?: (newValue: boolean) => void;

  size?: number;
}

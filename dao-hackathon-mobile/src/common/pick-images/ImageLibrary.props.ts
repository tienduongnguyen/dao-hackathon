export interface ImageLibraryProps {
  onChange?: (photos: Array<Photo>) => void;
  maxSelect?: number;
  onHeaderRight?: (images: Array<string>) => void | undefined;
  onHeaderLeft?: () => void;
  isShowHeader?: boolean;
  images?: Array<Photo>;
  albumImages?: Array<Photo>;
  onEndReached?: () => void;
}
export type Photo = {
  isRenderCamera?: boolean;
  type?: string;
  groupName?: string;
  uri: string;
  fileName?: string | null;
  width?: number | null;
  height?: number | null;
  fileSize?: number | null;
  timeStamp?: number;
  latitude?: number;
  longitude?: number;
  altitude?: number;
  heading?: number;
  speed?: number;
};

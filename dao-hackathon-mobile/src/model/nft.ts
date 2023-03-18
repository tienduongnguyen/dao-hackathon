export interface NFT {
  data: NftType[];
  error?: boolean;
  isLoading?: boolean;
  isLoadMore: boolean;
  isLoadMoreDone: boolean;
  pageNum: number;
}

export interface NftType {
  key: number;
  updateAuthority: string;
  mint: string;
  data: Data;
  primarySaleHappened: number;
  isMutable: number;
  editionNonce: null;
  metadata: Metadata;
  create_date: number;
  type: string;
  height: number;
}

export interface Data {
  name: string;
  symbol: string;
  uri: string;
  sellerFeeBasisPoints: number;
  creators: DataCreator[];
}

export interface DataCreator {
  address: string;
  verified: number;
  share: number;
}

export interface Metadata {
  name: string;
  symbol: string;
  description: string;
  edition: string;
  external_url: string;
  create_date: number;
  attributes: any[];
  properties: Properties;
  image: string;
}

export interface Properties {
  files: File[];
  category: string;
  creators: PropertiesCreator[];
}

export interface PropertiesCreator {
  address: string;
  share: number;
}

export interface File {
  uri: string;
  type: string;
}

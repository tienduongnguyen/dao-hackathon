import { Option } from '@src/library/components/selection-bottom-sheet/type';

export const REQUIRED_DOT = '(*)';
export const ACTION_LOGIN_TOGGLE_EMAIL = 'ACTION_LOGIN_TOGGLE_EMAIL';

export const FORMAT_DATE = 'DD/MM/YYYY';
export const FORMAT_TIME = 'HH:mm';
export const FORMAT_DATE_ENGLISH = 'DD/MM/YYYY';
export const MASK_FORMAT_DATE_ENGLISH = [
  /\d/,
  /\d/,
  '/',
  /\d/,
  /\d/,
  '/',
  /\d/,
  /\d/,
  /\d/,
  /\d/,
];
export const FORMAT_DATE_JAPAN = 'YYYY/MM/DD';
export const MASK_FORMAT_DATE_JAPAN = [
  /\d/,
  /\d/,

  /\d/,
  /\d/,
  '/',
  /\d/,
  /\d/,
  '/',
  /\d/,
  /\d/,
];

export const DEFAULT_SERVICE_TYPE_ID = 'a3ab5396-719d-43b2-ab5a-4e48060e2d87';
export const DEFAULT_SUPPLIER_SLUG = 'tomoko-kishaba';
export const DEFAULT_TRAVEL_RESOURCE_SLUG = 'lorem-ipsum-3';
export const DEFAULT_TRAVEL_RESOURCE_SLUG_REVIEW = 'lorem-ipsum-8';
export const DEFAULT_CATEGORY_SLUG = 'textiles';
export const MINIMUM_SHOW_ITEM_HOME = 16;
export const MINIMUM_SHOW_ITEM_DESTINATION = 16;
export const DEFAULT_INITIAL_REGION = {
  lat: 21.037021,
  lng: 105.834839,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export const PASSWORD_TYPE_VALIDATE = {
  DEFAULT: 0,
  ERROR: 1,
  SUCCEEDED: 2,
} as const;
export type PasswordTypeValidate =
  typeof PASSWORD_TYPE_VALIDATE[keyof typeof PASSWORD_TYPE_VALIDATE];
export const KANA_FULL_HALF_MAP = {
  ガ: 'ｶﾞ',
  ギ: 'ｷﾞ',
  グ: 'ｸﾞ',
  ゲ: 'ｹﾞ',
  ゴ: 'ｺﾞ',
  ザ: 'ｻﾞ',
  ジ: 'ｼﾞ',
  ズ: 'ｽﾞ',
  ゼ: 'ｾﾞ',
  ゾ: 'ｿﾞ',
  ダ: 'ﾀﾞ',
  ヂ: 'ﾁﾞ',
  ヅ: 'ﾂﾞ',
  デ: 'ﾃﾞ',
  ド: 'ﾄﾞ',
  バ: 'ﾊﾞ',
  ビ: 'ﾋﾞ',
  ブ: 'ﾌﾞ',
  ベ: 'ﾍﾞ',
  ボ: 'ﾎﾞ',
  パ: 'ﾊﾟ',
  ピ: 'ﾋﾟ',
  プ: 'ﾌﾟ',
  ペ: 'ﾍﾟ',
  ポ: 'ﾎﾟ',
  ヴ: 'ｳﾞ',
  ヷ: 'ﾜﾞ',
  ヺ: 'ｦﾞ',
  ア: 'ｱ',
  イ: 'ｲ',
  ウ: 'ｳ',
  エ: 'ｴ',
  オ: 'ｵ',
  カ: 'ｶ',
  キ: 'ｷ',
  ク: 'ｸ',
  ケ: 'ｹ',
  コ: 'ｺ',
  サ: 'ｻ',
  シ: 'ｼ',
  ス: 'ｽ',
  セ: 'ｾ',
  ソ: 'ｿ',
  タ: 'ﾀ',
  チ: 'ﾁ',
  ツ: 'ﾂ',
  テ: 'ﾃ',
  ト: 'ﾄ',
  ナ: 'ﾅ',
  ニ: 'ﾆ',
  ヌ: 'ﾇ',
  ネ: 'ﾈ',
  ノ: 'ﾉ',
  ハ: 'ﾊ',
  ヒ: 'ﾋ',
  フ: 'ﾌ',
  ヘ: 'ﾍ',
  ホ: 'ﾎ',
  マ: 'ﾏ',
  ミ: 'ﾐ',
  ム: 'ﾑ',
  メ: 'ﾒ',
  モ: 'ﾓ',
  ヤ: 'ﾔ',
  ユ: 'ﾕ',
  ヨ: 'ﾖ',
  ラ: 'ﾗ',
  リ: 'ﾘ',
  ル: 'ﾙ',
  レ: 'ﾚ',
  ロ: 'ﾛ',
  ワ: 'ﾜ',
  ヲ: 'ｦ',
  ン: 'ﾝ',
  ァ: 'ｧ',
  ィ: 'ｨ',
  ゥ: 'ｩ',
  ェ: 'ｪ',
  ォ: 'ｫ',
  ッ: 'ｯ',
  ャ: 'ｬ',
  ュ: 'ｭ',
  ョ: 'ｮ',
  '。': '｡',
  '、': '､',
  ー: 'ｰ',
  '「': '｢',
  '」': '｣',
  '・': '･',
  '１': '1',
  '２': '2',
  '３': '3',
  '４': '4',
  '５': '5',
  '６': '6',
  '７': '7',
  '８': '8',
  '９': '9',
  '０': '0',
} as Record<string, string>;

export const USER_STATUS = {
  NEW: 'new',
  NOT_VERIFY: 'not_verify',
  ACTIVE: 'active',
} as const;

export type UserStatusType = typeof USER_STATUS[keyof typeof USER_STATUS];

export const MSG_NOT_VERIFY = ['MSG_045', 'MSG_049'];

export const MAX_NFT_MINT = 5;
export const DEFAULT_SHOW_ITEM_FILTER_LISTING = 5;
export const DEFAULT_SHOW_ITEM_REVIEWS = 4;
export const DESCRIPTION_LENGTH = 4000;
export const CARDNAME_LENGTH = 32;
export const BOTTOM_SHEET_HEIGHT = 338;
export const USER_NAME_LENGTH = 30;

export const MONTH_I18N_KEY = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
] as const;

export const NETWORK = {
  sol: 'sol',
  bsc: 'bsc',
  polygon: 'polygon',
} as const;

export type NetworkType = keyof typeof NETWORK;

export const NETWORK_SELECTION: Array<Option> = [
  {
    id: '1',
    label: 'Solana*',
    img: 'sol',
    network: 'sol',
  },
  {
    id: '2',
    label: 'Binance',
    img: 'bsc',
    network: 'bsc',
  },
  {
    id: '3',
    label: 'Polygon',
    img: 'polygon',
    network: 'polygon',
  },
];

export const DEFAULT_PER_PAGE = 20;

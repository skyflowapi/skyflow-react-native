/*
 Copyright (c) 2022 Skyflow, Inc.
*/
import { ElementType } from '../../utils/constants';
import defaultCardIcon from '../../../assets/default.png';
import amexIcon from '../../../assets/amex.png';
import dinnersClubIcon from '../../../assets/diners-club.png';
import discoverIcon from '../../../assets/discover.png';
import hipperCardIcon from '../../../assets/hipercard.png';
import jcbIcon from '../../../assets/jcb.png';
import maestroIcon from '../../../assets/maestro.png';
import maseterCardIcon from '../../../assets/mastercard.png';
import unionPayIcon from '../../../assets/unionpay.png';
import visaCardIcon from '../../../assets/visa.png';
import cartesBancairesIcon from '../../../assets/carter-banceris.png'
import sdkDetails from '../../../package.json';

export const SDK_DETAILS = {
  sdkName: 'React Native',
  sdkVersion: sdkDetails.version,
};

export const SDK_NAME_VERSION = `${SDK_DETAILS.sdkName} SDK v${SDK_DETAILS.sdkVersion}`


export const ELEMENTS_CONSTANTS_LIST = {
  [ElementType.CARDHOLDER_NAME]: {
    regex: /^$|^([a-zA-Z\\ \\,\\.\\-\\']{2,})$/,
  },
  [ElementType.CVV]: {
    regex: /^$|^[0-9]{3,4}$/,
  },
  [ElementType.PIN]: {
    regex: /^$|^[0-9]{4,12}$/,
  },
};

export const DEFAULT_EXPIRATION_YEAR_FORMAT = 'YY';

export const FOUR_DIGIT_YEAR_FORMAT = 'YYYY';

export const DEFAULT_EXPIRATION_DATE_FORMAT = 'MM/YY';

export const MONTH_FORMAT = 'MM';

export const EXPIRATION_DATE_MASK_MAP = {
  [DEFAULT_EXPIRATION_DATE_FORMAT]: '99/99',
  'MM/YYYY': '99/9999',
  'YYYY/MM': '9999/99',
  'YY/MM': '99/99',
};

export enum CardType {
  VISA = 'VISA',
  MASTERCARD = 'MASTERCARD',
  AMEX = 'AMEX',
  DINERS_CLUB = 'DINERS_CLUB',
  DISCOVER = 'DISCOVER',
  JCB = 'JCB',
  MAESTRO = 'MAESTRO',
  UNIONPAY = 'UNIONPAY',
  HIPERCARD = 'HIPERCARD',
  DEFAULT = 'DEFAULT',
  UNKNOWN = 'UNKNOWN',
  CARTES_BANCAIRES = 'CARTES BANCAIRES',
}


export const CARD_ENCODED_ICONS = {
  [CardType.DEFAULT]: defaultCardIcon,
  [CardType.AMEX]: amexIcon,
  [CardType.CARTES_BANCAIRES]: cartesBancairesIcon,
  [CardType.DINERS_CLUB]: dinnersClubIcon,
  [CardType.DISCOVER]: discoverIcon,
  [CardType.HIPERCARD]: hipperCardIcon,
  [CardType.JCB]: jcbIcon,
  [CardType.MAESTRO]: maestroIcon,
  [CardType.MASTERCARD]: maseterCardIcon,
  [CardType.UNIONPAY]: unionPayIcon,
  [CardType.VISA]: visaCardIcon,
}

export const CardTypeValues = {
  [CardType.VISA]: 'Visa',
  [CardType.MASTERCARD]: 'Mastercard',
  [CardType.AMEX]: 'Amex',
  [CardType.DINERS_CLUB]: 'DinersClub',
  [CardType.DISCOVER]: 'Discover',
  [CardType.JCB]: 'Jcb',
  [CardType.MAESTRO]: 'Maestro',
  [CardType.UNIONPAY]: 'Unionpay',
  [CardType.HIPERCARD]: 'Hipercard',
  [CardType.DEFAULT]: 'Default',
  [CardType.UNKNOWN]: 'Unknown',
  [CardType.CARTES_BANCAIRES]: 'Cartes Bancaires'
};

export const CARD_NUMBER_MASK = {
  [CardType.AMEX]: '9999 999999 99999',
  [CardType.VISA]: '9999 9999 9999 9999',
  [CardType.MASTERCARD]: '9999 9999 9999 9999',
  [CardType.DISCOVER]: '9999 9999 9999 9999 999',
  [CardType.DINERS_CLUB]: '9999 999999 999999',
  [CardType.JCB]: '9999 9999 9999 9999 999',
  [CardType.MAESTRO]: '9999 9999 9999 9999 999',
  [CardType.UNIONPAY]: '9999 9999 9999 9999 999',
  [CardType.HIPERCARD]: '9999 9999 9999 9999 999',
  [CardType.DEFAULT]: '9999 9999 9999 9999 999',
  [CardType.UNKNOWN]: '9999 9999 9999 9999 999',
};

export const CARD_TYPE_REGEX = {
  [CardType.VISA]: {
    regex: /^4\d*/,
    maxCardLength: 19,
    cardLengthRange: [13, 16],
  },
  [CardType.MASTERCARD]: {
    regex: /^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[0-1]|2720)\d*/,
    maxCardLength: 16,
    cardLengthRange: [16],
  },
  [CardType.AMEX]: {
    regex: /^3[47]\d*/,
    maxCardLength: 15,
    cardLengthRange: [15],
  },
  [CardType.DINERS_CLUB]: {
    regex: /^(36|38|30[0-5])\d*/,
    maxCardLength: 16,
    cardLengthRange: [14, 15, 16, 17, 18, 19],
  },
  [CardType.DISCOVER]: {
    regex: /^(6011|65|64[4-9]|622)\d*/,
    maxCardLength: 16,
    cardLengthRange: [16, 17, 18, 19],
  },
  [CardType.JCB]: {
    regex: /^35\d*/,
    maxCardLength: 19,
    cardLengthRange: [16, 17, 18, 19],
  },
  [CardType.HIPERCARD]: {
    regex: /^606282\d*/,
    maxCardLength: 19,
    cardLengthRange: [14, 15, 16, 17, 18, 19],
  },
  [CardType.UNIONPAY]: {
    regex: /^62\d*/,
    maxCardLength: 19,
    cardLengthRange: [16, 17, 18, 19],
  },
  [CardType.MAESTRO]: {
    regex: /^(5018|5020|5038|5043|5[6-9]|6020|6304|6703|6759|676[1-3])\d*/,
    maxCardLength: 19,
    cardLengthRange: [12, 13, 14, 15, 16, 17, 18, 19],
  },
};

export const DEFAULT_CARD_LENGTH_RANGE = [0, 12, 13, 14, 15, 16, 17, 18, 19];

export const DEFAULT_CARD_INPUT_MAX_LENGTH = 23;

export const REVEAL_ELEMENT_ERROR_TEXT = 'Invalid Token';

export const DEFAULT_COLLECT_ELEMENT_ERROR_TEXT = 'Invalid Value';

export const DEFAULT_VALIDATION_ERROR_TEXT = 'Validation Failed';

export const ALLOWED_EXPIRY_YEAR_FORMATS = [
  DEFAULT_EXPIRATION_YEAR_FORMAT,
  FOUR_DIGIT_YEAR_FORMAT,
];

export const ALLOWED_EXPIRY_DATE_FORMATS = [
  DEFAULT_EXPIRATION_DATE_FORMAT,
  'YYYY/MM',
  'YY/MM',
  'MM/YYYY',
];

export const DEFAULT_COLLECT_ELEMENT_REQUIRED_TEXT = 'Field is required';

export const DEFAULT_ERROR_TEXT_ELEMENT_TYPES = {
  [ElementType.CVV]: 'Invalid cvv',
  [ElementType.EXPIRATION_DATE]: 'Invalid expiration date',
  [ElementType.CARD_NUMBER]: 'Invalid card number',
  [ElementType.CARDHOLDER_NAME]: 'Invalid cardholder name',
  [ElementType.INPUT_FIELD]: DEFAULT_COLLECT_ELEMENT_ERROR_TEXT,
  [ElementType.PIN]: 'Invalid pin',
  [ElementType.EXPIRATION_MONTH]: 'Invalid expiration month',
  [ElementType.EXPIRATION_YEAR]: 'Invalid expiration year',
};

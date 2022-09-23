import { ElementType } from '../../utils/constants';

export const ELEMENTS_CONSTANTS_LIST = {
  [ElementType.CARDHOLDER_NAME]: {
    regex: /^([a-zA-Z\\ \\,\\.\\-\\']{2,})$/,
  },
};

export const TWO_DIGIT_YEAR_FORMAT = 'YY';
export const FOUR_DIGIT_YEAR_FORMAT = 'YYYY';

export const DEFAULT_EXPIRATION_DATE_FORMAT = 'MM/YY';

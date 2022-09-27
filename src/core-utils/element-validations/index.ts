/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  CardType,
  CARD_TYPE_REGEX,
  DEFAULT_CARD_LENGTH_RANGE,
  ELEMENTS_CONSTANTS_LIST,
  TWO_DIGIT_YEAR_FORMAT,
} from '../../core/constants';
import { getYearAndMonthBasedOnFormat } from '../../utils/helpers';

export const validatePin = (pinValue: string) => {
  return pinValue.length >= 4 && pinValue.length <= 12;
};

export const validateCvv = (cvvValue: string) => {
  return cvvValue.length >= 4 && cvvValue.length <= 12;
};

export const validateCardHolderName = (name: string) => {
  return (
    name.length >= 2 &&
    new RegExp(ELEMENTS_CONSTANTS_LIST.CARDHOLDER_NAME.regex).test(name)
  );
};

export const validateExpiryMonth = (month: string) => {
  if (month.trim().length === 0) return true;
  const tempMonth = Number(month);
  if (tempMonth > 0 && tempMonth <= 12) {
    return true;
  }
  return false;
};

export const validateExpiryYear = (year: string, format: string) => {
  if (year.trim().length === 0) return true;
  let expiryYear = Number(year);
  if (format === TWO_DIGIT_YEAR_FORMAT) {
    expiryYear = 2000 + Number(year);
  }
  const currentYear = new Date().getFullYear();
  const maxYear = currentYear + 50;

  return expiryYear >= currentYear && expiryYear <= maxYear;
};

export const validateExpiryDate = (date: string, format: string) => {
  if (date.trim().length === 0) return true;
  if (!date.includes('/')) return false;
  const { month, year } = getYearAndMonthBasedOnFormat(date, format);
  const expiryDate = new Date(`${year}-${month}-01`);
  const today = new Date();

  const maxDate = new Date();
  maxDate.setFullYear(today.getFullYear() + 50);

  return expiryDate > today && expiryDate <= maxDate;
};

export const validateCreditCardNumber = (cardNumber: string) => {
  const value = cardNumber.replace(/[\s-]/g, '');
  let sum = 0;
  let shouldDouble = false;

  for (let i = value.length - 1; i >= 0; i -= 1) {
    let digit = parseInt(value.charAt(i), 10);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
};

export const validateCardNumberLengthCheck = (
  cardNumber: string = '',
  cardType: CardType
): boolean => {
  const cardLength = cardNumber.replace(/[\s-]/g, '').length;
  const validLengths: number[] =
    CARD_TYPE_REGEX[cardType]?.cardLengthRange || DEFAULT_CARD_LENGTH_RANGE;
  return validLengths.includes(cardLength);
};

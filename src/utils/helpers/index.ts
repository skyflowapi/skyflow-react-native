import {
  MONTH_FORMAT,
  FOUR_DIGIT_YEAR_FORMAT,
  TWO_DIGIT_YEAR_FORMAT,
  EXPIRATION_DATE_MASK_MAP,
  CardType,
  CARD_TYPE_REGEX,
  CARD_NUMBER_MASK,
} from '../../core/constants';

export const appendZeroToOne = (value) => {
  if (value.length === 1 && Number(value) === 1) {
    return `0${value}`;
  }
  return value;
};

export const formatExpirationMonthValue = (value: string) => {
  if (value.length === 1 && Number(value) >= 2) {
    return `0${value}`;
  }
  return value;
};

export const getYearAndMonthBasedOnFormat = (cardDate, format: string) => {
  const [part1, part2] = cardDate.split('/');
  switch (format) {
    case 'MM/YY':
      return { month: part1, year: 2000 + Number(part2) };
    case 'YY/MM':
      return { month: part2, year: 2000 + Number(part1) };
    case 'YYYY/MM':
      return { month: part2, year: part1 };
    // MM/YYYY
    default:
      return { month: part1, year: part2 };
  }
};

export const applyMask = (value: string, matchPattern: string): string => {
  const DIGIT = '9';
  const pattern = matchPattern;
  const patternChars = pattern.replace(/\W/g, '');
  const output = pattern.split('');
  const values = value.toString().replace(/\W/g, '');
  const charsValues = values.replace(/\W/g, '');
  let charCounter = 0;
  let index;

  const outputLength = output.length;
  for (index = 0; index < outputLength; index++) {
    if (charCounter >= values.length) {
      if (patternChars.length === charsValues.length) {
        return output.join('');
      }
      break;
    } else if (output[index] === DIGIT && values[charCounter].match(/[0-9]/)) {
      output[index] = values[charCounter++];
    } else if (output[index] === DIGIT) {
      return output.slice(0, index).join('');
    } else if (output[index] === values[charCounter]) {
      charCounter++;
    }
  }
  return output.join('').substring(0, index);
};

export const formatExpirationDate = (value: string, format: string) => {
  let formattedValue = value;
  if (format.startsWith(MONTH_FORMAT)) {
    if (value.length === 1 && Number(value) >= 2) {
      formattedValue = `0${value}`;
    } else {
      formattedValue = value;
    }
  } else if (format.startsWith(FOUR_DIGIT_YEAR_FORMAT)) {
    const lastChar = (value.length > 0 && value.charAt(value.length - 1)) || '';
    if (value.length === 6 && Number(lastChar) >= 2) {
      formattedValue = `${value.substring(0, 5)}0${lastChar}`;
    } else {
      formattedValue = value;
    }
  } else if (format.startsWith(TWO_DIGIT_YEAR_FORMAT)) {
    const lastChar = (value.length > 0 && value.charAt(value.length - 1)) || '';
    if (value.length === 4 && Number(lastChar) >= 2) {
      formattedValue = `${value.substring(0, 3)}0${lastChar}`;
    } else {
      formattedValue = value;
    }
  }
  return applyMask(formattedValue, EXPIRATION_DATE_MASK_MAP[format]);
};

export const detectCardType = (cardNumber: string) => {
  const value = cardNumber.replace(/[\s-]/g, '');

  let detectedType = CardType.DEFAULT;
  Object.entries(CARD_TYPE_REGEX).forEach(([key, type]) => {
    if (type.regex.test(value)) {
      detectedType = key as CardType;
    }
  });
  return detectedType;
};

export const formatCardNumber = (cardNumber, type) => {
  return applyMask(cardNumber, CARD_NUMBER_MASK[type]);
};

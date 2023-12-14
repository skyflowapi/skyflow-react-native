/*
 Copyright (c) 2022 Skyflow, Inc.
*/
import {
  MONTH_FORMAT,
  FOUR_DIGIT_YEAR_FORMAT,
  DEFAULT_EXPIRATION_YEAR_FORMAT,
  EXPIRATION_DATE_MASK_MAP,
  CardType,
  CARD_TYPE_REGEX,
  CARD_NUMBER_MASK,
  DEFAULT_EXPIRATION_DATE_FORMAT,
  ALLOWED_EXPIRY_DATE_FORMATS,
  ALLOWED_EXPIRY_YEAR_FORMATS,
} from '../../core/constants';
import { ElementType, MessageType } from '../constants';
import logs from '../logs';
import { printLog, parameterizedString } from '../logs-helper';

export const getDeviceModel = (platform: any): string => {
  if (platform.OS === 'ios') {
    return platform.constants.systemName === 'iPadOS' ? 'iPad' : 'Iphone';
  } else if (platform.OS === 'android') {
    return platform.constants.Model;
  }
  return platform.OS;
};

export const getMetaObject = (platform: any, sdkDetails: any) => {
  let metaObject = {};
  try {
    const deviceModel = getDeviceModel(platform);
    const osVersion = platform.Version ?? '';
    const osName = platform.OS;
    metaObject = {
      sdk_name_version: `${sdkDetails.name}@${sdkDetails.version}`,
      sdk_client_device_model: deviceModel,
      sdk_os_version: `${osName}@${osVersion}`,
      sdk_runtime_details: `react-native@${sdkDetails.devDependencies['react-native']}`,
    };
  } catch (err) {
    // ignore error
    metaObject = {};
  }

  return metaObject;
};

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
  } else if (format.startsWith(DEFAULT_EXPIRATION_YEAR_FORMAT)) {
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

export const getReturnValue = (
  value: string,
  doesReturnValue: boolean,
  elementType: ElementType,
  cardType?: CardType
) => {
  if (typeof value === 'string') {
    if (elementType === ElementType.CARD_NUMBER) {
      value = value && value.replace(/\s/g, '');
      if (!doesReturnValue) {
        const threshold =
          cardType !== CardType.DEFAULT && cardType === CardType.AMEX ? 6 : 8;
        if (value.length > threshold) {
          return value.replace(
            new RegExp(`.(?=.{0,${value?.length - threshold - 1}}$)`, 'g'),
            'X'
          );
        }
        return value;
      }
      return value;
    }
    if (doesReturnValue) {
      return value;
    }
  } else {
    return value;
  }
  return '';
};

export const isValidURL = (url: string) => {
  if (!url || url.substring(0, 5).toLowerCase() !== 'https') {
    return false;
  }
  try {
    const tempUrl = new URL(url);
    if (tempUrl) return true;
  } catch (err) {
    return false;
  }

  return true;
};

export const isValidExpiryDateFormat = (format: string): boolean => {
  if (format) {
    return ALLOWED_EXPIRY_DATE_FORMATS.includes(format);
  }
  return false;
};

export const isValidExpiryYearFormat = (format: string): boolean => {
  if (format) {
    return ALLOWED_EXPIRY_YEAR_FORMATS.includes(format);
  }
  return false;
};

export const formatCollectElementOptions = (
  elementType: ElementType,
  options,
  logLevel
) => {
  let formattedOptions = {
    required: false,
    ...options,
  };
  if (elementType === ElementType.EXPIRATION_DATE) {
    let isvalidFormat = false;
    if (formattedOptions.format) {
      isvalidFormat = isValidExpiryDateFormat(
        formattedOptions.format.toUpperCase()
      );
      if (!isvalidFormat) {
        printLog(
          parameterizedString(
            logs.warnLogs.INVALID_EXPIRATION_DATE_FORMAT,
            ALLOWED_EXPIRY_DATE_FORMATS.toString()
          ),
          MessageType.WARN,
          logLevel
        );
      }
    }
    formattedOptions = {
      ...formattedOptions,
      format: isvalidFormat
        ? formattedOptions.format.toUpperCase()
        : DEFAULT_EXPIRATION_DATE_FORMAT,
    };
  } else if (elementType === ElementType.EXPIRATION_YEAR) {
    let isvalidFormat = false;
    if (formattedOptions.format) {
      isvalidFormat = isValidExpiryYearFormat(
        formattedOptions.format.toUpperCase()
      );
      if (!isvalidFormat) {
        printLog(
          parameterizedString(
            logs.warnLogs.INVALID_EXPIRATION_YEAR_FORMAT,
            ALLOWED_EXPIRY_YEAR_FORMATS.toString()
          ),
          MessageType.WARN,
          logLevel
        );
      }
    }
    formattedOptions = {
      ...formattedOptions,
      format: isvalidFormat
        ? formattedOptions.format.toUpperCase()
        : DEFAULT_EXPIRATION_YEAR_FORMAT,
    };
  }
  return formattedOptions;
};

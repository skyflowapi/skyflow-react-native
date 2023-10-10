/*
 Copyright (c) 2022 Skyflow, Inc.
*/
import {
  appendZeroToOne,
  applyMask,
  formatExpirationMonthValue,
  formatExpirationDate,
  detectCardType,
  getReturnValue,
  formatCollectElementOptions,
  isValidExpiryYearFormat,
  isValidExpiryDateFormat,
  isValidURL,
  formatCardNumber,
  getYearAndMonthBasedOnFormat,
} from '../../src/utils/helpers';
import {
  CardType,
  DEFAULT_EXPIRATION_DATE_FORMAT,
  DEFAULT_EXPIRATION_YEAR_FORMAT,
} from '../../src/core/constants';
import { ElementType, LogLevel } from '../../src/utils/constants';
import { printLog, parameterizedString } from '../../src/utils/logs-helper';

jest.mock('../../src/utils/logs-helper', () => ({
  printLog: jest.fn(),
  parameterizedString: jest.fn(),
}));
describe('test appendZero function', () => {
  it('should append 0 if we pass 1', () => {
    expect(appendZeroToOne('1')).toEqual('01');
  });

  it('should not apppend 0 if we pass other than 1', () => {
    expect(appendZeroToOne('5')).toEqual('5');
  });
});

describe('test formatExpirationMonthValue function', () => {
  it('should return two digit month for value greater than 1', () => {
    expect(formatExpirationMonthValue('4')).toEqual('04');
  });
  it('should return single digit for value equal to 1', () => {
    expect(formatExpirationMonthValue('1')).toEqual('1');
  });
});

describe('test applyMask function', () => {
  it('should return masked value', () => {
    expect(applyMask('0111', '99/99/9')).toBe('01/11');
    expect(applyMask('0111 1', '99/99')).toBe('01/11');
    expect(applyMask('123A', '99/99')).toBe('12/3');
    expect(applyMask('99/99/99', '99/99/99')).toBe('99/99/99');
  });
});

describe('test formatExpirationDate function', () => {
  it('should return formatted values for MM/YY', () => {
    expect(formatExpirationDate('5', 'MM/YY')).toBe('05');
    expect(formatExpirationDate('11', 'MM/YY')).toBe('11');
    expect(formatExpirationDate('051', 'MM/YY')).toBe('05/1');
    expect(formatExpirationDate('05/11', 'MM/YY')).toBe('05/11');
  });
  it('should return formatted values for YYYY/MM', () => {
    expect(formatExpirationDate('2032/5', 'YYYY/MM')).toBe('2032/05');
    expect(formatExpirationDate('203211', 'YYYY/MM')).toBe('2032/11');
  });
  it('should return formatted values for YY/MM', () => {
    expect(formatExpirationDate('32/5', 'YY/MM')).toBe('32/05');
    expect(formatExpirationDate('3211', 'YY/MM')).toBe('32/11');
  });
});

describe('test detectCardType function', () => {
  it('should return Default type for Empty String', () => {
    expect(detectCardType('')).toEqual(CardType.DEFAULT);
  });
  it('should return Default type for invalid String', () => {
    expect(detectCardType('not_a_card_number')).toBe(CardType.DEFAULT);
  });
  it('should return  Visa Card Type', () => {
    expect(detectCardType('4111')).toBe(CardType.VISA);
  });
  it('should return  Master Card Type', () => {
    expect(detectCardType('5105105105105100')).toBe(CardType.MASTERCARD);
  });
  it('should return  Amex Card Type', () => {
    expect(detectCardType('378282246310005')).toBe(CardType.AMEX);
  });
});

describe('test getReturnValue function', () => {
  it('should return bin value for card number when return value false', () => {
    expect(
      getReturnValue(
        '4111 1111 1111 1111',
        false,
        ElementType.CARD_NUMBER,
        CardType.VISA
      )
    ).toBe('41111111XXXXXXXX');
    expect(
      getReturnValue(
        '378282246310005',
        false,
        ElementType.CARD_NUMBER,
        CardType.AMEX
      )
    ).toBe('378282XXXXXXXXX');
    expect(
      getReturnValue('3782', false, ElementType.CARD_NUMBER, CardType.AMEX)
    ).toBe('3782');
  });

  it('should return whole value when return value is true', () => {
    expect(getReturnValue('4111', true, ElementType.PIN)).toBe('4111');
  });

  it('should return whole card number value when return value is true', () => {
    expect(
      getReturnValue('4111 1111 1111 1111', true, ElementType.CARD_NUMBER)
    ).toBe('4111111111111111');
  });

  it('should return non string value when return value is true', () => {
    expect(getReturnValue(1000, true, ElementType.INPUT_FIELD)).toBe(1000);
  });
  it('should return empty string when return value is false,not a card element', () => {
    expect(getReturnValue('4111', false, ElementType.PIN)).toBe('');
  });
});

describe('test formatCollectElementOptions function', () => {
  it('should print warn log of invalid ExpirationDate format', () => {
    const formattedOptions = formatCollectElementOptions(
      ElementType.EXPIRATION_DATE,
      { format: 'ZSAE' },
      LogLevel.WARN
    );
    expect(isValidExpiryDateFormat(null)).toBe(false);
    expect(printLog).toBeCalled();
    expect(parameterizedString).toBeCalled();
    expect(formattedOptions).toEqual({
      required: false,
      format: DEFAULT_EXPIRATION_DATE_FORMAT,
    });
  });

  it('should print warn log of invalid EXPIRATION_YEAR format', () => {
    const formattedOptions = formatCollectElementOptions(
      ElementType.EXPIRATION_YEAR,
      { format: 'ZSAE' },
      LogLevel.WARN
    );
    expect(isValidExpiryYearFormat(undefined)).toBe(false);
    expect(printLog).toBeCalled();
    expect(parameterizedString).toBeCalled();
    expect(formattedOptions).toEqual({
      required: false,
      format: DEFAULT_EXPIRATION_YEAR_FORMAT,
    });
  });
});

describe('test isValidURL function', () => {
  it('should return true for valid URL', () => {
    expect(isValidURL('https://validurl.com')).toBe(true);
  });

  it('should return false for Invalid URL', () => {
    expect(isValidURL('http://validurl.com')).toBe(false);
    expect(isValidURL('iamurl.com')).toBe(false);
    expect(isValidURL('www.ss')).toBe(false);
  });
});

describe('test formatCardNumber function', () => {
  it('should return formatted cardnumber based on type', () => {
    expect(formatCardNumber('4111111111111111', CardType.VISA)).toBe(
      '4111 1111 1111 1111'
    );
    expect(formatCardNumber('378282246310005', CardType.AMEX)).toBe(
      '3782 822463 10005'
    );
  });
});

describe('test getYearAndMonthBasedOnFormat function', () => {
  it('should return year based on format', () => {
    expect(getYearAndMonthBasedOnFormat('12/32', 'MM/YY')).toEqual({
      month: '12',
      year: 2032,
    });
    expect(getYearAndMonthBasedOnFormat('32/12', 'YY/MM')).toEqual({
      month: '12',
      year: 2032,
    });
    expect(getYearAndMonthBasedOnFormat('2032/12', 'YYYY/MM')).toEqual({
      month: '12',
      year: '2032',
    });
    expect(getYearAndMonthBasedOnFormat('12/2032', 'MM/YYYY')).toEqual({
      month: '12',
      year: '2032',
    });
  });
});

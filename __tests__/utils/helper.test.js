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
  getMetaObject,
  getDeviceModel,
  formatInputFieldValue,
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

describe('getDeviceModel', () => {
  it('shloud return model names as iPad for systemName as iPadOS', () => {
    const platform = {
      OS: 'ios',
      constants: {
        systemName: 'iPadOS',
      },
    };
    const result = getDeviceModel(platform);
    expect(result).toEqual('iPad');
  });

  it('shloud return model names as iPhone for systemName as iOS', () => {
    const platform = {
      OS: 'ios',
      constants: {
        systemName: 'iOS',
      },
    };
    const result = getDeviceModel(platform);
    expect(result).toEqual('Iphone');
  });

  it('shloud return model names as gphone64 for android', () => {
    const platform = {
      OS: 'android',
      constants: {
        Model: 'sdk_gphone64_arm64',
      },
    };
    const result = getDeviceModel(platform);
    expect(result).toEqual('sdk_gphone64_arm64');
  });

  it('shloud return model names as windows for unknown', () => {
    const platform = {
      OS: 'windows',
    };
    const result = getDeviceModel(platform);
    expect(result).toEqual('windows');
  });
});

describe('getMetaObject', () => {
  it('shloud return full metaobject with all the fields filled', () => {
    const platform = {
      OS: 'ios',
      Version: '16.0',
      constants: {
        systemName: 'iPadOS',
      },
    };
    const sdkDetails = {
      name: 'skyflow-react-native',
      version: '1.4.0',
      devDependencies: {
        'react-native': '0.69.2',
      },
    };
    const result = getMetaObject(platform, sdkDetails);
    expect(result).toStrictEqual({
      sdk_client_device_model: 'iPad',
      sdk_name_version: 'skyflow-react-native@1.4.0',
      sdk_os_version: 'ios@16.0',
      sdk_runtime_details: 'react-native@0.69.2',
    });
  });

  it('shloud return full metaobject with all the fields except for the version', () => {
    const platform = {
      OS: 'ios',
      constants: {
        systemName: 'iPadOS',
      },
    };
    const sdkDetails = {
      name: 'skyflow-react-native',
      version: '1.4.0',
      devDependencies: {
        'react-native': '0.69.2',
      },
    };
    const result = getMetaObject(platform, sdkDetails);
    expect(result).toStrictEqual({
      sdk_client_device_model: 'iPad',
      sdk_name_version: 'skyflow-react-native@1.4.0',
      sdk_os_version: 'ios@',
      sdk_runtime_details: 'react-native@0.69.2',
    });
  });
});

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

  it('should format expiration date options correctly', () => {
    const validFormats = ['MM/YY', 'MM/YYYY', 'YYYY/MM', 'YY/MM'];
    validFormats.forEach((format) => {
      const result = formatCollectElementOptions(
        ElementType.EXPIRATION_DATE,
        { format },
        LogLevel.WARN
      );
      expect(result).toEqual({
        format,
        required: false,
      });
    });
  });

  it('should use default format for invalid expiration date format', () => {
    const result = formatCollectElementOptions(
      ElementType.EXPIRATION_DATE,
      { format: 'INVALID' },
      LogLevel.WARN
    );
    expect(result).toEqual({
      format: DEFAULT_EXPIRATION_DATE_FORMAT,
      required: false,
    });
    expect(printLog).toBeCalled();
  });

  it('should format expiration year options correctly', () => {
    const validFormats = ['YY', 'YYYY'];
    validFormats.forEach((format) => {
      const result = formatCollectElementOptions(
        ElementType.EXPIRATION_YEAR,
        { format },
        LogLevel.WARN
      );
      expect(result).toEqual({
        format,
        required: false,
      });
    });
  });

  it('should use default format for invalid expiration year format', () => {
    const result = formatCollectElementOptions(
      ElementType.EXPIRATION_YEAR,
      { format: 'INVALID' },
      LogLevel.WARN
    );
    expect(result).toEqual({
      format: DEFAULT_EXPIRATION_YEAR_FORMAT,
      required: false,
    });
    expect(printLog).toBeCalled();
  });
});

describe('test formatCardNumber with different formats', () => {
  const testCases = [
    {
      input: '4111111111111111',
      type: CardType.VISA,
      format: 'XXXX-XXXX-XXXX-XXXX',
      expected: '4111-1111-1111-1111',
    },
    {
      input: '378282246310005',
      type: CardType.AMEX,
      format: 'XXXX-XXXX-XXXX-XXXX',
      expected: '3782-822463-10005',
    },
    {
      input: '6011111111111117',
      type: CardType.DISCOVER,
      format: 'XXXX XXXX XXXX XXXX',
      expected: '6011 1111 1111 1117',
    },
    // Test partial inputs
    {
      input: '411111',
      type: CardType.VISA,
      format: 'XXXX-XXXX-XXXX-XXXX',
      expected: '4111-11',
    },
    // Test empty input
    {
      input: '',
      type: CardType.DEFAULT,
      format: 'XXXX-XXXX-XXXX-XXXX',
      expected: '',
    },
  ];

  testCases.forEach((testCase) => {
    it(`should format ${testCase.type} card number correctly with format ${testCase.format}`, () => {
      expect(
        formatCardNumber(testCase.input, testCase.type, testCase.format)
      ).toBe(testCase.expected);
    });
  });
});

describe('test formatInputFieldValue with different formats', () => {
  const testCases = [
    {
      input: '123456',
      format: 'XX-XX-XX',
      expected: '12-34-56',
    },
    {
      input: '123456',
      format: 'XXX XXX',
      expected: '123 456',
    },
    {
      input: '12345',
      format: 'XX/XX/X',
      expected: '12/34/5',
    },
    {
      input: '1567C89',
      format: 'XX/XYX/X',
      translation: { X: '[5-9]', Y: '[A-C]' },
      expected: '56/7C8/9',
    },
    // Combination of constants and dynamic inputs
    {
      input: '1234121234',
      format: '+91 XXXX-XX-XXXX',
      expected: '+91 1234-12-1234',
    },
    {
      input: 'B5678978C7QAB97',
      format: '91 YXX-XZX-XXY-XZYXX',
      translation: { X: '[5-9]', Y: '[A-C]' },
      expected: '91 B56-7Z8-97C-7ZA97',
    },
    // Test with special characters in format
    {
      input: '123456',
      format: 'XX@XX#XX',
      expected: '12@34#56',
    },
    // Test partial input
    {
      input: '123',
      format: 'XX-XX-XX',
      expected: '12-3',
    },
    // Test input longer than format
    {
      input: '1234567',
      format: 'XX-XX',
      expected: '12-34',
    },
    // Test empty input
    {
      input: '',
      format: 'XX-XX',
      expected: '',
    },
    // Test with no format
    {
      input: '123456',
      format: '',
      expected: '123456',
    },
  ];

  testCases.forEach((testCase) => {
    const translation = testCase.translation || {
      X: '[0-9]',
    };
    it(`should format input '${testCase.input}' with format '${
      testCase.format
    }' & translation '${JSON.stringify(translation)}' correctly`, () => {
      expect(
        formatInputFieldValue(
          testCase.input,
          testCase.format,
          testCase?.translation
        )
      ).toBe(testCase.expected);
    });
  });
});

describe('test formatCollectElementOptions for different element types', () => {
  it('should format card number options correctly', () => {
    const options = {
      format: 'XXXX-XXXX-XXXX-XXXX',
      required: true,
    };
    const result = formatCollectElementOptions(
      ElementType.CARD_NUMBER,
      options,
      LogLevel.WARN
    );
    expect(result).toEqual({
      format: 'XXXX-XXXX-XXXX-XXXX',
      required: true,
    });
  });

  it('should preserve other options while formatting', () => {
    const options = {
      format: 'XXXX-XXXX-XXXX-XXXX',
      required: true,
      enableCardIcon: true,
      customOption: 'value',
    };
    const result = formatCollectElementOptions(
      ElementType.CARD_NUMBER,
      options,
      LogLevel.WARN
    );
    expect(result).toEqual(options);
  });
});

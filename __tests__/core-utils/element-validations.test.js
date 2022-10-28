/*
    Copyright (c) 2022 Skyflow, Inc.
*/
import {
  validateInitConfig,
  validateCardNumberLengthCheck,
} from '../../src/core-utils/element-validations';
import SKYFLOW_ERROR_CODE from '../../src/utils/skyflow-error-code';

describe('test validateInitConfig function', () => {
  it('should throw skyflow error for missing vaultID', () => {
    try {
      validateInitConfig({});
    } catch (err) {
      expect(err?.error?.description).toEqual(
        SKYFLOW_ERROR_CODE.VAULTID_IS_REQUIRED.description
      );
    }
  });

  it('should throw skyflow error for empty vaultID', () => {
    try {
      validateInitConfig({ vaultID: null });
    } catch (err) {
      expect(err?.error?.description).toEqual(
        SKYFLOW_ERROR_CODE.EMPTY_VAULTID_IN_INIT.description
      );
    }
  });

  it('should throw skyflow error for missing vaultURL', () => {
    try {
      validateInitConfig({ vaultID: '123' });
    } catch (err) {
      expect(err?.error?.description).toEqual(
        SKYFLOW_ERROR_CODE.VAULTURL_IS_REQUIRED.description
      );
    }
  });

  it('should throw skyflow error for invalid vaultURL', () => {
    try {
      validateInitConfig({ vaultID: '123', vaultURL: 'url' });
    } catch (err) {
      expect(err?.error?.description).toEqual(
        SKYFLOW_ERROR_CODE.INVALID_VAULTURL_IN_INIT.description
      );
    }
  });

  it('should throw skyflow error for missing getBearerToken', () => {
    try {
      validateInitConfig({ vaultID: '123', vaultURL: 'https://abc.com' });
    } catch (err) {
      expect(err?.error?.description).toEqual(
        SKYFLOW_ERROR_CODE.GET_BEARER_TOKEN_IS_REQUIRED.description
      );
    }
  });
});

describe('validate card number length check', () => {
  it('isValidCardNumber', () => {
    expect(validateCardNumberLengthCheck('5105105105105100')).toBe(true);
    expect(validateCardNumberLengthCheck('510510')).toBe(false);
  });
});

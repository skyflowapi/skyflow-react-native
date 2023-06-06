/*
    Copyright (c) 2022 Skyflow, Inc.
*/
import {
  validateInitConfig,
  validateCardNumberLengthCheck,
  validateUpsertOptions,
  validatePin,
  validateRevealElementRecords,
} from '../../src/core-utils/element-validations';
import SKYFLOW_ERROR_CODE from '../../src/utils/skyflow-error-code';
import { parameterizedString } from '../../src/utils/logs-helper';
import { RedactionType } from '../../src/utils/constants';

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

describe('test validate card number length check', () => {
  it('isValidCardNumber', () => {
    expect(validateCardNumberLengthCheck('5105105105105100')).toBe(true);
    expect(validateCardNumberLengthCheck('510510')).toBe(false);
  });
});

describe('test validateUpsertOptions', () => {
  it('should throw error for invalid upsert option type', () => {
    try {
      validateUpsertOptions({});
    } catch (err) {
      expect(err?.error?.description).toEqual(
        SKYFLOW_ERROR_CODE.INVALID_UPSERT_OPTION_TYPE.description
      );
    }
  });

  it('should throw error for empty upsert array', () => {
    try {
      validateUpsertOptions([]);
    } catch (err) {
      expect(err?.error?.description).toEqual(
        SKYFLOW_ERROR_CODE.EMPTY_UPSERT_OPTIONS_ARRAY.description
      );
    }
  });

  it('should throw error for inavlid upsert object type', () => {
    try {
      validateUpsertOptions([true, 123]);
    } catch (err) {
      expect(err?.error?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.INVALID_UPSERT_OPTION_OBJECT_TYPE.description,
          0
        )
      );
    }
  });
  it('should throw error for missing table key in object', () => {
    try {
      validateUpsertOptions([{}]);
    } catch (err) {
      expect(err?.error?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.MISSING_TABLE_IN_UPSERT_OPTION.description,
          0
        )
      );
    }
  });
  it('should throw error for invalid table value in upsert object', () => {
    try {
      validateUpsertOptions([{ table: 123 }]);
    } catch (err) {
      expect(err?.error?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.INVALID_TABLE_IN_UPSERT_OPTION.description,
          0
        )
      );
    }
    try {
      validateUpsertOptions([{ table: '' }]);
    } catch (err) {
      expect(err?.error?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.INVALID_TABLE_IN_UPSERT_OPTION.description,
          0
        )
      );
    }
  });
  it('should throw error for missing column key in upsert object', () => {
    try {
      validateUpsertOptions([{ table: 'table1' }]);
    } catch (err) {
      expect(err?.error?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.MISSING_COLUMN_IN_UPSERT_OPTION.description,
          0
        )
      );
    }
  });
  it('should throw error for invalid column value in upsert object', () => {
    try {
      validateUpsertOptions([{ table: 'table1', column: true }]);
    } catch (err) {
      expect(err?.error?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.INVALID_COLUMN_IN_UPSERT_OPTION.description,
          0
        )
      );
    }
    try {
      validateUpsertOptions([{ table: 'table1', column: '' }]);
    } catch (err) {
      expect(err?.error?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.INVALID_COLUMN_IN_UPSERT_OPTION.description,
          0
        )
      );
    }
  });
});

describe('test validatePin function', () => {
  it('should return true for value length within range', () => {
    expect(validatePin('1234')).toBe(true);
    expect(validatePin('123456789')).toBe(true);
  });
  it('should return true for value length outof range', () => {
    expect(validatePin('12')).toBe(false);
    expect(validatePin('12345678901234677')).toBe(false);
  });
});

describe('test validateRevealElementRecords', () => {
  it('should throw error when invalid redaction type is passed', (done) => {
    try {
      validateRevealElementRecords([
        {
          token: '1234',
          redaction: 'INVALID',
        },
      ]);
      done('should throw error');
    } catch (err) {
      expect(err?.errors[0]?.description).toBe(
        SKYFLOW_ERROR_CODE.INVALID_REDACTION_TYPE.description
      );
      done();
    }
  });

  it('should throw error when invalid redaction value type is passed', (done) => {
    try {
      validateRevealElementRecords([
        {
          token: '1234',
          redaction: 1234,
        },
      ]);
      done('should throw error');
    } catch (err) {
      expect(err?.errors[0]?.description).toBe(
        SKYFLOW_ERROR_CODE.INVALID_REDACTION_VALUE.description
      );
      done();
    }
  });
  it('should throw error when invalid redaction value type enum is passed', (done) => {
    try {
      validateRevealElementRecords([
        {
          token: '1234',
          redaction: RedactionType,
        },
      ]);
      done('should throw error');
    } catch (err) {
      expect(err?.errors[0]?.description).toBe(
        SKYFLOW_ERROR_CODE.INVALID_REDACTION_VALUE.description
      );
      done();
    }
  });
});

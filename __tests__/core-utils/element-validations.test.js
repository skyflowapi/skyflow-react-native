/*
    Copyright (c) 2022 Skyflow, Inc.
*/
import {
  validateInitConfig,
  validateCardNumberLengthCheck,
  validateUpsertOptions,
  validatePin,
  validateRevealElementRecords,
  validateGetInput,
  validateExpiryDate,
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

  it('should throw error for invalid upsert object type', () => {
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
  it('should return true for value length out of range', () => {
    expect(validatePin('12')).toBe(false);
    expect(validatePin('12345678901234677')).toBe(false);
  });
});

describe('test validateExpiryDate function with various format', () => {
  it('should return true for current month/year', () => {
    const today = new Date();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear();
    expect(validateExpiryDate(`${month}/${year}`, 'MM/YYYY')).toBe(true);
    expect(validateExpiryDate(`${year}/${month}`, 'YYYY/MM')).toBe(true);

    const yearTwoDigit = year % 100;
    expect(validateExpiryDate(`${month}/${yearTwoDigit}`, 'MM/YY')).toBe(true);
    expect(validateExpiryDate(`${yearTwoDigit}/${month}`, 'YY/MM')).toBe(true);
  });

  it('should return true for valid future date', () => {
    expect(validateExpiryDate('07/2074', 'MM/YYYY')).toBe(true);
    expect(validateExpiryDate('2074/04', 'YYYY/MM')).toBe(true);
    expect(validateExpiryDate('01/35', 'MM/YY')).toBe(true);
    expect(validateExpiryDate('35/04', 'YY/MM')).toBe(true);
  });

  it('should return false for expired dates', () => {
    expect(validateExpiryDate('01/2020', 'MM/YYYY')).toBe(false);
    expect(validateExpiryDate('2000/04', 'YYYY/MM')).toBe(false);
    expect(validateExpiryDate('04/20', 'MM/YY')).toBe(false);
    expect(validateExpiryDate('20/04', 'YY/MM')).toBe(false);
  });

  it('should return false for invalid month for expired date', () => {
    expect(validateExpiryDate('15/2040', 'MM/YYYY')).toBe(false);
    expect(validateExpiryDate('2040/16', 'YYYY/MM')).toBe(false);
    expect(validateExpiryDate('14/20', 'MM/YY')).toBe(false);
    expect(validateExpiryDate('40/14', 'YY/MM')).toBe(false);
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

describe('test validateGetInput', () => {
  it('should throw error for missing "records" key', () => {
    try {
      validateGetInput({ recordss: {} });
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        SKYFLOW_ERROR_CODE.RECORDS_KEY_NOT_FOUND_GET.description
      );
    }
  });

  it('should throw error for empty records', () => {
    try {
      validateGetInput({ records: [] });
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        SKYFLOW_ERROR_CODE.EMPTY_RECORDS_GET.description
      );
    }
  });

  it('should throw error for invalid records type', () => {
    try {
      validateGetInput({ records: {} });
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        SKYFLOW_ERROR_CODE.INVALID_RECORDS_IN_GET.description
      );
    }
  });

  it('should throw error for empty record', () => {
    try {
      validateGetInput({ records: [{}] });
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        SKYFLOW_ERROR_CODE.EMPTY_RECORDS_GET.description
      );
    }
  });

  it('should throw error for invalid ids', () => {
    try {
      validateGetInput({ records: [{ ids: {} }] });
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.INVALID_IDS_IN_GET.description,
          0
        )
      );
    }
  });

  it('should throw error for empty ids array', () => {
    try {
      validateGetInput({ records: [{ ids: [] }] });
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        parameterizedString(SKYFLOW_ERROR_CODE.EMPTY_IDS_IN_GET.description, 0)
      );
    }
  });

  it('should throw error for empty id', () => {
    try {
      validateGetInput({ records: [{ ids: [null] }] });
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.EMPTY_SKYFLOWID_IN_GET.description,
          0
        )
      );
    }
  });

  it('should throw error for invalid id', () => {
    try {
      validateGetInput({ records: [{ ids: [{}] }] });
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.INVALID_SKYFLOWID_TYPE_IN_GET.description,
          0
        )
      );
    }
  });

  it('should throw error for missing table using ids', () => {
    try {
      validateGetInput({ records: [{ ids: ['123'] }] });
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.MISSING_TABLE_IN_GET.description,
          0
        )
      );
    }
  });

  it('should throw error for empty table using ids', () => {
    try {
      validateGetInput({ records: [{ ids: ['123'], table: null }] });
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.EMPTY_TABLE_IN_GET.description,
          0
        )
      );
    }
  });

  it('should throw error for invalid table using ids', () => {
    try {
      validateGetInput({ records: [{ ids: ['123'], table: {} }] });
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.INVALID_TABLE_IN_GET.description,
          0
        )
      );
    }
  });

  it('should throw error for missing redaction using ids', () => {
    try {
      validateGetInput({ records: [{ ids: ['123'], table: 'test' }] });
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.MISSING_REDACTION_IN_GET.description,
          0
        )
      );
    }
  });

  it('should throw error for empty redaction using ids', () => {
    try {
      validateGetInput({
        records: [{ ids: ['123'], table: 'test', redaction: null }],
      });
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.EMPTY_REDACTION_TYPE_IN_GET.description,
          0
        )
      );
    }
  });

  it('should throw error for invalid redaction using ids', () => {
    try {
      validateGetInput({
        records: [{ ids: ['123'], table: 'test', redaction: 'test' }],
      });
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.INVALID_REDACTION_TYPE_IN_GET.description,
          0
        )
      );
    }
  });

  it('should throw error for invalid column values', () => {
    try {
      validateGetInput({
        records: [
          {
            table: 'table',
            columnValues: {},
            redaction: RedactionType.PLAIN_TEXT,
            columnName: 'columnName',
          },
        ],
      });
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.INVALID_COLUMN_VALUES_IN_GET.description,
          0
        )
      );
    }
  });

  it('should throw error for empty column values when columnValues is null', () => {
    try {
      validateGetInput({
        records: [
          {
            table: 'table',
            columnValues: null,
            redaction: RedactionType.PLAIN_TEXT,
            columnName: 'columnName',
          },
        ],
      });
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.EMPTY_RECORD_COLUMN_VALUES.description,
          0
        )
      );
    }
  });

  it('should throw error for empty column value', () => {
    try {
      validateGetInput({
        records: [
          {
            table: 'table',
            columnValues: [null],
            redaction: RedactionType.PLAIN_TEXT,
            columnName: 'columnName',
          },
        ],
      });
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.EMPTY_COLUMN_VALUE.description,
          0
        )
      );
    }
  });

  it('should throw error for invalid column value', () => {
    try {
      validateGetInput({
        records: [
          {
            table: 'table',
            columnValues: [{}],
            redaction: RedactionType.PLAIN_TEXT,
            columnName: 'columnName',
          },
        ],
      });
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.INVALID_RECORD_COLUMN_VALUE_TYPE.description,
          0
        )
      );
    }
  });

  it('should throw error for missing table using column values', () => {
    try {
      validateGetInput({
        records: [
          {
            columnValues: ['123'],
            redaction: RedactionType.PLAIN_TEXT,
            columnName: 'columnName',
          },
        ],
      });
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.MISSING_TABLE_IN_GET.description,
          0
        )
      );
    }
  });

  it('should throw error for empty table using column values', () => {
    try {
      validateGetInput({
        records: [
          {
            columnValues: ['123'],
            table: null,
            redaction: RedactionType.PLAIN_TEXT,
            columnName: 'columnName',
          },
        ],
      });
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.EMPTY_TABLE_IN_GET.description,
          0
        )
      );
    }
  });

  it('should throw error for invalid table using column values', () => {
    try {
      validateGetInput({
        records: [
          {
            columnValues: ['123'],
            table: {},
            redaction: RedactionType.PLAIN_TEXT,
            columnName: 'columnName',
          },
        ],
      });
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.INVALID_TABLE_IN_GET.description,
          0
        )
      );
    }
  });

  it('should throw error for missing redaction using column values', () => {
    try {
      validateGetInput({
        records: [
          { columnValues: ['123'], table: 'test', columnName: 'columnName' },
        ],
      });
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.MISSING_REDACTION_IN_GET.description,
          0
        )
      );
    }
  });

  it('should throw error for empty redaction using column values', () => {
    try {
      validateGetInput({
        records: [
          {
            columnValues: ['123'],
            table: 'test',
            redaction: null,
            columnName: 'columnName',
          },
        ],
      });
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.EMPTY_REDACTION_TYPE_IN_GET.description,
          0
        )
      );
    }
  });

  it('should throw error for invalid redaction using column values', () => {
    try {
      validateGetInput({
        records: [
          {
            columnValues: ['123'],
            table: 'test',
            redaction: 'test',
            columnName: 'columnName',
          },
        ],
      });
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.INVALID_REDACTION_TYPE_IN_GET.description,
          0
        )
      );
    }
  });

  it('should throw error for undefined column name error', () => {
    try {
      validateGetInput({
        records: [
          {
            columnValues: ['column value1'],
            columnName: undefined,
            table: 'test',
            redaction: RedactionType.PLAIN_TEXT,
          },
        ],
      });
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.MISSING_RECORD_COLUMN_NAME.description,
          0
        )
      );
    }
  });

  it('should throw error for invalid column name', () => {
    try {
      validateGetInput({
        records: [
          {
            columnValues: ['column value1'],
            columnName: {},
            table: 'test',
            redaction: RedactionType.PLAIN_TEXT,
          },
        ],
      });
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.INVALID_RECORD_COLUMN_NAME_TYPE.description,
          0
        )
      );
    }
  });

  it('should throw error for empty column values error', () => {
    try {
      validateGetInput({
        records: [
          {
            columnValues: [],
            columnName: 'column',
            table: 'test',
            redaction: RedactionType.PLAIN_TEXT,
          },
        ],
      });
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.EMPTY_RECORD_COLUMN_VALUES.description,
          0
        )
      );
    }
  });

  it('should throw error for missing ids or columnValues in get', () => {
    try {
      validateGetInput({
        records: [{ table: 'test', redaction: RedactionType.PLAIN_TEXT }],
      });
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.MISSING_IDS_OR_COLUMN_VALUES_IN_GET.description,
          0
        )
      );
    }
  });

  it('should throw error for missing columnValues key in get', () => {
    try {
      validateGetInput({
        records: [
          {
            table: 'test',
            redaction: RedactionType.PLAIN_TEXT,
            columnName: 'columnName',
            columnValues: undefined,
          },
        ],
      });
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.MISSING_RECORD_COLUMN_VALUE.description,
          0
        )
      );
    }
  });

  it('should throw error for ids and columnName both specified in get', () => {
    try {
      validateGetInput({
        records: [
          {
            ids: ['123'],
            table: 'test',
            redaction: RedactionType.PLAIN_TEXT,
            columnName: 'columnName',
          },
        ],
      });
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.SKYFLOW_IDS_AND_COLUMN_NAME_BOTH_SPECIFIED
            .description,
          0
        )
      );
    }
  });

  it('should throw error for column values is missing', () => {
    try {
      validateGetInput({
        records: [
          {
            table: 'test',
            redaction: RedactionType.PLAIN_TEXT,
            columnName: 'columnName',
          },
        ],
      });
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.MISSING_RECORD_COLUMN_VALUE.description,
          0
        )
      );
    }
  });

  // ids + columnValues without columnName
  it('should throw MISSING_RECORD_COLUMN_NAME when ids and columnValues are present without columnName', () => {
    try {
      validateGetInput({
        records: [
          {
            ids: ['123'],
            table: 'test',
            redaction: RedactionType.PLAIN_TEXT,
            columnValues: ['val1'],
          },
        ],
      });
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.MISSING_RECORD_COLUMN_NAME.description,
          0
        )
      );
    }
  });

  // fields with ids → valid
  it('should not throw when fields is provided with ids', () => {
    expect(() =>
      validateGetInput({
        records: [
          {
            ids: ['123'],
            table: 'test',
            redaction: RedactionType.PLAIN_TEXT,
            fields: ['name', 'email'],
          },
        ],
      })
    ).not.toThrow();
  });

  // tokens:true + fields → valid (no restriction)
  it('should not throw when tokens:true is combined with fields', () => {
    expect(() =>
      validateGetInput(
        {
          records: [
            {
              ids: ['123'],
              table: 'test',
              fields: ['name'],
            },
          ],
        },
        { tokens: true }
      )
    ).not.toThrow();
  });

  // error at record index 1
  it('should include correct index in error when second record is invalid', () => {
    try {
      validateGetInput({
        records: [
          { ids: ['123'], table: 'test', redaction: RedactionType.DEFAULT },
          { ids: ['456'], table: null, redaction: RedactionType.DEFAULT },
        ],
      });
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.EMPTY_TABLE_IN_GET.description,
          1
        )
      );
    }
  });

  // offset alone without limit (column query) → valid
  it('should not throw when only offset is provided with columnName and columnValues', () => {
    expect(() =>
      validateGetInput({
        records: [
          {
            table: 'test',
            redaction: RedactionType.DEFAULT,
            columnName: 'email',
            columnValues: ['test@example.com'],
            offset: '5',
          },
        ],
      })
    ).not.toThrow();
  });

  // limit alone without offset (column query) → valid
  it('should not throw when only limit is provided with columnName and columnValues', () => {
    expect(() =>
      validateGetInput({
        records: [
          {
            table: 'test',
            redaction: RedactionType.DEFAULT,
            columnName: 'email',
            columnValues: ['test@example.com'],
            limit: '10',
          },
        ],
      })
    ).not.toThrow();
  });

  // offset/limit with columnName but missing columnValues
  it('should throw MISSING_RECORD_COLUMN_VALUE when offset/limit with columnName but no columnValues', () => {
    try {
      validateGetInput({
        records: [
          {
            table: 'test',
            redaction: RedactionType.DEFAULT,
            columnName: 'email',
            offset: '0',
            limit: '10',
          },
        ],
      });
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.MISSING_RECORD_COLUMN_VALUE.description,
          0
        )
      );
    }
  });
});

describe('test get options validation', () => {
  it('should throw error for string value passed in options tokens', () => {
    try {
      validateGetInput(
        {
          records: [
            { ids: ['123'], table: 'test', redaction: RedactionType.DEFAULT },
          ],
        },
        { tokens: 'true' }
      );
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.INVALID_TOKENS_IN_GET.description,
          0
        )
      );
    }
  });

  it('should throw error for integer value passed in options tokens', () => {
    try {
      validateGetInput(
        {
          records: [
            { ids: ['123'], table: 'test', redaction: RedactionType.DEFAULT },
          ],
        },
        { tokens: 123 }
      );
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.INVALID_TOKENS_IN_GET.description,
          0
        )
      );
    }
  });

  it('should throw error for undefined passed in options tokens', () => {
    try {
      validateGetInput(
        {
          records: [
            { ids: ['123'], table: 'test', redaction: RedactionType.DEFAULT },
          ],
        },
        { tokens: undefined }
      );
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.INVALID_TOKENS_IN_GET.description,
          0
        )
      );
    }
  });

  it('should throw error for null passed in options tokens', () => {
    try {
      validateGetInput(
        {
          records: [
            { ids: ['123'], table: 'test', redaction: RedactionType.DEFAULT },
          ],
        },
        { tokens: null }
      );
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.INVALID_TOKENS_IN_GET.description,
          0
        )
      );
    }
  });

  it('should throw error for valid redaction is passed along with valid options tokens', () => {
    try {
      validateGetInput(
        {
          records: [
            { ids: ['123'], table: 'test', redaction: RedactionType.DEFAULT },
          ],
        },
        { tokens: true }
      );
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.REDACTION_WITH_TOKENS_NOT_SUPPORTED.description,
          0
        )
      );
    }
  });

  it('should throw error for undefined redaction is passed along with valid options tokens', () => {
    try {
      validateGetInput(
        { records: [{ ids: ['123'], table: 'test', redaction: undefined }] },
        { tokens: true }
      );
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.REDACTION_WITH_TOKENS_NOT_SUPPORTED.description,
          0
        )
      );
    }
  });

  it('should throw error for redaction is not passed with options tokens as false', () => {
    try {
      validateGetInput(
        { records: [{ ids: ['123'], table: 'test' }] },
        { tokens: false }
      );
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.MISSING_REDACTION_IN_GET.description,
          0
        )
      );
    }
  });

  it('should throw error for undefined redaction is passed with options tokens as false', () => {
    try {
      validateGetInput(
        { records: [{ ids: ['123'], table: 'test', redaction: undefined }] },
        { tokens: false }
      );
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.EMPTY_REDACTION_TYPE_IN_GET.description,
          0
        )
      );
    }
  });

  it('should throw error for null redaction is passed with options tokens as false', () => {
    try {
      validateGetInput(
        { records: [{ ids: ['123'], table: 'test', redaction: null }] },
        { tokens: false }
      );
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.EMPTY_REDACTION_TYPE_IN_GET.description,
          0
        )
      );
    }
  });

  it('should throw error for column details are passed along with valid options tokens', () => {
    try {
      validateGetInput(
        {
          records: [
            {
              columnName: 'columnName',
              columnValues: ['columnValue'],
              table: 'test',
            },
          ],
        },
        { tokens: true }
      );
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.TOKENS_GET_COLUMN_NOT_SUPPORTED.description,
          0
        )
      );
    }
  });

  it('should throw error for non-string offset in record', () => {
    try {
      validateGetInput({
        records: [
          {
            table: 'test',
            redaction: RedactionType.DEFAULT,
            columnName: 'email',
            columnValues: ['test@example.com'],
            offset: 10,
          },
        ],
      });
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.INVALID_OFFSET_IN_GET.description,
          0
        )
      );
    }
  });

  it('should throw error for null offset in record', () => {
    try {
      validateGetInput({
        records: [
          {
            table: 'test',
            redaction: RedactionType.DEFAULT,
            columnName: 'email',
            columnValues: ['test@example.com'],
            offset: null,
          },
        ],
      });
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.INVALID_OFFSET_IN_GET.description,
          0
        )
      );
    }
  });

  it('should throw error for non-string limit in record', () => {
    try {
      validateGetInput({
        records: [
          {
            table: 'test',
            redaction: RedactionType.DEFAULT,
            columnName: 'email',
            columnValues: ['test@example.com'],
            limit: true,
          },
        ],
      });
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.INVALID_LIMIT_IN_GET.description,
          0
        )
      );
    }
  });

  it('should throw error for null limit in record', () => {
    try {
      validateGetInput({
        records: [
          {
            table: 'test',
            redaction: RedactionType.DEFAULT,
            columnName: 'email',
            columnValues: ['test@example.com'],
            limit: null,
          },
        ],
      });
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.INVALID_LIMIT_IN_GET.description,
          0
        )
      );
    }
  });

  it('should throw error for empty string offset in record', () => {
    try {
      validateGetInput({
        records: [
          {
            table: 'test',
            redaction: RedactionType.DEFAULT,
            columnName: 'email',
            columnValues: ['test@example.com'],
            offset: '',
          },
        ],
      });
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.EMPTY_OFFSET_IN_GET.description,
          0
        )
      );
    }
  });

  it('should throw error for empty string limit in record', () => {
    try {
      validateGetInput({
        records: [
          {
            table: 'test',
            redaction: RedactionType.DEFAULT,
            columnName: 'email',
            columnValues: ['test@example.com'],
            limit: '',
          },
        ],
      });
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.EMPTY_LIMIT_IN_GET.description,
          0
        )
      );
    }
  });

  it('should throw error for non-boolean downloadURL in get options', () => {
    try {
      validateGetInput(
        { records: [{ ids: ['123'], table: 'test', redaction: RedactionType.DEFAULT }] },
        { downloadURL: 'true' }
      );
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        SKYFLOW_ERROR_CODE.INVALID_DOWNLOAD_URL_IN_GET.description
      );
    }
  });

  it('should throw error for number passed as downloadURL in get options', () => {
    try {
      validateGetInput(
        { records: [{ ids: ['123'], table: 'test', redaction: RedactionType.DEFAULT }] },
        { downloadURL: 1 }
      );
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        SKYFLOW_ERROR_CODE.INVALID_DOWNLOAD_URL_IN_GET.description
      );
    }
  });

  it('should throw error for null downloadURL in get options', () => {
    try {
      validateGetInput(
        { records: [{ ids: ['123'], table: 'test', redaction: RedactionType.DEFAULT }] },
        { downloadURL: null }
      );
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        SKYFLOW_ERROR_CODE.INVALID_DOWNLOAD_URL_IN_GET.description
      );
    }
  });

  it('should throw error for invalid orderBy value in get options', () => {
    try {
      validateGetInput(
        { records: [{ ids: ['123'], table: 'test', redaction: RedactionType.DEFAULT }] },
        { orderBy: 'INVALID_ORDER' }
      );
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        SKYFLOW_ERROR_CODE.INVALID_ORDER_BY_IN_GET.description
      );
    }
  });

  it('should throw error for null orderBy in get options', () => {
    try {
      validateGetInput(
        { records: [{ ids: ['123'], table: 'test', redaction: RedactionType.DEFAULT }] },
        { orderBy: null }
      );
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        SKYFLOW_ERROR_CODE.INVALID_ORDER_BY_IN_GET.description
      );
    }
  });

  it('should throw error when ids and offset are both specified', () => {
    try {
      validateGetInput({
        records: [
          {
            ids: ['123'],
            table: 'test',
            redaction: RedactionType.DEFAULT,
            offset: '5',
          },
        ],
      });
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        SKYFLOW_ERROR_CODE.IDS_AND_OFFSET_LIMIT_BOTH_SPECIFIED.description
      );
    }
  });

  it('should throw error when ids and limit are both specified', () => {
    try {
      validateGetInput({
        records: [
          {
            ids: ['123'],
            table: 'test',
            redaction: RedactionType.DEFAULT,
            limit: '10',
          },
        ],
      });
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        SKYFLOW_ERROR_CODE.IDS_AND_OFFSET_LIMIT_BOTH_SPECIFIED.description
      );
    }
  });

  it('should throw error when ids, offset and limit are all specified', () => {
    try {
      validateGetInput({
        records: [
          {
            ids: ['123'],
            table: 'test',
            redaction: RedactionType.DEFAULT,
            offset: '0',
            limit: '10',
          },
        ],
      });
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        SKYFLOW_ERROR_CODE.IDS_AND_OFFSET_LIMIT_BOTH_SPECIFIED.description
      );
    }
  });

  it('should not throw when offset and limit are used with columnName and columnValues', () => {
    expect(() =>
      validateGetInput({
        records: [
          {
            table: 'test',
            redaction: RedactionType.DEFAULT,
            columnName: 'email',
            columnValues: ['test@example.com'],
            offset: '5',
            limit: '10',
          },
        ],
      })
    ).not.toThrow();
  });

  it('should not throw when only offset and limit are provided without ids or columnName', () => {
    expect(() =>
      validateGetInput({
        records: [
          {
            table: 'test',
            redaction: RedactionType.DEFAULT,
            offset: '0',
            limit: '10',
          },
        ],
      })
    ).not.toThrow();
  });

  it('should throw MISSING_IDS_OR_COLUMN_VALUES_IN_GET when no identifier and no offset/limit', () => {
    try {
      validateGetInput({
        records: [{ table: 'test', redaction: RedactionType.PLAIN_TEXT }],
      });
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.MISSING_IDS_OR_COLUMN_VALUES_IN_GET.description,
          0
        )
      );
    }
  });

  it('should not throw for valid downloadURL in get options', () => {
    expect(() =>
      validateGetInput(
        { records: [{ ids: ['123'], table: 'test', redaction: RedactionType.DEFAULT }] },
        { downloadURL: true }
      )
    ).not.toThrow();
  });

  it('should not throw for valid orderBy ASCENDING in get options', () => {
    expect(() =>
      validateGetInput(
        { records: [{ ids: ['123'], table: 'test', redaction: RedactionType.DEFAULT }] },
        { orderBy: 'ASCENDING' }
      )
    ).not.toThrow();
  });

  it('should not throw for valid orderBy DESCENDING in get options', () => {
    expect(() =>
      validateGetInput(
        { records: [{ ids: ['123'], table: 'test', redaction: RedactionType.DEFAULT }] },
        { orderBy: 'DESCENDING' }
      )
    ).not.toThrow();
  });

  it('should not throw for valid orderBy NONE in get options', () => {
    expect(() =>
      validateGetInput(
        { records: [{ ids: ['123'], table: 'test', redaction: RedactionType.DEFAULT }] },
        { orderBy: 'NONE' }
      )
    ).not.toThrow();
  });
});

describe('test validateGetInput fields in record', () => {
  const validRecord = { ids: ['123'], table: 'test', redaction: RedactionType.PLAIN_TEXT };

  it('should throw error for null fields in record', () => {
    try {
      validateGetInput({ records: [{ ...validRecord, fields: null }] });
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.INVALID_FIELDS_IN_GET.description,
          0
        )
      );
    }
  });

  it('should throw error for non-array fields in record', () => {
    try {
      validateGetInput({ records: [{ ...validRecord, fields: 'occupation' }] });
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.INVALID_FIELDS_IN_GET.description,
          0
        )
      );
    }
  });

  it('should throw error for empty fields array in record', () => {
    try {
      validateGetInput({ records: [{ ...validRecord, fields: [] }] });
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.EMPTY_FIELDS_IN_GET.description,
          0
        )
      );
    }
  });

  it('should throw error for non-string value inside fields array in record', () => {
    try {
      validateGetInput({ records: [{ ...validRecord, fields: [123] }] });
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.INVALID_FIELD_VALUE_IN_GET.description,
          0
        )
      );
    }
  });

  it('should throw error for null value inside fields array in record', () => {
    try {
      validateGetInput({ records: [{ ...validRecord, fields: [null] }] });
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.INVALID_FIELD_VALUE_IN_GET.description,
          0
        )
      );
    }
  });

  it('should throw error for empty string inside fields array in record', () => {
    try {
      validateGetInput({ records: [{ ...validRecord, fields: [''] }] });
    } catch (err) {
      expect(err?.errors[0]?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.EMPTY_FIELD_VALUE_IN_GET.description,
          0
        )
      );
    }
  });

  it('should not throw for valid fields array in record', () => {
    expect(() =>
      validateGetInput({
        records: [{ ...validRecord, fields: ['occupation', 'annual_income'] }],
      })
    ).not.toThrow();
  });
});

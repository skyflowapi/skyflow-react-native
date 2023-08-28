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

  it('should throw error for empty ids', () => {
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

  it('should throw error for empty column values', () => {
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
            columnName: 'cloumn',
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
});

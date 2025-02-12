/*
 Copyright (c) 2022 Skyflow, Inc.
*/
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  CardType,
  CARD_TYPE_REGEX,
  DEFAULT_CARD_LENGTH_RANGE,
  ELEMENTS_CONSTANTS_LIST,
  DEFAULT_EXPIRATION_YEAR_FORMAT,
} from '../../core/constants';
import {
  IConfig,
  IGetInput,
  IGetOptions,
  IInsertRecordInput,
  RedactionType,
  RevealElementInput,
} from '../../utils/constants';
import { getYearAndMonthBasedOnFormat, isValidURL } from '../../utils/helpers';
import SkyflowError from '../../utils/skyflow-error';
import SKYFLOW_ERROR_CODE from '../../utils/skyflow-error-code';

export const validatePin = (pinValue: string) => {
  return new RegExp(ELEMENTS_CONSTANTS_LIST.PIN.regex).test(pinValue);
};

export const validateCvv = (cvvValue: string) => {
  return new RegExp(ELEMENTS_CONSTANTS_LIST.CVV.regex).test(cvvValue);
};

export const validateCardHolderName = (name: string) => {
  return new RegExp(ELEMENTS_CONSTANTS_LIST.CARDHOLDER_NAME.regex).test(name);
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
  if (format === DEFAULT_EXPIRATION_YEAR_FORMAT) {
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

export const validateLengthMatchRule = (
  lengthRuleParams: Record<string, number>,
  value: string
): boolean => {
  let valid = true;
  if (lengthRuleParams?.min > value.length) {
    valid = false;
  }
  if (lengthRuleParams?.max < value.length) {
    valid = false;
  }
  return valid;
};

export const validRegexMatchRule = (regexRule, value): boolean => {
  let valid = true;
  if (regexRule) {
    const regex = new RegExp(regexRule);
    return regex.test(value);
  }
  return valid;
};

export const validateInitConfig = (initConfig: IConfig) => {
  if (!initConfig) {
    throw new SkyflowError(
      SKYFLOW_ERROR_CODE.SKYFLOW_INTIALIZING_MISSING,
      [],
      true
    );
  }
  if (!Object.prototype.hasOwnProperty.call(initConfig, 'vaultID')) {
    throw new SkyflowError(SKYFLOW_ERROR_CODE.VAULTID_IS_REQUIRED, [], true);
  }
  if (!initConfig.vaultID) {
    throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_VAULTID_IN_INIT, [], true);
  }
  if (!Object.prototype.hasOwnProperty.call(initConfig, 'vaultURL')) {
    throw new SkyflowError(SKYFLOW_ERROR_CODE.VAULTURL_IS_REQUIRED, [], true);
  }
  if (!initConfig.vaultURL) {
    throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_VAULTURL_IN_INIT, [], true);
  }
  if (initConfig.vaultURL && !isValidURL(initConfig.vaultURL)) {
    throw new SkyflowError(
      SKYFLOW_ERROR_CODE.INVALID_VAULTURL_IN_INIT,
      [],
      true
    );
  }
  if (!Object.prototype.hasOwnProperty.call(initConfig, 'getBearerToken')) {
    throw new SkyflowError(
      SKYFLOW_ERROR_CODE.GET_BEARER_TOKEN_IS_REQUIRED,
      [],
      true
    );
  }
};

export const validateAdditionalFieldsInCollect = (
  recordObj: IInsertRecordInput
) => {
  if (
    !(recordObj && Object.prototype.hasOwnProperty.call(recordObj, 'records'))
  ) {
    throw new SkyflowError(
      SKYFLOW_ERROR_CODE.RECORDS_KEY_NOT_FOUND_IN_ADDITIONAL_FIELDS,
      [],
      true
    );
  }
  const { records } = recordObj;
  if (!(records && Array.isArray(records))) {
    throw new SkyflowError(
      SKYFLOW_ERROR_CODE.INVALID_RECORDS_IN_ADDITIONAL_FIELDS,
      [],
      true
    );
  }
  if (records.length === 0) {
    throw new SkyflowError(
      SKYFLOW_ERROR_CODE.EMPTY_RECORDS_IN_ADDITIONAL_FIELDS,
      [],
      true
    );
  }
  records.forEach((record: any, index: number) => {
    if (!(record && Object.prototype.hasOwnProperty.call(record, 'table'))) {
      throw new SkyflowError(
        SKYFLOW_ERROR_CODE.MISSING_TABLE_IN_ADDITIONAL_FIELDS,
        [`${index}`],
        true
      );
    }
    if (!record.table) {
      throw new SkyflowError(
        SKYFLOW_ERROR_CODE.EMPTY_TABLE_IN_ADDITIONAL_FIELDS,
        [`${index}`],
        true
      );
    }
    if (record.fields?.skyflowID !== undefined) {
      if (!record.fields?.skyflowID) {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_SKYFLOW_ID_IN_ADDITIONAL_FIELDS, [`${index}`], true);
      }
      if (!(typeof record.fields?.skyflowID === 'string' || record.fields?.skyflowID instanceof String)) {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_SKYFLOW_ID_IN_ADDITIONAL_FIELDS, [`${index}`], true);
      }
    }
    if (!(typeof record.table === 'string' || record.table instanceof String)) {
      throw new SkyflowError(
        SKYFLOW_ERROR_CODE.INVALID_TABLE_IN_ADDITIONAL_FIELDS,
        [`${index}`],
        true
      );
    }
    if (!Object.prototype.hasOwnProperty.call(record, 'fields')) {
      throw new SkyflowError(
        SKYFLOW_ERROR_CODE.MISSING_FIELDS_IN_ADDITIONAL_FIELDS,
        [`${index}`],
        true
      );
    }
    if (!record.fields) {
      throw new SkyflowError(
        SKYFLOW_ERROR_CODE.EMPTY_FIELDS_IN_ADDITIONAL_FIELDS,
        [`${index}`],
        true
      );
    }
    if (!(typeof record.fields === 'object' && !Array.isArray(record.fields))) {
      throw new SkyflowError(
        SKYFLOW_ERROR_CODE.INVALID_FIELDS_IN_ADDITIONAL_FIELDS,
        [`${index}`],
        true
      );
    }
  });
};

export const validateRevealElementRecords = (records: RevealElementInput[]) => {
  if (records.length === 0)
    throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_RECORDS_REVEAL);
  records.forEach((record: any) => {
    if (!(record && Object.prototype.hasOwnProperty.call(record, 'token'))) {
      throw new SkyflowError(SKYFLOW_ERROR_CODE.MISSING_TOKEN_KEY_REVEAL);
    }
    if (!record.token) {
      throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_TOKEN_ID_REVEAL);
    }
    if (!(typeof record.token === 'string' || record.token instanceof String)) {
      throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_TOKEN_ID_REVEAL);
    }

    if (
      Object.prototype.hasOwnProperty.call(record, 'label') &&
      typeof record.label !== 'string'
    ) {
      throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_LABEL_REVEAL);
    }

    if (
      Object.prototype.hasOwnProperty.call(record, 'altText') &&
      typeof record.altText !== 'string'
    ) {
      throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_ALT_TEXT_REVEAL);
    }

    if (Object.prototype.hasOwnProperty.call(record, 'redaction')) {
      if (record.redaction && typeof record.redaction !== 'string') {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_REDACTION_VALUE);
      }
      if (
        !Object.values(RedactionType).includes(
          record.redaction as RedactionType
        )
      ) {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_REDACTION_TYPE);
      }
    }
  });
};

export const validateUpsertOptions = (upsertOptions) => {
  if (!(upsertOptions && Array.isArray(upsertOptions)))
    throw new SkyflowError(
      SKYFLOW_ERROR_CODE.INVALID_UPSERT_OPTION_TYPE,
      [],
      true
    );

  if (!upsertOptions.length)
    throw new SkyflowError(
      SKYFLOW_ERROR_CODE.EMPTY_UPSERT_OPTIONS_ARRAY,
      [],
      true
    );

  upsertOptions.forEach((upsertOption, index: number) => {
    if (!(upsertOption && typeof upsertOption === 'object')) {
      throw new SkyflowError(
        SKYFLOW_ERROR_CODE.INVALID_UPSERT_OPTION_OBJECT_TYPE,
        [index],
        true
      );
    }

    if (!Object.prototype.hasOwnProperty.call(upsertOption, 'table')) {
      throw new SkyflowError(
        SKYFLOW_ERROR_CODE.MISSING_TABLE_IN_UPSERT_OPTION,
        [index],
        true
      );
    }

    if (
      !(
        upsertOption.table &&
        typeof upsertOption.table === 'string' &&
        upsertOption.table.length
      )
    ) {
      throw new SkyflowError(
        SKYFLOW_ERROR_CODE.INVALID_TABLE_IN_UPSERT_OPTION,
        [index],
        true
      );
    }
    if (!Object.prototype.hasOwnProperty.call(upsertOption, 'column')) {
      throw new SkyflowError(
        SKYFLOW_ERROR_CODE.MISSING_COLUMN_IN_UPSERT_OPTION,
        [index],
        true
      );
    }

    if (
      !(
        upsertOption.column &&
        typeof upsertOption.column === 'string' &&
        upsertOption.column.length
      )
    ) {
      throw new SkyflowError(
        SKYFLOW_ERROR_CODE.INVALID_COLUMN_IN_UPSERT_OPTION,
        [index],
        true
      );
    }
  });
};

export const validateComposableContainerOptions = (options) => {
  if (!options) {
    throw new SkyflowError(
      SKYFLOW_ERROR_CODE.MISSING_COMPOSABLE_CONTAINER_OPTIONS,
      [],
      true
    );
  }
  if (typeof options !== 'object') {
    throw new SkyflowError(
      SKYFLOW_ERROR_CODE.INVALID_COMPOSABLE_CONTAINER_OPTIONS,
      [],
      true
    );
  }

  if (!Object.prototype.hasOwnProperty.call(options, 'layout')) {
    throw new SkyflowError(
      SKYFLOW_ERROR_CODE.MISSING_COMPOSABLE_LAYOUT_KEY,
      [],
      true
    );
  }

  if (!options.layout) {
    throw new SkyflowError(
      SKYFLOW_ERROR_CODE.INVALID_COMPOSABLE_LAYOUT_TYPE,
      [],
      true
    );
  }

  if (!Array.isArray(options.layout)) {
    throw new SkyflowError(
      SKYFLOW_ERROR_CODE.INVALID_COMPOSABLE_LAYOUT_TYPE,
      [],
      true
    );
  }
  if (options.layout.length === 0) {
    throw new SkyflowError(
      SKYFLOW_ERROR_CODE.EMPTY_COMPOSABLE_LAYOUT_ARRAY,
      [],
      true
    );
  }

  options.layout.forEach((row) => {
    if (typeof row !== 'number') {
      throw new SkyflowError(
        SKYFLOW_ERROR_CODE.INVALID_COMPOSABLE_LAYOUT_TYPE,
        [],
        true
      );
    }
    if (row < 0) {
      throw new SkyflowError(
        SKYFLOW_ERROR_CODE.NEGATIVE_VALUES_COMPOSABLE_LAYOUT,
        [],
        true
      );
    }
  });
};

export const validateGetInput = (
  getInput: IGetInput,
  options?: IGetOptions
) => {
  if (
    !(getInput && Object.prototype.hasOwnProperty.call(getInput, 'records'))
  ) {
    throw new SkyflowError(SKYFLOW_ERROR_CODE.RECORDS_KEY_NOT_FOUND_GET);
  }
  const { records } = getInput;
  if (!(records && Array.isArray(records))) {
    throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_RECORDS_IN_GET, []);
  }
  if (records.length === 0) {
    throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_RECORDS_GET);
  }
  if (
    options &&
    Object.prototype.hasOwnProperty.call(options, 'tokens') &&
    typeof options?.tokens !== 'boolean'
  ) {
    throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_TOKENS_IN_GET);
  }

  records.forEach((record: any, index: number) => {
    if (Object.keys(record).length === 0) {
      throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_RECORDS_GET);
    }
    if (record.ids?.length === 0) {
      throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_IDS_IN_GET, [`${index}`]);
    }
    if (record.ids != null && !(record.ids && Array.isArray(record.ids))) {
      throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_IDS_IN_GET, [
        `${index}`,
      ]);
    }
    record.ids?.forEach((skyflowId) => {
      if (!skyflowId) {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_SKYFLOWID_IN_GET, [
          `${index}`,
        ]);
      }
      if (!(typeof skyflowId === 'string' || skyflowId instanceof String)) {
        throw new SkyflowError(
          SKYFLOW_ERROR_CODE.INVALID_SKYFLOWID_TYPE_IN_GET,
          [`${index}`]
        );
      }
    });
    if (!Object.prototype.hasOwnProperty.call(record, 'table')) {
      throw new SkyflowError(SKYFLOW_ERROR_CODE.MISSING_TABLE_IN_GET, [
        `${index}`,
      ]);
    }
    if (!record.table) {
      throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_TABLE_IN_GET, [
        `${index}`,
      ]);
    }
    if (!(typeof record.table === 'string' || record.table instanceof String)) {
      throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_TABLE_IN_GET, [
        `${index}`,
      ]);
    }

    if (
      !(
        options &&
        Object.prototype.hasOwnProperty.call(options, 'tokens') &&
        options?.tokens === true
      )
    ) {
      if (!Object.prototype.hasOwnProperty.call(record, 'redaction')) {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.MISSING_REDACTION_IN_GET, [
          `${index}`,
        ]);
      }
      const recordRedaction = record.redaction;
      if (!recordRedaction) {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_REDACTION_TYPE_IN_GET, [
          `${index}`,
        ]);
      }
      if (!Object.values(RedactionType).includes(record.redaction)) {
        throw new SkyflowError(
          SKYFLOW_ERROR_CODE.INVALID_REDACTION_TYPE_IN_GET,
          [`${index}`]
        );
      }
    }

    if (
      Object.prototype.hasOwnProperty.call(record, 'ids') === true &&
      Object.prototype.hasOwnProperty.call(record, 'columnName') === true
    ) {
      throw new SkyflowError(
        SKYFLOW_ERROR_CODE.SKYFLOW_IDS_AND_COLUMN_NAME_BOTH_SPECIFIED,
        [`${index}`]
      );
    }
    if (!Object.prototype.hasOwnProperty.call(record, 'columnName')) {
      if (
        Object.prototype.hasOwnProperty.call(record, 'ids') === false &&
        Object.prototype.hasOwnProperty.call(record, 'columnValues') === false
      ) {
        throw new SkyflowError(
          SKYFLOW_ERROR_CODE.MISSING_IDS_OR_COLUMN_VALUES_IN_GET,
          [`${index}`]
        );
      }
    } else if (
      !(
        Object.prototype.hasOwnProperty.call(record, 'columnName') &&
        Object.prototype.hasOwnProperty.call(record, 'columnValues')
      )
    ) {
      throw new SkyflowError(SKYFLOW_ERROR_CODE.MISSING_RECORD_COLUMN_VALUE, [
        `${index}`,
      ]);
    }
    if (record.columnValues?.length === 0) {
      throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_RECORD_COLUMN_VALUES, [
        `${index}`,
      ]);
    }
    if (
      record.columnValues != null &&
      !(record.columnValues && Array.isArray(record.columnValues))
    ) {
      throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_COLUMN_VALUES_IN_GET, [
        `${index}`,
      ]);
    }
    if (record.columnName !== undefined && record.columnValues === undefined) {
      throw new SkyflowError(SKYFLOW_ERROR_CODE.MISSING_RECORD_COLUMN_VALUE, [
        `${index}`,
      ]);
    }
    if (record.columnName === undefined && record.columnValues !== undefined) {
      throw new SkyflowError(SKYFLOW_ERROR_CODE.MISSING_RECORD_COLUMN_NAME, [
        `${index}`,
      ]);
    }

    const columnName = record.columnName;
    if (columnName != null && typeof columnName !== 'string') {
      throw new SkyflowError(
        SKYFLOW_ERROR_CODE.INVALID_RECORD_COLUMN_NAME_TYPE,
        [`${index}`]
      );
    }
    const columnValues = record.columnValues;
    if (columnValues != null) {
      columnValues.forEach((eachColumnValue) => {
        if (eachColumnValue === '' || eachColumnValue === null)
          throw new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_COLUMN_VALUE, [
            `${index}`,
          ]);
        if (typeof eachColumnValue !== 'string')
          throw new SkyflowError(
            SKYFLOW_ERROR_CODE.INVALID_RECORD_COLUMN_VALUE_TYPE,
            [`${index}`]
          );
      });
    }

    if (
      options &&
      Object.prototype.hasOwnProperty.call(options, 'tokens') &&
      options?.tokens === true
    ) {
      if (columnName || columnValues) {
        throw new SkyflowError(
          SKYFLOW_ERROR_CODE.TOKENS_GET_COLUMN_NOT_SUPPORTED
        );
      }
      if (record.redaction) {
        throw new SkyflowError(
          SKYFLOW_ERROR_CODE.REDACTION_WITH_TOKENS_NOT_SUPPORTED
        );
      }
    }
  });
};

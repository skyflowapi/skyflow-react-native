/*
 Copyright (c) 2022 Skyflow, Inc.
*/
import logs from '../logs';

const SKYFLOW_ERROR_CODE = {
  VAULTID_IS_REQUIRED: {
    code: 400,
    description: logs.errorLogs.VAULTID_IS_REQUIRED,
  },
  EMPTY_VAULTID_IN_INIT: {
    code: 400,
    description: logs.errorLogs.EMPTY_VAULTID_IN_INIT,
  },
  VAULTURL_IS_REQUIRED: {
    code: 400,
    description: logs.errorLogs.VAULTURL_IS_REQUIRED,
  },
  EMPTY_VAULTURL_IN_INIT: {
    code: 400,
    description: logs.errorLogs.EMPTY_VAULTURL_IN_INIT,
  },
  INVALID_VAULTURL_IN_INIT: {
    code: 400,
    description: logs.errorLogs.INVALID_VAULTURL_IN_INIT,
  },
  GET_BEARER_TOKEN_IS_REQUIRED: {
    code: 400,
    description: logs.errorLogs.GET_BEARER_TOKEN_IS_REQUIRED,
  },
  GET_BEARER_TOKEN_INVALID_RETURN: {
    code: 400,
    description: logs.errorLogs.GET_BEARER_TOKEN_INVALID_RETURN,
  },
  ELEMENTS_NOT_MOUNTED: {
    code: 400,
    description: logs.errorLogs.ELEMENTS_NOT_MOUNTED,
  },
  MISSING_TABLE_IN_COLLECT: {
    code: 400,
    description: logs.errorLogs.MISSING_TABLE_IN_COLLECT,
  },
  EMPTY_TABLE_IN_COLLECT: {
    code: 400,
    description: logs.errorLogs.EMPTY_TABLE_IN_COLLECT,
  },
  INVALID_TABLE_IN_COLLECT: {
    code: 400,
    description: logs.errorLogs.INVALID_TABLE_IN_COLLECT,
  },
  MISSING_COLUMN_IN_COLLECT: {
    code: 400,
    description: logs.errorLogs.MISSING_COLUMN_IN_COLLECT,
  },
  EMPTY_COLUMN_IN_COLLECT: {
    code: 400,
    description: logs.errorLogs.EMPTY_TABLE_IN_COLLECT,
  },
  INVALID_COLUMN_IN_COLLECT: {
    code: 400,
    description: logs.errorLogs.INVALID_COLUMN_IN_COLLECT,
  },
  RECORDS_KEY_NOT_FOUND: {
    code: 404,
    description: logs.errorLogs.RECORDS_KEY_NOT_FOUND,
  },
  EMPTY_RECORDS_IN_INSERT: {
    code: 400,
    description: logs.errorLogs.EMPTY_RECORDS_IN_INSERT,
  },
  INVALID_RECORDS_IN_INSERT: {
    code: 404,
    description: logs.errorLogs.INVALID_RECORDS_IN_INSERT,
  },
  INVALID_TABLE_IN_INSERT: {
    code: 400,
    description: logs.errorLogs.INVALID_TABLE_IN_INSERT,
  },
  EMPTY_TABLE_IN_INSERT: {
    code: 400,
    description: logs.errorLogs.EMPTY_TABLE_IN_INSERT,
  },
  MISSING_TABLE_IN_INSERT: {
    code: 400,
    description: logs.errorLogs.MISSING_TABLE_IN_INSERT,
  },
  EMPTY_FIELDS_IN_INSERT: {
    code: 400,
    description: logs.errorLogs.EMPTY_FIELDS_IN_INSERT,
  },
  MISSING_FIELDS_IN_INSERT: {
    code: 404,
    description: logs.errorLogs.MISSING_FIELDS_IN_INSERT,
  },
  INVALID_FIELDS_IN_INSERT: {
    code: 404,
    description: logs.errorLogs.INVALID_FIELDS_IN_INSERT,
  },
  INVALID_TOKENS_IN_INSERT: {
    code: 404,
    description: logs.errorLogs.INVALID_TOKENS_IN_INSERT,
  },
  INVALID_TOKENS_IN_COLLECT: {
    code: 404,
    description: logs.errorLogs.INVALID_TOKENS_IN_COLLECT,
  },
  RECORDS_KEY_NOT_FOUND_IN_ADDITIONAL_FIELDS: {
    code: 404,
    description: logs.errorLogs.RECORDS_KEY_NOT_FOUND_IN_ADDITIONAL_FIELDS,
  },
  INVALID_RECORDS_IN_ADDITIONAL_FIELDS: {
    code: 404,
    description: logs.errorLogs.INVALID_RECORDS_IN_ADDITIONAL_FIELDS,
  },
  EMPTY_RECORDS_IN_ADDITIONAL_FIELDS: {
    code: 400,
    description: logs.errorLogs.EMPTY_RECORDS_IN_ADDITIONAL_FIELDS,
  },
  MISSING_TABLE_IN_ADDITIONAL_FIELDS: {
    code: 400,
    description: logs.errorLogs.MISSING_TABLE_IN_ADDITIONAL_FIELDS,
  },
  INVALID_TABLE_IN_ADDITIONAL_FIELDS: {
    code: 400,
    description: logs.errorLogs.INVALID_TABLE_IN_ADDITIONAL_FIELDS,
  },
  MISSING_FIELDS_IN_ADDITIONAL_FIELDS: {
    code: 400,
    description: logs.errorLogs.MISSING_FIELDS_IN_ADDITIONAL_FIELDS,
  },
  INVALID_FIELDS_IN_ADDITIONAL_FIELDS: {
    code: 400,
    description: logs.errorLogs.INVALID_FIELDS_IN_ADDITIONAL_FIELDS,
  },
  EMPTY_RECORDS_REVEAL: {
    code: 400,
    description: logs.errorLogs.EMPTY_RECORDS_REVEAL,
  },
  MISSING_TOKEN_KEY_REVEAL: {
    code: 400,
    description: logs.errorLogs.MISSING_TOKEN_KEY_REVEAL,
  },
  INVALID_TOKEN_ID_REVEAL: {
    code: 400,
    description: logs.errorLogs.INVALID_TOKEN_ID_REVEAL,
  },
  INVALID_LABEL_REVEAL: {
    code: 400,
    description: logs.errorLogs.INVALID_LABEL_REVEAL,
  },
  INVALID_ALT_TEXT_REVEAL: {
    code: 400,
    description: logs.errorLogs.INVALID_ALT_TEXT_REVEAL,
  },
  EMPTY_TABLE_IN_ADDITIONAL_FIELDS: {
    code: 400,
    description: logs.errorLogs.EMPTY_TABLE_IN_ADDITIONAL_FIELDS,
  },
  EMPTY_FIELDS_IN_ADDITIONAL_FIELDS: {
    code: 400,
    description: logs.errorLogs.EMPTY_FIELDS_IN_ADDITIONAL_FIELDS,
  },
  EMPTY_TOKEN_ID_REVEAL: {
    code: 400,
    description: logs.errorLogs.EMPTY_TOKEN_ID_REVEAL,
  },
  DUPLICATE_ELEMENT: {
    code: 400,
    description: logs.errorLogs.DUPLICATE_ELEMENT,
  },
  DUPLICATE_ELEMENT_ADDITIONAL_FIELDS: {
    code: 400,
    description: logs.errorLogs.DUPLICATE_ELEMENT_ADDITIONAL_FIELDS,
  },
  COMPLETE_AND_VALID_INPUTS: {
    code: 400,
    description: logs.errorLogs.COMPLETE_AND_VALID_INPUTS,
  },
  NETWORK_ERROR: { code: 500, description: logs.errorLogs.NETWORK_ERROR },
  CONNECTION_ERROR: { code: 400, description: logs.errorLogs.CONNECTION_ERROR },
  EMPTY_COLLECT_ELEMENTS: {
    code: 400,
    description: logs.errorLogs.EMPTY_COLLECT_ELEMENTS,
  },
  SKYFLOW_INTIALIZING_MISSING: {
    code: 400,
    description: logs.errorLogs.SKYFLOW_INTIALIZING_MISSING,
  },
  CONTAINER_OBJECT_IS_REQUIRED: {
    code: 400,
    description: logs.errorLogs.CONTAINER_OBJECT_IS_REQUIRED,
  },
  INVALID_UPSERT_OPTION_TYPE: {
    code: 400,
    description: logs.errorLogs.INVALID_UPSERT_OPTION_TYPE,
  },
  EMPTY_UPSERT_OPTIONS_ARRAY: {
    code: 400,
    description: logs.errorLogs.EMPTY_UPSERT_OPTIONS_ARRAY,
  },
  INVALID_UPSERT_OPTION_OBJECT_TYPE: {
    code: 400,
    description: logs.errorLogs.INVALID_UPSERT_OPTION_OBJECT_TYPE,
  },
  MISSING_TABLE_IN_UPSERT_OPTION: {
    code: 400,
    description: logs.errorLogs.MISSING_TABLE_IN_UPSERT_OPTION,
  },
  MISSING_COLUMN_IN_UPSERT_OPTION: {
    code: 400,
    description: logs.errorLogs.MISSING_COLUMN_IN_UPSERT_OPTION,
  },
  INVALID_TABLE_IN_UPSERT_OPTION: {
    code: 400,
    description: logs.errorLogs.INVALID_TABLE_IN_UPSERT_OPTION,
  },
  INVALID_COLUMN_IN_UPSERT_OPTION: {
    code: 400,
    description: logs.errorLogs.INVALID_COLUMN_IN_UPSERT_OPTION,
  },
  INVALID_REDACTION_VALUE: {
    code: 400,
    description: logs.errorLogs.INVALID_REDACTION_VALUE,
  },
  INVALID_REDACTION_TYPE: {
    code: 400,
    description: logs.errorLogs.INVALID_REDACTION_TYPE,
  },
};

export default SKYFLOW_ERROR_CODE;

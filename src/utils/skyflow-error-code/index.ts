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
  MISSING_COMPOSABLE_LAYOUT_KEY: {
    code: 400,
    description: logs.errorLogs.MISSING_COMPOSABLE_LAYOUT_KEY,
  },
  EMPTY_COMPOSABLE_LAYOUT_ARRAY: {
    code: 400,
    description: logs.errorLogs.EMPTY_COMPOSABLE_LAYOUT_ARRAY,
  },
  INVALID_COMPOSABLE_LAYOUT_TYPE: {
    code: 400,
    description: logs.errorLogs.INVALID_COMPOSABLE_LAYOUT_TYPE,
  },
  NEGATIVE_VALUES_COMPOSABLE_LAYOUT: {
    code: 400,
    description: logs.errorLogs.NEGATIVE_VALUES_COMPOSABLE_LAYOUT,
  },
  MISMATCH_ELEMENT_COUNT_LAYOUT_SUM: {
    code: 400,
    description: logs.errorLogs.MISMATCH_ELEMENT_COUNT_LAYOUT_SUM,
  },
  MISSING_COMPOSABLE_CONTAINER_OPTIONS: {
    code: 400,
    description: logs.errorLogs.MISSING_COMPOSABLE_CONTAINER_OPTIONS,
  },
  INVALID_COMPOSABLE_CONTAINER_OPTIONS: {
    code: 400,
    description: logs.errorLogs.INVALID_COMPOSABLE_CONTAINER_OPTIONS,
  },
  INVALID_TOKENS_IN_GET: {
    code: 400,
    description: logs.errorLogs.INVALID_TOKENS_IN_GET,
  },
  RECORDS_KEY_NOT_FOUND_GET: {
    code: 400,
    description: logs.errorLogs.RECORDS_KEY_NOT_FOUND_GET,
  },
  INVALID_RECORDS_IN_GET: {
    code: 400,
    description: logs.errorLogs.INVALID_RECORDS_IN_GET,
  },
  TOKENS_GET_COLUMN_NOT_SUPPORTED: {
    code: 400,
    description: logs.errorLogs.TOKENS_GET_COLUMN_NOT_SUPPORTED,
  },
  REDACTION_WITH_TOKENS_NOT_SUPPORTED: {
    code: 400,
    description: logs.errorLogs.REDACTION_WITH_TOKENS_NOT_SUPPORTED,
  },
  EMPTY_RECORDS_GET: {
    code: 400,
    description: logs.errorLogs.EMPTY_RECORDS_GET,
  },
  EMPTY_IDS_IN_GET: {
    code: 400,
    description: logs.errorLogs.EMPTY_IDS_IN_GET,
  },
  INVALID_IDS_IN_GET: {
    code: 400,
    description: logs.errorLogs.INVALID_IDS_IN_GET,
  },
  EMPTY_SKYFLOWID_IN_GET: {
    code: 400,
    description: logs.errorLogs.EMPTY_SKYFLOWID_IN_GET,
  },
  INVALID_SKYFLOWID_TYPE_IN_GET: {
    code: 400,
    description: logs.errorLogs.INVALID_SKYFLOWID_TYPE_IN_GET,
  },
  MISSING_TABLE_IN_GET: {
    code: 400,
    description: logs.errorLogs.MISSING_TABLE_IN_GET,
  },
  EMPTY_TABLE_IN_GET: {
    code: 400,
    description: logs.errorLogs.EMPTY_TABLE_IN_GET,
  },
  INVALID_TABLE_IN_GET: {
    code: 400,
    description: logs.errorLogs.INVALID_TABLE_IN_GET,
  },
  MISSING_REDACTION_IN_GET: {
    code: 400,
    description: logs.errorLogs.MISSING_REDACTION_IN_GET,
  },
  EMPTY_REDACTION_TYPE_IN_GET: {
    code: 400,
    description: logs.errorLogs.EMPTY_REDACTION_TYPE_IN_GET,
  },
  INVALID_REDACTION_TYPE_IN_GET: {
    code: 400,
    description: logs.errorLogs.INVALID_REDACTION_TYPE_IN_GET,
  },
  SKYFLOW_IDS_AND_COLUMN_NAME_BOTH_SPECIFIED: {
    code: 400,
    description: logs.errorLogs.SKYFLOW_IDS_AND_COLUMN_NAME_BOTH_SPECIFIED,
  },
  MISSING_IDS_OR_COLUMN_VALUES_IN_GET: {
    code: 400,
    description: logs.errorLogs.MISSING_IDS_OR_COLUMN_VALUES_IN_GET,
  },
  MISSING_RECORD_COLUMN_VALUE: {
    code: 400,
    description: logs.errorLogs.MISSING_RECORD_COLUMN_VALUE,
  },
  EMPTY_RECORD_COLUMN_VALUES: {
    code: 400,
    description: logs.errorLogs.EMPTY_RECORD_COLUMN_VALUES,
  },
  INVALID_COLUMN_VALUES_IN_GET: {
    code: 400,
    description: logs.errorLogs.INVALID_COLUMN_VALUES_IN_GET,
  },
  MISSING_RECORD_COLUMN_NAME: {
    code: 400,
    description: logs.errorLogs.MISSING_RECORD_COLUMN_NAME,
  },
  INVALID_RECORD_COLUMN_VALUE: {
    code: 400,
    description: logs.errorLogs.INVALID_RECORD_COLUMN_VALUE,
  },
  EMPTY_COLUMN_VALUE: {
    code: 400,
    description: logs.errorLogs.EMPTY_COLUMN_VALUE,
  },
  INVALID_RECORD_COLUMN_VALUE_TYPE: {
    code: 400,
    description: logs.errorLogs.INVALID_RECORD_COLUMN_VALUE_TYPE,
  },
  INVALID_RECORD_COLUMN_NAME_TYPE: {
    code: 400,
    description: logs.errorLogs.INVALID_RECORD_COLUMN_NAME_TYPE,
  },
  EMPTY_SKYFLOW_ID_IN_ADDITIONAL_FIELDS: {
    code: 400,
    description: logs.errorLogs.EMPTY_SKYFLOW_ID_IN_ADDITIONAL_FIELDS,
  },
  EMPTY_SKYFLOW_ID_COLLECT: {
    code: 400,
    description: logs.errorLogs.EMPTY_SKYFLOW_ID_COLLECT,
  },
  INVALID_SKYFLOW_ID_IN_ADDITIONAL_FIELDS: {
    code: 400,
    description: logs.errorLogs.INVALID_SKYFLOW_ID_IN_ADDITIONAL_FIELDS,
  },
};

export default SKYFLOW_ERROR_CODE;

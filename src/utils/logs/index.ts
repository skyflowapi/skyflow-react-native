/*
 Copyright (c) 2022 Skyflow, Inc.
*/
const logs = {
  infoLogs: {
    COLLECT_SUBMIT_SUCCESS: '%s1 - Data has been collected successfully.',
    REVEAL_SUBMIT_SUCCESS: '%s1 - Data has been revealed successfully.',
    BEARER_TOKEN_RESOLVED:
      '%s1 - GetBearerToken promise resolved successfully.',
    REUSE_BEARER_TOKEN: '%s1 - Reusing the bearer token.',
    COLLECT_CONTAINER_CREATED: '%s1 - Created Collect container successfully.',
    CREATED_ELEMENT: '%s1 - Created %s2 element.',
    COLLECT_METHOD_INVOKED: 'Invoked collect method.',
    REVEAL_METHOD_INVOKED: 'Invoked reveal method.',
    CURRENT_ENV: '%s1 - Client Env is %s2',
    CURRENT_LOG_LEVEL: '%s1 - Client LogLevel is %s2',
    EMIT_PURE_JS_REQUEST: '%s1 - Emitted %s2 request.',
    GET_TRIGGERED: 'get method triggered.',
    VALIDATE_GET_INPUT: '%s1 - Validating get input.',
    GET_RESOLVED: 'Interface: client get - get request is resolved.',
  },
  errorLogs: {
    CLIENT_CONNECTION:
      'Interface: collect container - client connection not established. client info has not reached iframes',
    INVALID_BEARER_TOKEN:
      'Interface: skyflow provider - Invalid token is generated from getBearerToken callback',
    BEARER_TOKEN_REJECTED:
      'Interface: skyflow provider - GetBearerToken promise got rejected.',
    VAULTID_IS_REQUIRED:
      'Interface: skyflow provider - Invalid client credentials. vaultID is required.',
    EMPTY_VAULTID_IN_INIT:
      'Interface: skyflow provider - Invalid client credentials. vaultID cannot be empty.',
    VAULTURL_IS_REQUIRED:
      'Interface: skyflow provider - Invalid client credentials. vaultURL is required.',
    EMPTY_VAULTURL_IN_INIT:
      'Interface: skyflow provider - Invalid client credentials. vaultURL cannot be empty.',
    INVALID_VAULTURL_IN_INIT:
      'Interface: skyflow provider - Invalid client credentials. Expecting https://XYZ for vaultURL',
    GET_BEARER_TOKEN_IS_REQUIRED:
      'Interface: skyflow provider - Invalid client credentials. getBearerToken is required.',
    GET_BEARER_TOKEN_INVALID_RETURN:
      'Interface: skyflow provider - Invalid client credentails. getBearerToken should be function returning a promise',
    EMPTY_CONTAINER_TYPE:
      'Interface: client {containerType} container - Invalid container type. Container object cannot be empty.',
    INVALID_CONTAINER_TYPE:
      'Interface: client  {containerType}  container - Invalid container type. Invalid container object.',

    INVALID_COLLECT_VALUE: 'Invalid value',
    INVALID_COLLECT_VALUE_WITH_LABEL: 'Invalid %s1',

    RECORDS_KEY_NOT_FOUND:
      'Interface: client insert - records object is required.',
    INVALID_RECORDS_IN_INSERT:
      'Interface: client insert - Invalid records. records object should be an array.',
    EMPTY_RECORDS_IN_INSERT:
      'Interface: client insert - records array cannot be empty.',
    MISSING_TABLE_IN_INSERT:
      'Interface: client insert - "table" key is required in records array at index %s1',
    EMPTY_TABLE_IN_INSERT:
      'Interface: client insert - table cannot be empty in records array at index %s1',
    INVALID_TABLE_IN_INSERT:
      'Interface: client insert - table of type string is required at index %s1 in records array.',
    EMPTY_FIELDS_IN_INSERT:
      'Interface: client insert - fields cannot be empty in records array at index %s1',
    MISSING_FIELDS_IN_INSERT:
      'Interface: client insert - "fields" key is required in records array at index %s1',
    INVALID_FIELDS_IN_INSERT:
      'Interface: client insert - fields of type object is required at index %s1 in records array.',
    INVALID_TOKENS_IN_INSERT:
      'Interface: client insert - Invalid tokens in options. tokens of type boolean is required.',
    INVALID_TOKENS_IN_COLLECT:
      'Interface: collect container - Invalid tokens. tokens of type boolean is required.',
    RECORDS_KEY_NOT_FOUND_IN_ADDITIONAL_FIELDS:
      'Interface: collect container - "records" key not found in additionalFields',
    INVALID_RECORDS_IN_ADDITIONAL_FIELDS:
      'Interface: collect container - records should be an array inside additionalFields',
    EMPTY_RECORDS_IN_ADDITIONAL_FIELDS:
      'Interface: collect container - records object cannot be empty in additionalFields',
    MISSING_TABLE_IN_ADDITIONAL_FIELDS:
      'Interface: collect container - "table" key not found in additionalFields records at index %s1',
    INVALID_TABLE_IN_ADDITIONAL_FIELDS:
      'Interface: collect container - Provide valid table name in additionalFields records at index %s1',
    MISSING_FIELDS_IN_ADDITIONAL_FIELDS:
      'Interface: collect container - "fields" key not found in additionalFields records at index %s1',
    INVALID_FIELDS_IN_ADDITIONAL_FIELDS:
      'Interface: collect container - Provide valid fields in additionalFields records at index %s1',
    EMPTY_RECORDS_REVEAL:
      'Interface: reveal container - cannot invoke reveal method before creating reveal elements',
    MISSING_TOKEN_KEY_REVEAL:
      'Interface: RevealElement - token key is required ',
    INVALID_TOKEN_ID_REVEAL:
      'Interface: RevealElement - token is invalid. token of type string is required',
    INVALID_LABEL_REVEAL: 'Interface: RevealElement - label is invalid.',
    INVALID_ALT_TEXT_REVEAL: 'Interface: RevealElement - Invalid altText.',
    ELEMENTS_NOT_MOUNTED_REVEAL:
      'Interface: reveal container - Cannot invoke reveal before mounting the elements',
    EMPTY_TABLE_IN_ADDITIONAL_FIELDS:
      'Interface: collect container - table cannot be empty in additionalFields at index %s1',
    EMPTY_FIELDS_IN_ADDITIONAL_FIELDS:
      'Interface: collect container - fields cannot be empty in additionalFields at index %s1',
    EMPTY_TOKEN_ID_REVEAL: 'Interface: RevealElement - token cannot be empty',
    FAILED_REVEAL: 'Interface: reveal conatiner - Failed to reveal data',
    MISSING_TABLE_IN_COLLECT:
      'Interface: collect element - "table" key is required.',
    EMPTY_TABLE_IN_COLLECT:
      'Interface: collect element - table cannot be empty.',
    INVALID_TABLE_IN_COLLECT:
      'Interface: collect element - Invalid table. table of type string is required',
    MISSING_COLUMN_IN_COLLECT:
      'Interface: collect element - "column" key is required.',
    EMPTY_COLUMN_IN_COLLECT:
      'Interface: collect element - column cannot be empty.',
    INVALID_COLUMN_IN_COLLECT:
      'Interface: collect element - Invalid column. column of type string is required',
    ELEMENTS_NOT_MOUNTED:
      'Interface: collect container - Elements should be mounted before invoking collect',
    DUPLICATE_ELEMENT:
      'Interface: collect container - Duplicate column %s1 found in %s2.',
    DUPLICATE_ELEMENT_ADDITIONAL_FIELDS:
      'Interface: collect container - Duplicate column %s1 found in %s2 in additional fields',
    COMPLETE_AND_VALID_INPUTS:
      'Interface: collect container - Provide complete and valid inputs for %s1',
    UNKNOWN_ERROR: 'Unknown Error.',
    NETWORK_ERROR:
      'A network error occurred. This could be a CORS issue or a dropped internet connection. It is not possible for us to know. Please reach out to skyflow if you see this error',
    ERROR_OCCURED: 'Error occurred.',
    CONNECTION_ERROR: 'Error while initializing the connection.',
    EMPTY_COLLECT_ELEMENTS:
      'Interface: collect container - cannot invoke collect method before creating collects elements',
    SKYFLOW_INTIALIZING_MISSING:
      'Interface: SkyflowProvider - SkyflowProvider config is missing. ',
    CONTAINER_OBJECT_IS_REQUIRED:
      'Interface: %s1 Element - cannot create %s1 element without container object, create a container using %s2 hook.',
    INVALID_UPSERT_OPTION_TYPE:
      'Interface: collect container - Invalid upsert option, should be an array',
    EMPTY_UPSERT_OPTIONS_ARRAY:
      'Interface: collect container - upsert option cannot be an empty array, atleast one object of table and column is required.',
    INVALID_UPSERT_OPTION_OBJECT_TYPE:
      'Interface: collect container - Invalid upsert object at index %s1, an object of table and column is required.',
    MISSING_TABLE_IN_UPSERT_OPTION:
      'Interface: collect container - "table" key is required in upsert options object at index %s1',
    MISSING_COLUMN_IN_UPSERT_OPTION:
      'Interface: collect container - "column" key is required in upsert option at index %s1',
    INVALID_TABLE_IN_UPSERT_OPTION:
      'Interface: collect container - Invalid table in upsert object at index %s1, table of type non empty string is required',
    INVALID_COLUMN_IN_UPSERT_OPTION:
      'Interface: collect container - Invalid column in upsert object at index %s1, column of type non empty string is required',
    INVALID_REDACTION_VALUE:
      'Interface: reveal container - Invalid redaction value, redaction must be from RedactionType enum.',
    INVALID_REDACTION_TYPE:
      'Interface: reveal container - Invalid redaction type, redaction must be one of RedactionType enum value.',
    MISSING_COMPOSABLE_LAYOUT_KEY:
      'Interface: client container - layout is required in composable container options.',
    EMPTY_COMPOSABLE_LAYOUT_ARRAY:
      'Interface: client container - layout array cannot be empty in composable container options.',
    INVALID_COMPOSABLE_LAYOUT_TYPE:
      'Interface: client container - invalid layout value, layout should be of type array of numbers in composable container options.',
    NEGATIVE_VALUES_COMPOSABLE_LAYOUT:
      'Interface: client container - layout array should only have postive numbers in composable container options.',
    MISMATCH_ELEMENT_COUNT_LAYOUT_SUM:
      'Interface: composable container mount - created elements count should be equal to sum of layout values.',
    MISSING_COMPOSABLE_CONTAINER_OPTIONS:
      'Interface: client composable container - options object is required for composable container.',
    INVALID_COMPOSABLE_CONTAINER_OPTIONS:
      'Interface: client composable container - invalid options value, should be an object type.',
    RECORDS_KEY_NOT_FOUND_GET:
      'Interface: client get - records object is required.',
    INVALID_RECORDS_IN_GET:
      'Interface: client get - Invalid records. records object should be an array.',
    EMPTY_RECORDS_GET: 'Interface: client get - records array cannot be empty.',
    MISSING_IDS_IN_GET:
      'Interface: client get - "ids" key is required in records array at index %s1',
    INVALID_IDS_IN_GET:
      'Interface: client get - Invalid ids. ids object should be an array.',
    INVALID_COLUMN_VALUES_IN_GET:
      'Interface: client get - Invalid column values. column values object should be an array.',
    EMPTY_IDS_IN_GET:
      'Interface: client get - ids array cannot be empty at index %s1',
    INVALID_SKYFLOWID_TYPE_IN_GET:
      'Interface: client get - Invalid skyflowId in ids array at index %s1',
    MISSING_TABLE_IN_GET:
      'Interface: client get - "table" key is required in records array at index %s1',
    INVALID_TABLE_IN_GET:
      'Interface: client get - table of type string is required at index %s1 in records array.',
    MISSING_REDACTION_IN_GET:
      'Interface: client get - "redaction" key is required in records array at index %s1',
    INVALID_REDACTION_TYPE_IN_GET:
      'Interface: client get - Invalid redaction type in records array at index %s1',
    INVALID_TOKENS_IN_GET:
      'Interface: client get - Invalid tokens in options. tokens of type boolean is required.',
    TOKENS_GET_COLUMN_NOT_SUPPORTED:
      'Interface: client get - column_name or column_values cannot be used with tokens in options.',
    REDACTION_WITH_TOKENS_NOT_SUPPORTED:
      'Interface: client get - redaction cannot be used when tokens are true in options.',
    EMPTY_SKYFLOWID_IN_GET:
      'Interface: client get - id cannot be empty in records array at index %s1',
    EMPTY_TABLE_IN_GET:
      'Interface: client get - table cannot be empty in records array at index %s1',
    EMPTY_REDACTION_TYPE_IN_GET:
      'Interface: client get - redaction cannot be empty in records array at index %s1',
    INVALID_RECORD_COLUMN_VALUE: 'Invalid Record Column value.',
    MISSING_RECORD_COLUMN_VALUE:
      'Column Values is required when Column Name is specified.',
    MISSING_RECORD_COLUMN_NAME:
      'Column Name is required when Column Values are specified.',
    INVALID_RECORD_COLUMN_NAME_TYPE: 'Invalid Type of Records Column Name.',
    INVALID_RECORD_COLUMN_VALUE_TYPE: 'Invalid Type of Records Column Values.',
    INVALID_COLUMN_VALUES_TYPE:
      'Invalid column values type, should be an Array.',
    EMPTY_RECORD_COLUMN_VALUES: 'Record column values cannot be empty.',
    EMPTY_COLUMN_VALUE: 'Column Value is empty.',
    MISSING_IDS_OR_COLUMN_VALUES_IN_GET:
      'Interface: client get - "ids" key  or "columnValues" key is missing.',
    SKYFLOW_IDS_AND_COLUMN_NAME_BOTH_SPECIFIED:
      'ids and columnName can not be specified together.',
    GET_BY_SKYFLOWID_RESOLVED: '%s1 - GetById request is resolved.',
    GET_REJECTED: 'Interface: client get - get request is rejected.',
  },
  warnLogs: {
    INVALID_EXPIRATION_DATE_FORMAT:
      'EXPIRATION_DATE format must be in one of %s1, the format is set to default MM/YY',
    INVALID_EXPIRATION_YEAR_FORMAT:
      'EXPIRATION_YEAR format must be in one of %s1, the format is set to default YY',
  },
};

export default logs;

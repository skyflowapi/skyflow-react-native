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
  },
  warnLogs: {
    INVALID_EXPIRATION_DATE_FORMAT:
      'EXPIRATION_DATE format must be in one of %s1, the format is set to default MM/YY',
    INVALID_EXPIRATION_YEAR_FORMAT:
      'EXPIRATION_YEAR format must be in one of %s1, the format is set to default YY',
  },
};

export default logs;

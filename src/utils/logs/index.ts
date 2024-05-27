/*
 Copyright (c) 2022 Skyflow, Inc.
*/
import { SDK_NAME_VERSION } from "../../core/constants";

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
      `Skyflow ${SDK_NAME_VERSION} client connection not established. client info has not reached iframes`,
    INVALID_BEARER_TOKEN:
    `${SDK_NAME_VERSION} Token generated from 'getBearerToken' callback function is invalid. Make sure the implementation of 'getBearerToken' is correct.`,
    BEARER_TOKEN_REJECTED:
      `${SDK_NAME_VERSION} 'getBearerToken' callback function call failed with rejected promise. Make sure the implementation of 'getBearerToken' is correct.`,
    VAULTID_IS_REQUIRED:
      `Skyflow ${SDK_NAME_VERSION} initialization failed. Invalid client credentials - 'vaultID' is missing. Provide a valid vaultID.`,
    EMPTY_VAULTID_IN_INIT:
      `Skyflow ${SDK_NAME_VERSION} initialization failed. Invalid client credentials - 'vaultID' cannot be empty.  Provide a valid vaultID.`,
    VAULTURL_IS_REQUIRED:
      `Skyflow ${SDK_NAME_VERSION} initialization failed. Invalid client credentials - 'vaultURL' is required.  Provide a valid vaultURL.`,
    EMPTY_VAULTURL_IN_INIT:
      `Skyflow ${SDK_NAME_VERSION} initialization failed. Invalid client credentials - 'vaultURL' cannot be empty. Provide a valid vaultURL.`,
    INVALID_VAULTURL_IN_INIT:
      `Skyflow ${SDK_NAME_VERSION} initialization failed. Invalid client credentials - 'vaultURL' must be specified as 'https://XYZ'. Provide a valid vaultURL.`,
    GET_BEARER_TOKEN_IS_REQUIRED:
      `Skyflow ${SDK_NAME_VERSION} initialization failed. Invalid client credentials - 'getBearerToken' is required. Provide a valid bearer token.`,
    GET_BEARER_TOKEN_INVALID_RETURN:
      `Skyflow ${SDK_NAME_VERSION} initialization failed. Invalid client credentials - 'getBearerToken' should be function returning a promise`,
    EMPTY_CONTAINER_TYPE:
      `Skyflow ${SDK_NAME_VERSION} Invalid container type. The specified container type '{containerType}' is invalid. Ensure the container object is not empty.`,
    INVALID_CONTAINER_TYPE:
      `Skyflow ${SDK_NAME_VERSION} Invalid container type. The container object for '{containerType}' is invalid. Specify a valid container type.`,

    INVALID_COLLECT_VALUE: 'Invalid value',
    INVALID_COLLECT_VALUE_WITH_LABEL: 'Invalid %s1',

    RECORDS_KEY_NOT_FOUND:
      `${SDK_NAME_VERSION} Validation error. Missing 'records' key. Provide a valid 'records' key.`,
    INVALID_RECORDS_IN_INSERT:
      `${SDK_NAME_VERSION} Validation error. Invalid 'records' key found. Specify a value of type array instead.`,
    EMPTY_RECORDS_IN_INSERT:
      `${SDK_NAME_VERSION} Validation error. 'records' key cannot be empty. Provide a non-empty value instead.`,
    MISSING_TABLE_IN_INSERT:
      `${SDK_NAME_VERSION} Validation error. Missing 'table' key in records at index %s1. Provide a valid 'table' key.`,
    EMPTY_TABLE_IN_INSERT:
      `${SDK_NAME_VERSION} Validation error. 'table' key cannot be empty in records at index %s1. Specify a non-empty value instead.`,
    INVALID_TABLE_IN_INSERT:
      `${SDK_NAME_VERSION} Validation error. Invalid 'table' key in records at index %s1. Specify a value of type string instead.`,
    EMPTY_FIELDS_IN_INSERT:
      `${SDK_NAME_VERSION} Validation error. Missing 'fields' key in records at index %s1. Provide a valid 'fields' key.`,
    MISSING_FIELDS_IN_INSERT:
      `${SDK_NAME_VERSION} Validation error. 'fields' key cannot be empty in records at index %s1. Specify a non-empty value instead.`,
    INVALID_FIELDS_IN_INSERT:
      `${SDK_NAME_VERSION} Validation error. Invalid 'fields' key in records at index %s1. Specify a value of type object instead.`,
    INVALID_TOKENS_IN_INSERT:
      `${SDK_NAME_VERSION} Validation error.Invalid 'tokens' key in insert options. Specify a boolean value for tokens.`,
    INVALID_TOKENS_IN_COLLECT:
      `${SDK_NAME_VERSION} Validation error. Invalid tokens. Specify a boolean value for tokens.`,
    RECORDS_KEY_NOT_FOUND_IN_ADDITIONAL_FIELDS:
      `${SDK_NAME_VERSION} Validation error.'records' key not found in additionalFields. Specify a 'records' key in addtionalFields.`,
    INVALID_RECORDS_IN_ADDITIONAL_FIELDS:
      `${SDK_NAME_VERSION} Validation error.'records' must be an array within additionalFields.`,
    EMPTY_RECORDS_IN_ADDITIONAL_FIELDS:
      `${SDK_NAME_VERSION} Validation error.'records' object cannot be empty within additionalFields. Specify a non-empty value instead.`,
    MISSING_TABLE_IN_ADDITIONAL_FIELDS:
      `${SDK_NAME_VERSION} Validation error.'table' key not found in additionalFields record at index %s1.`,
    INVALID_TABLE_IN_ADDITIONAL_FIELDS:
      `${SDK_NAME_VERSION} Validation error.Invalid 'table' key value in additionalFields record at index %s1. Specify a value of type string for 'table' key.`,
    MISSING_FIELDS_IN_ADDITIONAL_FIELDS:
    `${SDK_NAME_VERSION} Validation error.'fields' key not found in additionalFields record at index %s1. Specify a 'fields' key in additionalFields record at index %s1.`,
    INVALID_FIELDS_IN_ADDITIONAL_FIELDS:
      `${SDK_NAME_VERSION} Validation error.invaid 'fields' key value in additionalFields record at index %s1. Specify a value of type array for 'fields' key.`,
    EMPTY_RECORDS_REVEAL:
      `${SDK_NAME_VERSION} Validation error. \'records\' key cannot be empty. Provide a non-empty value instead.`,
    MISSING_TOKEN_KEY_REVEAL:
      `${SDK_NAME_VERSION} Validation error. Missing 'token' key for reveal element. Specify a valid value for token.`,
    INVALID_TOKEN_ID_REVEAL:
      `${SDK_NAME_VERSION} Validation error. Invalid 'token' key found for reveal element. Specify a value of type string instead.`,
    INVALID_LABEL_REVEAL: `${SDK_NAME_VERSION} Validation error. Invalid 'label' key found for reveal element. Specify a value of type string instead.`,
    INVALID_ALT_TEXT_REVEAL: `${SDK_NAME_VERSION} Validation error. Invalid 'altText' key found for reveal element. Specify a value of type string instead.`,
    ELEMENTS_NOT_MOUNTED_REVEAL:
      `${SDK_NAME_VERSION} Reveal failed. Make sure to mount all elements before invoking 'reveal' function.`,
    EMPTY_TABLE_IN_ADDITIONAL_FIELDS:
      `${SDK_NAME_VERSION} Validation error.'table' field cannot be empty in additionalFields record at index %s1. Specify a non-empty value instead.`,
    EMPTY_FIELDS_IN_ADDITIONAL_FIELDS:
      `${SDK_NAME_VERSION} Validation error.'fields' object cannot be empty in additionalFields record at index %s1. Specify a non-empty value instead.`,
    EMPTY_TOKEN_ID_REVEAL: `${SDK_NAME_VERSION} Validation error. 'token' key cannot be empty for reveal element. Specify a non-empty value instead.`,
    FAILED_REVEAL: `${SDK_NAME_VERSION} Reveal failed. Some errors were encountered.`,
    MISSING_TABLE_IN_COLLECT:
    `${SDK_NAME_VERSION} Validation error.'table' key not found for collect element. Specify a valid value for 'table' key.`, //index found
    EMPTY_TABLE_IN_COLLECT:
    `${SDK_NAME_VERSION} Validation error.'table' cannot be empty for collect element. Specify a non-empty value for 'table'.`, 
    INVALID_TABLE_IN_COLLECT:
    `${SDK_NAME_VERSION} Validation error. Invalid type for 'table' key value for collect element. Specify a value of type string instead.`,
    MISSING_COLUMN_IN_COLLECT:
    `${SDK_NAME_VERSION} Validation error. 'column' key not found for collect element. Specify a valid column.`,
    EMPTY_COLUMN_IN_COLLECT:
    `${SDK_NAME_VERSION} Validation error. 'column' key cannot be empty for collect element. Specify a non-empty value instead.`,
    INVALID_COLUMN_IN_COLLECT:
    `${SDK_NAME_VERSION} Validation error. Invalid type for 'column' key for collect element. Specify a value of type string instead.`,
    ELEMENTS_NOT_MOUNTED:
    `${SDK_NAME_VERSION} Collect failed. Make sure all elements are mounted before calling 'collect' on the container.`,
    DUPLICATE_ELEMENT:
    `${SDK_NAME_VERSION} Mount failed.%s1 appeared multiple times in %s2. Make sure each column in a record is unique.`,
    DUPLICATE_ELEMENT_ADDITIONAL_FIELDS:
      `Skyflow ${SDK_NAME_VERSION} duplicate column in additional fields. A duplicate column %s1 was found in record index %s2 in the additional fields. Please ensure unique column names within the record.`,
    COMPLETE_AND_VALID_INPUTS:
    `${SDK_NAME_VERSION} Mount failed. Incomplete inputs for '%s1'. Make sure all inputs are complete and valid.`,
    UNKNOWN_ERROR: 'Unknown Error.',
    NETWORK_ERROR:
      `${SDK_NAME_VERSION} A network error occurred. This could be a CORS issue or a dropped internet connection. It is not possible for us to know. Please reach out to skyflow if you see this error`,
    ERROR_OCCURED: 'Error occurred.',
    CONNECTION_ERROR: `${SDK_NAME_VERSION} Error while initializing the connection.`,
    EMPTY_COLLECT_ELEMENTS:
    `${SDK_NAME_VERSION} collect failed. Make sure to create all elements before invoking 'collect' function.`,
    SKYFLOW_INTIALIZING_MISSING:
      `Skyflow ${SDK_NAME_VERSION} initialization failed - SkyflowProvider config is missing. `,
    CONTAINER_OBJECT_IS_REQUIRED:
      `${SDK_NAME_VERSION} cannot create %s1 element without container object, create a container using %s2 hook.`,
    INVALID_UPSERT_OPTION_TYPE:
      `${SDK_NAME_VERSION} Validation error. Invalid \'upsert\' key in insert options. Specify a value of type array instead`,
    EMPTY_UPSERT_OPTIONS_ARRAY:
      `${SDK_NAME_VERSION} Validation error. 'upsert' key cannot be an empty array in insert options. Make sure to add atleast one table column object in upsert array.`,
    INVALID_UPSERT_OPTION_OBJECT_TYPE:
      `${SDK_NAME_VERSION} Validation error. Invalid value in upsert array at index %s1 in insert options. Specify objects with 'table' and 'column' keys instead.`,
    MISSING_TABLE_IN_UPSERT_OPTION:
      `${SDK_NAME_VERSION} Validation error. Missing 'table' key in upsert array at index %s1. Provide a valid 'table' key.`,
    MISSING_COLUMN_IN_UPSERT_OPTION:
      `${SDK_NAME_VERSION} Validation error. Missing 'column' key in upsert array at index %s1. Provide a valid 'column' key.`,
    INVALID_TABLE_IN_UPSERT_OPTION:
      `${SDK_NAME_VERSION} Validation error. Invalid 'table' key in upsert array at index %s1. Specify a value of type string instead.`,
    INVALID_COLUMN_IN_UPSERT_OPTION:
      `${SDK_NAME_VERSION} Validation error. Invalid 'column' key in upsert array at index %s1. Specify a value of type string instead.`,
    INVALID_REDACTION_VALUE:
      `${SDK_NAME_VERSION} Invalid redaction value, redaction must be from RedactionType enum.`, //message not found
    INVALID_REDACTION_TYPE:
      `${SDK_NAME_VERSION} Invalid redaction type, redaction must be one of RedactionType enum value.`, //message not found
    MISSING_COMPOSABLE_LAYOUT_KEY:
      `Skyflow ${SDK_NAME_VERSION} layout required in composable container options. Provide a valid layout.`,
    EMPTY_COMPOSABLE_LAYOUT_ARRAY:
      `Skyflow ${SDK_NAME_VERSION} layout array cannot be empty in composable container options. Provide a valid layout array.`,
    INVALID_COMPOSABLE_LAYOUT_TYPE:
      `Skyflow ${SDK_NAME_VERSION} invalid layout value - it should be array of numbers in composable container options. Provide a valid layout value.`,
    NEGATIVE_VALUES_COMPOSABLE_LAYOUT:
      `Skyflow ${SDK_NAME_VERSION} layout array should only contain positive numbers in composable container options. Provide a valid layout array.`,
    MISMATCH_ELEMENT_COUNT_LAYOUT_SUM:
      `Skyflow ${SDK_NAME_VERSION}  element count mismatch - created elements must match sum of layout values. Ensure correct number of elements to match the layout value.`,
    MISSING_COMPOSABLE_CONTAINER_OPTIONS:
      `Skyflow ${SDK_NAME_VERSION} options object required for composable container. Provide a valid options object.`,
    INVALID_COMPOSABLE_CONTAINER_OPTIONS:
      `Skyflow ${SDK_NAME_VERSION} invalid options value - should be an object type. Provide a valid options object.`,
    RECORDS_KEY_NOT_FOUND_GET:
      `${SDK_NAME_VERSION} Validation error. Missing 'records' key. Provide a valid 'records' key.`,
    INVALID_RECORDS_IN_GET:
      `${SDK_NAME_VERSION} Validation error. Invalid 'records' key found. Specify a value of type array instead.`,
    EMPTY_RECORDS_GET: `${SDK_NAME_VERSION} Validation error. 'records' key cannot be empty. Provide a non-empty value instead.`,
    MISSING_IDS_IN_GET:
      `${SDK_NAME_VERSION} Validation error. Missing 'ids' key in records at index %s1. Provide a valid 'ids' key.`,
    INVALID_IDS_IN_GET:
      `${SDK_NAME_VERSION} Validation error. Invalid 'ids' key found. Specify a value of type array instead.`,
    INVALID_COLUMN_VALUES_IN_GET:
      `${SDK_NAME_VERSION} Validation error. Invalid 'columnValues' key found. Specify a value of type array instead.`,
    EMPTY_IDS_IN_GET:
      `${SDK_NAME_VERSION} Validation error. 'ids' key cannot be an array of empty strings in records at index %s1. Specify non-empty values instead.`,
    INVALID_SKYFLOWID_TYPE_IN_GET:
      `${SDK_NAME_VERSION} Validation error. Invalid 'id' found in 'ids' array in 'records' at index %s1 . Specify a value of type string instead.`,
    MISSING_TABLE_IN_GET:
      `${SDK_NAME_VERSION} Validation error. Missing 'table' key in records at index '%s1'. Provide a valid 'table' key.`,//
    INVALID_TABLE_IN_GET:
      `${SDK_NAME_VERSION} Validation error. Invalid 'table' key in records at index %s1. Specify a value of type string instead.`, //
    MISSING_REDACTION_IN_GET:
      `${SDK_NAME_VERSION} Validation error. Missing 'redaction' key in records at index %s1. Provide a valid 'redaction' key.`,
    INVALID_REDACTION_TYPE_IN_GET:
      `${SDK_NAME_VERSION} Validation error. Invalid 'redaction' key in records at index %s1. Specify a valid redaction type.`,
    INVALID_TOKENS_IN_GET:
      `${SDK_NAME_VERSION} Validation error. Invalid tokens in get options. Specify a boolean value for tokens.`,
    TOKENS_GET_COLUMN_NOT_SUPPORTED:
      `${SDK_NAME_VERSION} Validation error. 'columnName' and 'columnValues' cannot be used when 'tokens' are set to true in get options. Either set 'tokens' to false or use 'ids' instead.`,
    REDACTION_WITH_TOKENS_NOT_SUPPORTED:
      `${SDK_NAME_VERSION} Get failed. Redaction cannot be applied when 'tokens' are set to true in get options. Either remove redaction or set 'tokens' to false.`,
    EMPTY_SKYFLOWID_IN_GET:
      `${SDK_NAME_VERSION} Validation error. 'id' cannot be empty in 'ids' array in 'records' at index %s1. Specify non-empty values instead.`,
    EMPTY_TABLE_IN_GET:
      `${SDK_NAME_VERSION} Validation error. 'table' key cannot be empty in records at index %s1. Specify a non-empty value instead.`,
    EMPTY_REDACTION_TYPE_IN_GET:
      `${SDK_NAME_VERSION} Validation error. 'redaction' key cannot be empty in records at index %s1. Specify a non-empty value instead.`,
    INVALID_RECORD_COLUMN_VALUE: `${SDK_NAME_VERSION} Validation error. Invalid 'column' key. Specify a value of type string instead.`,
    MISSING_RECORD_COLUMN_VALUE:
    `${SDK_NAME_VERSION} Validation error. Column Values is required when Column Name is specified.`,
    MISSING_RECORD_COLUMN_NAME:
    `${SDK_NAME_VERSION} Validation error. Column Name is required when Column Values are specified.`,
    INVALID_RECORD_COLUMN_NAME_TYPE: `${SDK_NAME_VERSION} Validation error. Invalid Type of Records Column Name.`,
    INVALID_RECORD_COLUMN_VALUE_TYPE: `${SDK_NAME_VERSION} Validation error. Invalid Type of Records Column Values in records at index %s1`,
    INVALID_COLUMN_VALUES_TYPE:
    `${SDK_NAME_VERSION} Validation error. Invalid column values type, should be an Array.`,
    EMPTY_RECORD_COLUMN_VALUES: `${SDK_NAME_VERSION} Validation error. Record column values cannot be empty in records at index %s1`,
    EMPTY_COLUMN_VALUE: `${SDK_NAME_VERSION} Validation error. Column Value is empty in records at index %s1`,
    MISSING_IDS_OR_COLUMN_VALUES_IN_GET:
    `${SDK_NAME_VERSION} Validation error. Both 'ids' or 'columnValues' keys are missing. Either provide 'ids' or 'columnValues' with 'columnName' to fetch records.`,
    SKYFLOW_IDS_AND_COLUMN_NAME_BOTH_SPECIFIED:
    `${SDK_NAME_VERSION} Validation error. ids and columnName can not be specified together.`,
    GET_BY_SKYFLOWID_RESOLVED: '%s1 - GetById request is resolved.',
    GET_REJECTED: `${SDK_NAME_VERSION} Get failed. Get request is rejected.`,
  },
  warnLogs: {
    INVALID_EXPIRATION_DATE_FORMAT:
      'EXPIRATION_DATE format must be in one of %s1, the format is set to default MM/YY',
    INVALID_EXPIRATION_YEAR_FORMAT:
      'EXPIRATION_YEAR format must be in one of %s1, the format is set to default YY',
  },
};

export default logs;

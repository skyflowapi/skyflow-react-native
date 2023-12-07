/*
 Copyright (c) 2022 Skyflow, Inc.
*/
import type CollectContainer from '../../core/CollectContainer';
import RevealContainer from '../../core/RevealContainer';

/**
 *  Configuration for connecting to the Skyflow vault.
 */
export interface IConfig {
  /** ID of the vault to connect to. */
  vaultID: string;
  /** URL of the vault to connect to. */
  vaultURL: string;
  /** Function that retrieves a Skyflow bearer token from your backend. */
  getBearerToken: () => Promise<string>;
  /** Additional configuration options. */
  options?: Record<string, any>;
}

export const SkyflowConfigIntialState: IConfig = {
  vaultID: '',
  vaultURL: '',
  getBearerToken: () => {
    return Promise.resolve('');
  },
};

export interface CollectElementInput {
  table: string;
  column: string;
  label?: string;
  placeholder?: string;
  type: ElementType;
  onChange?: Function;
  onReady?: Function;
  onBlur?: Function;
  onFocus?: Function;
  validations?: IValidationRule[];
  inputStyles?: CollectInputStylesVariant;
  labelStyles?: CollectLabelStylesVariant;
  errorTextStyles?: StylesBaseVariant;
  containerType?:string;
}

export interface CollectElementProps {
  /** Table that the data belongs to. */
  table: string;
  /** Column that the data belongs to. */
  column: string;
  /** Type of the container. */
  container: CollectContainer;
  /** Label for the element. */
  label?: string;
  /** Placeholder text for the element. */
  placeholder?: string;
  /** Input validation rules for the element. */
  validations?: IValidationRule[];
  /** Function to call when the onChange event triggers. */
  onChange?: Function;
  /** Function to call when the onReady event triggers. */
  onReady?: Function;
  /** Function to call when the onBlur event triggers. */
  onBlur?: Function;
  /** Function to call when the onFocus event triggers. */
  onFocus?: Function;
  /** Additional configuration options. */
  options?: Record<string, any>;
  /** Styles for the element.*/
  inputStyles?: CollectInputStylesVariant;
  /** Styles for the element's label. */
  labelStyles?: CollectLabelStylesVariant;
  /** Styles for the element's error text. */
  errorTextStyles?: StylesBaseVariant;
  containerMethods?: Record<any,any>;
}

/**
 *  Supported element types.
 */
export enum ElementType {
  CVV = 'CVV',
  EXPIRATION_DATE = 'EXPIRATION_DATE',
  CARD_NUMBER = 'CARD_NUMBER',
  CARDHOLDER_NAME = 'CARDHOLDER_NAME',
  INPUT_FIELD = 'INPUT_FIELD',
  PIN = 'PIN',
  EXPIRATION_MONTH = 'EXPIRATION_MONTH',
  EXPIRATION_YEAR = 'EXPIRATION_YEAR',
}

export interface CollectElementState {
  elementType: ElementType;
  value: string;
  isEmpty: boolean;
  isFocused: boolean;
  isValid: boolean;
}

export enum ContentType {
  APPLICATIONORJSON = 'application/json',
  TEXTORPLAIN = 'text/plain',
  TEXTORXML = 'text/xml',
  FORMURLENCODED = 'application/x-www-form-urlencoded',
  FORMDATA = 'multipart/form-data',
}

/**
 *  Supported log levels.
 */
export enum LogLevel {
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG',
  ERROR = 'ERROR',
}

/**
 *  Supported environments.
 */
export enum Env {
  DEV = 'DEV',
  PROD = 'PROD',
}

export interface RevealElementInput {
  token: string;
  label?: string;
  altText?: string;
  redaction?: RedactionType;
  elementId?: string;
}

export interface RevealElementProps {
  /** The actual data token. */
  token: string;
  /** The reveal container. */
  container: RevealContainer;
  /** Label for the form element. */
  label?: string;
  /** Alternative text for the Reveal Element. */
  altText?: string;
  /** Styles for the element. */
  inputStyles?: StylesBaseVariant;
  /** Styles for the element's label. */
  labelStyles?: StylesBaseVariant;
  /** Styles for the element's error text. */
  errorTextStyles?: StylesBaseVariant;
  /** Redaction type of the revealed data. */
  redaction?: RedactionType
}

export enum MessageType {
  LOG = 'LOG',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export interface IRevealRecord {
  token: string;
  redaction?: RedactionType;
  elementId?: string;
}

export interface IRevealResponseType {
  records?: Record<string, string>[];
  errors?: Record<string, any>[];
}

/**
 *  Supported validation rule types.
 */
export enum ValidationRuleType {
  REGEX_MATCH_RULE = 'REGEX_MATCH_RULE',
  LENGTH_MATCH_RULE = 'LENGTH_MATCH_RULE',
}

export interface IValidationRule {
  type: ValidationRuleType;
  params: any;
}

export interface StylesBaseVariant {
  base?: Record<string, any>;
}

export interface StylesFocusVariant {
  focus?: Record<string, any>;
}

export interface CollectInputStylesVariant
  extends StylesBaseVariant,
    StylesFocusVariant {
  complete?: Record<string, any>;
  invalid?: Record<string, any>;
  empty?: Record<string, any>;
}

export interface CollectLabelStylesVariant
  extends StylesBaseVariant,
    StylesFocusVariant {
  requiredAsterisk?: Record<string, any>;
}

export const DEFAULT_COLLECT_ELEMENT_STYLES = {
  base: {},
  focus: {},
  complete: {},
  invalid: {},
  empty: {},
};

export interface IInsertRecord {
  table: string;
  fields: Record<string, any>;
}
export interface IInsertRecordInput {
  records: IInsertRecord[];
}

export interface IUpsertInput {
  table: string;
  column: string;
}

export interface ICollectOptions {
  tokens?: boolean;
  additionalFields?: IInsertRecordInput;
  upsert?: IUpsertInput[];
}

export interface CollectElementOptions {
  format?: string;
  required?: boolean;
}

export const REQUIRED_MARK_DEFAULT_STYLE = {
  color: 'red',
};

export const ELEMENT_REQUIRED_ASTERISK = ' *';

/**
 *  Supported redaction types.
 */
export enum RedactionType {
  DEFAULT = 'DEFAULT',
  PLAIN_TEXT = 'PLAIN_TEXT',
  MASKED = 'MASKED',
  REDACTED = 'REDACTED',
}

export enum ContainerType {
  COLLECT = 'COLLECT',
  REVEAL = 'REVEAL',
  COMPOSABLE = 'COMPOSABLE',
}

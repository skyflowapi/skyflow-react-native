import type CollectContainer from "../../core/CollectContainer";
import RevealContainer from "../../core/RevealContainer";

export interface IConfig {
    vaultID: string
    vaultURL: string
    getBearerToken:()=>Promise<string>
    options?: Record<string,any>
}

export const SkyflowConfigIntialState:IConfig = {
    vaultID: '',
    vaultURL: '',
    getBearerToken: ()=>{
        return Promise.resolve('');
    }
}

export interface CollectElementInput{
    table: string;
    column: string;
    label?: string;
    placeholder?: string;
    type: ElementType;
    onChange?:Function;
    onReady?:Function;
    onBlur?:Function;
    onFocus?:Function;
    validations?: IValidationRule[];
    inputStyles?: CollectInputStylesVariant;
    labelStyles?: CollectLabelStylesVariant;
    errorTextStyles?: StylesBaseVariant;
}

export interface CollectElementProps {
    table: string;
    column: string;
    container: CollectContainer;
    label?: string;
    placeholder?: string;
    validations?: IValidationRule[]
    onChange?:Function;
    onReady?:Function;
    onBlur?:Function;
    onFocus?:Function;
    options?:Record<string,any>;
    inputStyles?: CollectInputStylesVariant;
    labelStyles?: CollectLabelStylesVariant;
    errorTextStyles?: StylesBaseVariant;
}

export enum ElementType{
    CVV = 'CVV',
    EXPIRATION_DATE = 'EXPIRATION_DATE',
    CARD_NUMBER = 'CARD_NUMBER',
    CARDHOLDER_NAME = 'CARDHOLDER_NAME',
    INPUT_FIELD = 'INPUT_FIELD',
    PIN = 'PIN',
    EXPIRATION_MONTH = 'EXPIRATION_MONTH',
    EXPIRATION_YEAR = 'EXPIRATION_YEAR',
}

export interface CollectElementState{
        elementType: ElementType
        value: string,
        isEmpty: boolean,
        isFocused: boolean,
        isValid: boolean
}

export enum ContentType {
    APPLICATIONORJSON = 'application/json',
    TEXTORPLAIN = 'text/plain',
    TEXTORXML = 'text/xml',
    FORMURLENCODED = 'application/x-www-form-urlencoded',
    FORMDATA = 'multipart/form-data',
  }
  
  export enum LogLevel{
    WARN = 'WARN',
    INFO = 'INFO',
    DEBUG = 'DEBUG',
    ERROR = 'ERROR',
  }
  
  export enum Env{
    DEV = 'DEV',
    PROD = 'PROD',
  }

  export interface RevealElementInput{
    token: string;
    label?: string;
    altText?: string;
  }

  export interface RevealElementProps{
    token: string;
    container: RevealContainer;
    label?: string;
    altText?: string;
    inputStyles?: StylesBaseVariant;
    labelStyles?: StylesBaseVariant;
    errorTextStyles?: StylesBaseVariant;
  }

  export enum MessageType{
    LOG = 'LOG',
    WARN = 'WARN',
    ERROR = 'ERROR',
  }


  export interface IRevealRecord {
    token: string;
  }
  
  export interface IRevealResponseType {
    records?: Record<string, string>[];
    errors?: Record<string, any>[];
  }

  export enum ValidationRuleType {
    REGEX_MATCH_RULE = 'REGEX_MATCH_RULE',
    LENGTH_MATCH_RULE = 'LENGTH_MATCH_RULE',
  }

  export interface IValidationRule {
    type: ValidationRuleType;
    params: any;
  }

  export interface StylesBaseVariant{
    base?: Record<string,any>;
  }

  export interface StylesFocusVariant{
    focus?: Record<string,any>;
  }

  export interface CollectInputStylesVariant extends StylesBaseVariant, StylesFocusVariant{
      complete?: Record<string,any>;
      invalid?: Record<string,any>;
      empty?: Record<string,any>;
  }

  export interface CollectLabelStylesVariant extends StylesBaseVariant, StylesFocusVariant{

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
  export interface ICollectOptions {
    tokens?: boolean;
    additionalFields?: IInsertRecordInput;
  }

  export interface CollectElementOptions {
    format?: string,
    required?: boolean;
  }


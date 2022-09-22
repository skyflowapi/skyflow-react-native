import type CollectContainer from "../../core/CollectContainer";

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
    type?: ElementType;
}

export interface CollectElementProps extends CollectElementInput{
    container: CollectContainer;
    options?:Record<string,any>;
    onChange?:Function;
    onReady?:Function;
    onBlur?:Function;
    onFocus?:Function;
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
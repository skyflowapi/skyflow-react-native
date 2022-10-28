/*
    Copyright (c) 2022 Skyflow, Inc.
*/
import CollectElement from '../../src/core/CollectElement';
import {
  CardType,
  DEFAULT_COLLECT_ELEMENT_ERROR_TEXT,
  DEFAULT_VALIDATION_ERROR_TEXT,
} from '../../src/core/constants';
import {
  ElementType,
  Env,
  LogLevel,
  ValidationRuleType,
} from '../../src/utils/constants';
import SkyflowError from '../../src/utils/skyflow-error';
import SKYFLOW_ERROR_CODE from '../../src/utils/skyflow-error-code';

const context = { env: Env.PROD, logLevel: LogLevel.ERROR };
const onChangeMock = jest.fn();
const onFocusMock = jest.fn();
const onBlurMock = jest.fn();

const baseStyles = { color: 'grey' };
const focusStyles = { borderColor: '#eae8ee' };
const emptyStyles = { color: 'black' };
const completeStyles = { color: 'green' };
const invalidStyles = { color: 'red' };

describe('test Collect Element class', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('test CardNumber Element', () => {
    const elementInput = {
      table: 'cards',
      column: 'string1',
      type: ElementType.CARD_NUMBER,
      label: 'Card Number',
      onChange: onChangeMock,
    };
    const cardNumberElement = new CollectElement(
      elementInput,
      { required: true },
      context
    );
    expect(cardNumberElement.getCardType()).toBe(CardType.DEFAULT);
    expect(cardNumberElement.getElementInput()).toBe(elementInput);
    cardNumberElement.onChangeElement('411111111');
    expect(cardNumberElement.getCardType()).toBe(CardType.VISA);
    expect(cardNumberElement.getInternalState().value).toBe('4111 1111 1');
    expect(onChangeMock).toBeCalledWith({
      elementType: ElementType.CARD_NUMBER,
      isFocused: false,
      isEmpty: false,
      value: '41111111X',
      isValid: false,
    });
    expect(cardNumberElement.getErrorText()).toBe(
      `Invalid ${elementInput.label}`
    );
  });

  it('test ExpiryMonth collect element', () => {
    const collectElement = new CollectElement(
      {
        table: 'cards',
        column: 'string1',
        type: ElementType.EXPIRATION_MONTH,
        onChange: onChangeMock,
        onBlur: onBlurMock,
        onFocus: onFocusMock,
      },
      { required: true },
      context
    );
    expect(collectElement.getInternalState()).toEqual({
      elementType: ElementType.EXPIRATION_MONTH,
      isFocused: false,
      isEmpty: true,
      value: '',
      isValid: false,
    });
    expect(collectElement.getErrorText()).toBe(undefined); // TODO
    // valid value
    collectElement.onChangeElement('5');
    expect(collectElement.getInternalState()).toEqual({
      elementType: ElementType.EXPIRATION_MONTH,
      isFocused: false,
      isEmpty: false,
      value: '05',
      isValid: true,
    });
    expect(collectElement.getErrorText()).toBe('');
    expect(onChangeMock).toBeCalledWith({
      elementType: ElementType.EXPIRATION_MONTH,
      isFocused: false,
      isEmpty: false,
      value: '',
      isValid: true,
    });

    expect(collectElement.hasError).toBe(false);
    // invalid value
    collectElement.onChangeElement('13');
    expect(collectElement.getInternalState().isValid).toBe(false);
    expect(collectElement.getInternalState().value).toBe('13');
    expect(collectElement.getErrorText()).toBe(
      DEFAULT_COLLECT_ELEMENT_ERROR_TEXT
    );
    expect(collectElement.hasError).toBe(true);
    // test blur
    collectElement.onChangeElement('1');
    expect(collectElement.getInternalState().isValid).toBe(true);
    expect(collectElement.getInternalState().value).toBe('1');
    collectElement.onFocusElement();
    expect(onFocusMock).toBeCalledWith({
      elementType: ElementType.EXPIRATION_MONTH,
      isFocused: true,
      isEmpty: false,
      value: '',
      isValid: true,
    });
    collectElement.onBlurElement();
    expect(collectElement.getInternalState().value).toBe('01');
    expect(onBlurMock).toBeCalledWith({
      elementType: ElementType.EXPIRATION_MONTH,
      isFocused: false,
      isEmpty: false,
      value: '',
      isValid: true,
    });
  });

  it('test ExpirationDate collect element', () => {
    const collectElement = new CollectElement(
      {
        table: 'cards',
        column: 'expiration_date',
        label: 'Expiration Date',
        type: ElementType.EXPIRATION_DATE,
        onChange: onChangeMock,
      },
      {
        format: 'YYYY/MM',
      },
      context
    );
    expect(collectElement.getCardType()).toBe(undefined);
    const currentDate = new Date();
    const validExipryDate = `${
      currentDate.getFullYear() + 1
    }/${currentDate.getMonth()}`;
    collectElement.onChangeElement(validExipryDate);
    expect(collectElement.getInternalState().isValid).toBe(true);
    const elementValue = collectElement.getInternalState().value;
    const [year, month] = elementValue.split('/');
    expect(Number(year)).toBe(currentDate.getFullYear() + 1);
    expect(Number(month)).toBe(currentDate.getMonth());
    expect(onChangeMock).toBeCalledWith({
      elementType: ElementType.EXPIRATION_DATE,
      isFocused: false,
      isEmpty: false,
      value: '',
      isValid: true,
    });
  });

  it('test Pin Element', () => {
    const collectElement = new CollectElement(
      {
        table: 'cards',
        column: 'pin',
        label: 'Pin',
        type: ElementType.PIN,
        onChange: onChangeMock,
        onBlur: onBlurMock,
      },
      {},
      context
    );
    expect(collectElement.isValidElement()).toBe(true);
    collectElement.onChangeElement('1321');
    expect(collectElement.getInternalState().value).toBe('1321');
    const currentElementState = {
      elementType: ElementType.PIN,
      isFocused: false,
      isEmpty: false,
      value: '',
      isValid: true,
    };
    expect(onChangeMock).toBeCalledWith(currentElementState);
    collectElement.onBlurElement();
    expect(onBlurMock).toBeCalledWith(currentElementState);
  });

  it('test isValidElement Function', () => {
    let collecteElement;
    const isValid = () => {
      collecteElement.isValidElement();
    };

    collecteElement = new CollectElement({}, {}, context);
    expect(isValid).toThrow(
      new SkyflowError(SKYFLOW_ERROR_CODE.MISSING_TABLE_IN_COLLECT, [], true)
    );

    collecteElement = new CollectElement({ table: '' }, {}, context);
    expect(isValid).toThrow(
      new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_TABLE_IN_COLLECT, [], true)
    );

    collecteElement = new CollectElement({ table: true }, {}, context);
    expect(isValid).toThrow(
      new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_TABLE_IN_COLLECT, [], true)
    );

    collecteElement = new CollectElement({ table: 'cards' }, {}, context);
    expect(isValid).toThrow(
      new SkyflowError(SKYFLOW_ERROR_CODE.MISSING_COLUMN_IN_COLLECT, [], true)
    );

    collecteElement = new CollectElement(
      { table: 'cards', column: '' },
      {},
      context
    );
    expect(isValid).toThrow(
      new SkyflowError(SKYFLOW_ERROR_CODE.EMPTY_COLUMN_IN_COLLECT, [], true)
    );

    collecteElement = new CollectElement(
      { table: 'cards', column: true },
      {},
      context
    );
    expect(isValid).toThrow(
      new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_COLUMN_IN_COLLECT, [], true)
    );
  });

  it('test updateInputStyles', () => {
    let collectElement;
    collectElement = new CollectElement(
      {
        type: ElementType.CVV,
      },
      {},
      context
    );
    expect(collectElement.updateInputStyles()).toEqual({});

    collectElement = new CollectElement(
      {
        type: ElementType.CVV,
        inputStyles: { base: baseStyles },
      },
      {},
      context
    );
    expect(collectElement.updateInputStyles()).toEqual(baseStyles);

    collectElement = new CollectElement(
      {
        type: ElementType.CVV,
        inputStyles: {
          base: baseStyles,
          focus: focusStyles,
          complete: completeStyles,
          empty: emptyStyles,
          invalid: invalidStyles,
        },
      },
      {},
      context
    );
    expect(collectElement.updateInputStyles()).toEqual({
      ...baseStyles,
      ...emptyStyles,
    });

    collectElement.onFocusElement();
    expect(collectElement.updateInputStyles()).toEqual({
      ...baseStyles,
      ...focusStyles,
      ...emptyStyles,
    });

    collectElement.onChangeElement('1211');
    expect(collectElement.updateInputStyles()).toEqual({
      ...baseStyles,
      ...focusStyles,
      ...completeStyles,
    });

    collectElement.onBlurElement();
    expect(collectElement.updateInputStyles()).toEqual({
      ...baseStyles,
      ...completeStyles,
    });
    collectElement.onChangeElement('12');
    expect(collectElement.updateInputStyles()).toEqual({
      ...baseStyles,
      ...invalidStyles,
    });
  });

  it('test updateLableStyles', () => {
    let collectElement;
    collectElement = new CollectElement(
      {
        type: ElementType.CARDHOLDER_NAME,
      },
      {},
      context
    );
    expect(collectElement.updateLabelStyles()).toEqual({});

    collectElement = new CollectElement(
      {
        type: ElementType.CARDHOLDER_NAME,
        labelStyles: { base: baseStyles },
      },
      {},
      context
    );
    expect(collectElement.updateLabelStyles()).toEqual({});

    collectElement = new CollectElement(
      {
        type: ElementType.CARDHOLDER_NAME,
        labelStyles: { base: baseStyles, focus: focusStyles },
        label: 'CardHolder Name',
      },
      {},
      context
    );
    expect(collectElement.updateLabelStyles()).toEqual(baseStyles);

    collectElement.onChangeElement('test');
    expect(collectElement.updateLabelStyles()).toEqual(baseStyles);

    collectElement.onFocusElement();
    expect(collectElement.updateLabelStyles()).toEqual({
      ...baseStyles,
      ...focusStyles,
    });
  });

  it('test custom validations length match rule', () => {
    let collectElement;
    const validationErrorText = 'Length must be 2 or 4';
    collectElement = new CollectElement(
      {
        type: ElementType.INPUT_FIELD,
        validations: [
          {
            type: ValidationRuleType.LENGTH_MATCH_RULE,
            params: {
              min: 2,
              max: 4,
              error: validationErrorText,
            },
          },
        ],
      },
      {},
      context
    );
    expect(collectElement.getInternalState().isValid).toBe(true);
    expect(collectElement.getErrorText()).toBe(undefined);
    collectElement.onChangeElement('1');
    expect(collectElement.getInternalState().isValid).toBe(false);
    expect(collectElement.getErrorText()).toBe(validationErrorText);
    collectElement.onChangeElement('23');
    expect(collectElement.getInternalState().isValid).toBe(true);
    expect(collectElement.getErrorText()).toBe('');
  });
  it('test custom validations regex match rule', () => {
    let collectElement;
    collectElement = new CollectElement(
      {
        type: ElementType.INPUT_FIELD,
        validations: [
          {
            type: ValidationRuleType.REGEX_MATCH_RULE,
            params: {
              regex: /[A-Za-z]+/,
            },
          },
        ],
      },
      {},
      context
    );
    expect(collectElement.getInternalState().isValid).toBe(true);
    expect(collectElement.getErrorText()).toBe(undefined);
    collectElement.onChangeElement('1234');
    expect(collectElement.getInternalState().isValid).toBe(false);
    expect(collectElement.getErrorText()).toBe(DEFAULT_VALIDATION_ERROR_TEXT);

    collectElement = new CollectElement(
      {
        type: ElementType.INPUT_FIELD,
        validations: [
          {
            type: undefined,
          },
        ],
      },
      {},
      context
    );
    collectElement.onChangeElement('1234');
    expect(collectElement.getErrorText()).toBe('');
  });

  it('test expiration Year collect element', () => {
    let collectElement;
    collectElement = new CollectElement(
      {
        type: ElementType.EXPIRATION_YEAR,
      },
      {
        required: true,
        format: 'YYYY',
      },
      context
    );

    expect(collectElement.getInternalState().isValid).toBe(false);
    collectElement.onChangeElement(`${new Date().getFullYear() + 1}`);

    expect(collectElement.getInternalState().isValid).toBe(true);
    collectElement.onChangeElement('2020');
    expect(collectElement.getInternalState().isValid).toBe(false);

    collectElement = new CollectElement(
      {
        type: ElementType.EXPIRATION_YEAR,
      },
      {
        required: true,
        format: 'YY',
      },
      context
    );
    expect(collectElement.getInternalState().isValid).toBe(false);
    collectElement.onChangeElement(`${new Date().getFullYear() - 2000 + 1}`);

    expect(collectElement.getInternalState().isValid).toBe(true);
    collectElement.onChangeElement('20');
    expect(collectElement.getInternalState().isValid).toBe(false);
  });
});

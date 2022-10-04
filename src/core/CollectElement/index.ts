/* eslint-disable @typescript-eslint/no-unused-vars */

import { isEmpty } from 'lodash';
import {
  validateCardHolderName,
  validateCardNumberLengthCheck,
  validateCreditCardNumber,
  validateCvv,
  validateExpiryDate,
  validateExpiryMonth,
  validateExpiryYear,
  validateLengthMatchRule,
  validatePin,
  validRegexMatchRule,
} from '../../core-utils/element-validations';
import {
  CollectElementInput,
  CollectElementProps,
  CollectElementState,
  ElementType,
  Env,
  IValidationRule,
  ValidationRuleType,
} from '../../utils/constants';
import {
  appendZeroToOne,
  detectCardType,
  formatCardNumber,
  formatExpirationDate,
  formatExpirationMonthValue,
  getReturnValue,
} from '../../utils/helpers';
import { EnvOptions } from '../../utils/logs-helper';
import {
  CardType,
  DEFAULT_COLLECT_ELEMENT_ERROR_TEXT,
  DEFAULT_VALIDATION_ERROR_TEXT,
} from '../constants';
import SkyflowElement from '../SkyflowElement';

class CollectElement extends SkyflowElement {
  #state: CollectElementState;
  #elementInput: CollectElementInput;
  #options: any;
  #elementType: ElementType;
  #label: string;
  #errorText: string;
  hasError: boolean;
  // only for card number element
  #cardType: CardType | undefined;
  #validations: IValidationRule[];
  #customValidErrorText: string | undefined;

  constructor(
    elementInput: CollectElementInput,
    options = { required: false }
  ) {
    super();
    console.log('Element Created', elementInput, 'Options', options);
    this.#elementInput = elementInput;
    this.#elementType = elementInput.type;
    if (elementInput.label) {
      this.#label = elementInput.label;
    }
    if (this.#elementType === ElementType.CARD_NUMBER) {
      this.#cardType = CardType.DEFAULT;
    }
    if (elementInput.validations) {
      this.#validations = elementInput.validations;
    }
    this.#options = options;
    this.#state = {
      elementType: this.#elementType,
      isFocused: false,
      isEmpty: true,
      value: '',
      isValid: !options.required,
    };
  }

  updateValue(value: string) {
    this.#state = {
      ...this.#state,
      value: value,
    };
  }
  getInternalState() {
    return this.#state;
  }

  getElementInput() {
    return this.#elementInput;
  }

  getCardType() {
    return this.#cardType;
  }

  getErrorText() {
    return this.#errorText;
  }

  getClientState() {
    return {
      ...this.#state,
      value: getReturnValue(
        this.#state.value,
        EnvOptions[Env.PROD]?.doesReturnValue,
        this.#elementType,
        this.#cardType
      ),
    };
  }

  onChangeElement(value: string) {
    switch (this.#elementType) {
      case ElementType.EXPIRATION_MONTH:
        this.updateElement(formatExpirationMonthValue(value));
        break;
      case ElementType.EXPIRATION_DATE:
        this.updateElement(formatExpirationDate(value, this.#options.format));
        break;
      case ElementType.CARD_NUMBER:
        this.#cardType = detectCardType(value);
        this.updateElement(formatCardNumber(value, this.#cardType));
        break;
      default:
        this.updateElement(value);
    }
    if (this.#elementInput.onChange) {
      this.#elementInput.onChange(this.getClientState());
    }
  }
  onFocusElement() {
    this.#state = {
      ...this.#state,
      isFocused: true,
    };

    if (this.#elementInput.onFocus) {
      this.#elementInput.onFocus(this.getClientState());
    }
  }

  onBlurElement() {
    if (this.#elementType === ElementType.EXPIRATION_MONTH) {
      this.updateElement(appendZeroToOne(this.#state.value));
    } else {
      this.updateElement(this.#state.value);
    }
    this.#state = {
      ...this.#state,
      isFocused: false,
    };

    if (this.#elementInput.onFocus) {
      this.#elementInput.onFocus(this.getClientState());
    }
  }

  updateInputStyles() {
    let inputStyles = {};
    if (this.#elementInput.inputStyles) {
      if (this.#elementInput.inputStyles.base) {
        inputStyles = { ...(this.#elementInput.inputStyles.base || {}) };
      }

      if (this.#elementInput.inputStyles.focus && this.#state.isFocused) {
        inputStyles = {
          ...inputStyles,
          ...(this.#elementInput.inputStyles.focus || {}),
        };
      }

      if (this.#elementInput.inputStyles.empty && this.#state.isEmpty) {
        inputStyles = {
          ...inputStyles,
          ...(this.#elementInput.inputStyles.empty || {}),
        };
      } else {
        if (this.#elementInput.inputStyles.invalid && !this.#state.isValid) {
          inputStyles = {
            ...inputStyles,
            ...(this.#elementInput.inputStyles.invalid || {}),
          };
        }
        if (this.#elementInput.inputStyles.complete && this.#state.isValid) {
          inputStyles = {
            ...inputStyles,
            ...(this.#elementInput.inputStyles.complete || {}),
          };
        }
      }
    }
    return inputStyles;
  }

  updateLabelStyles() {
    let labelStyles = {};
    if (this.#label && this.#elementInput.labelStyles) {
      if (this.#elementInput.labelStyles.base) {
        labelStyles = { ...(this.#elementInput.labelStyles.base || {}) };
      }
      if (this.#elementInput.labelStyles.focus && this.#state.isFocused) {
        labelStyles = {
          ...labelStyles,
          ...(this.#elementInput.labelStyles.focus || {}),
        };
      }
    }
    return labelStyles;
  }

  private updateError(showError: boolean) {
    if (showError) {
      this.#errorText = this.#customValidErrorText
        ? this.#customValidErrorText
        : this.#label
        ? `Invalid ${this.#elementInput.label}`
        : DEFAULT_COLLECT_ELEMENT_ERROR_TEXT;
      this.hasError = true;
    } else {
      this.#errorText = '';
      this.hasError = false;
    }
  }

  private updateElement(value: string) {
    let validStatus = this.#options?.required ? !isEmpty(value) : true;

    switch (this.#elementType) {
      case ElementType.PIN:
        validStatus = validStatus && validatePin(value);
        break;
      case ElementType.CVV:
        validStatus = validStatus && validateCvv(value);
        break;
      case ElementType.CARDHOLDER_NAME:
        validStatus = validStatus && validateCardHolderName(value);
        break;
      case ElementType.EXPIRATION_MONTH:
        validStatus = validStatus && validateExpiryMonth(value);
        break;
      case ElementType.EXPIRATION_YEAR:
        validStatus =
          validStatus && validateExpiryYear(value, this.#options?.format);
        break;
      case ElementType.EXPIRATION_DATE:
        validStatus =
          validStatus && validateExpiryDate(value, this.#options?.format);
        break;
      case ElementType.CARD_NUMBER:
        validStatus =
          validStatus &&
          validateCreditCardNumber(value) &&
          validateCardNumberLengthCheck(
            value,
            this.#cardType || CardType.DEFAULT
          );
        break;
      default:
        validStatus = true;
    }

    validStatus = validStatus && this.validateCustomValidations(value);

    this.#state = {
      ...this.#state,
      value: value,
      isEmpty: isEmpty(value),
      isValid: validStatus,
    };
    this.updateError(!validStatus);
  }

  private validateCustomValidations(value: string): boolean {
    let customValid = true;
    if (this.#validations && this.#validations.length) {
      for (let index = 0; index < this.#validations.length; index++) {
        const validationRule = this.#validations[index];
        switch (validationRule.type) {
          case ValidationRuleType.LENGTH_MATCH_RULE:
            customValid = validateLengthMatchRule(validationRule.params, value);
            break;
          case ValidationRuleType.REGEX_MATCH_RULE:
            customValid = validRegexMatchRule(
              validationRule.params.regex,
              value
            );
            break;
          default:
            this.#customValidErrorText = 'Invalid Validation Rule';
            break;
        }
        if (!customValid) {
          this.#customValidErrorText =
            validationRule.params.error || DEFAULT_VALIDATION_ERROR_TEXT;
          return customValid;
        }
      }
    }
    return customValid;
  }
}

export default CollectElement;

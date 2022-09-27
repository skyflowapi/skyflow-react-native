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
  validatePin,
} from '../../core-utils/element-validations';
import {
  CollectElementInput,
  CollectElementState,
  ElementType,
} from '../../utils/constants';
import {
  appendZeroToOne,
  detectCardType,
  formatCardNumber,
  formatExpirationDate,
  formatExpirationMonthValue,
} from '../../utils/helpers';
import { CardType } from '../constants';
import SkyflowElement from '../SkyflowElement';

class CollectElement extends SkyflowElement {
  #state: CollectElementState;
  #elementInput: CollectElementInput;
  #options: any;
  #elementType: ElementType;
  #label: string;
  errorText: string;
  hasError: boolean;
  // only for card number element
  #cardType: CardType | undefined;

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
  }
  onFocusElement() {
    this.#state = {
      ...this.#state,
      isFocused: true,
    };
    console.debug('focus', this.#state);
  }

  onBlurElement() {
    console.debug('blur', this.#state);
    if (this.#elementType === ElementType.EXPIRATION_MONTH) {
      this.updateElement(appendZeroToOne(this.#state.value));
    } else {
      this.updateElement(this.#state.value);
    }
    this.#state = {
      ...this.#state,
      isFocused: false,
    };
  }

  private updateError(showError: boolean) {
    if (showError) {
      this.errorText = this.#label
        ? `Invalid ${this.#elementInput.label}`
        : `Invalid value`;
      this.hasError = true;
    } else {
      this.errorText = '';
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
    this.#state = {
      ...this.#state,
      value: value,
      isEmpty: isEmpty(value),
      isValid: validStatus,
    };
    this.updateError(!validStatus);
  }
}

export default CollectElement;

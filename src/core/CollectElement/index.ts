/* eslint-disable @typescript-eslint/no-unused-vars */

import { isEmpty } from 'lodash';
import { validatePin } from '../../core-utils/element-validations';
import {
  CollectElementInput,
  CollectElementState,
  ElementType,
} from '../../utils/constants';
import SkyflowElement from '../SkyflowElement';

class CollectElement extends SkyflowElement {
  #state: CollectElementState;
  #elementInput: CollectElementInput;
  #options: any;
  #elementType: ElementType;
  #label: string;
  errorText: string;
  hasError: boolean;

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

  onChangeElement(value: string) {
    console.warn('change event triggerd', value);
    this.updateElement(value);
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
    this.updateElement(this.#state.value);
    this.#state = {
      ...this.#state,
      isFocused: false,
    };
  }

  private updateError(showError: boolean) {
    console.log('Update error Function Called..!', showError);
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

    if (this.#elementType === ElementType.PIN) {
      validStatus = validStatus && validatePin(value);
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

/*
 Copyright (c) 2022 Skyflow, Inc.
*/
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { RevealElementInput } from '../../utils/constants';
import { REVEAL_ELEMENT_ERROR_TEXT } from '../constants';
import SkyflowElement from '../SkyflowElement';

class RevealSkyflowElement extends SkyflowElement {
  #token: string;
  setRevealValue: Function;
  #setErrorText: Function;
  elementId: string;

  constructor(revealInput: RevealElementInput) {
    super();
    this.#token = revealInput.token;
    this.elementId = revealInput.elementId;
  }

  setMethods(setValue, setErrorText) {
    this.setRevealValue = setValue;
    this.#setErrorText = setErrorText;
  }

  setError() {
    this.#setErrorText(REVEAL_ELEMENT_ERROR_TEXT);
  }

  getToken() {
    return this.#token;
  }
}

export default RevealSkyflowElement;

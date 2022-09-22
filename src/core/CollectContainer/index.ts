/* eslint-disable @typescript-eslint/no-unused-vars */
import { tokenize } from '../../core-utils/collect';
import type { CollectElementInput } from '../../utils/constants';
import CollectElement from '../CollectElement';
import Container from '../Container';
import type Skyflow from '../Skyflow';

class CollectContainer extends Container {
  #containerId: string;

  #elementsList: CollectElement[];

  #skyflowClient: Skyflow;

  constructor(skyflowClient: Skyflow) {
    super();
    console.log('container created..!');
    this.#containerId = '1234';
    this.#elementsList = [];
    this.#skyflowClient = skyflowClient;
  }

  create(elementInput: CollectElementInput, options?: any) {
    const element = new CollectElement(elementInput, options);
    this.#elementsList.push(element);
    console.log(this.#containerId);
    return element;
  }

  collect(options: any = {}) {
    console.log('Elements List ->', this.#elementsList);
    return tokenize(this.#skyflowClient, this.#elementsList, options);
  }
}

export default CollectContainer;

/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  fetchRecordsByTokenId,
  formatRecordsForClient,
  formatRecordsForIframe,
} from '../../core-utils/reveal';
import { IRevealRecord, RevealElementInput } from '../../utils/constants';
import Container from '../Container';
import RevealSkyflowElement from '../RevealSkyflowElement';
import Skyflow from '../Skyflow';

class RevealContainer extends Container {
  #tokensList: IRevealRecord[];
  #elementList: RevealSkyflowElement[];
  #skyflowClient: Skyflow;

  constructor(skyflowClient: Skyflow) {
    super();
    this.#skyflowClient = skyflowClient;
    this.#tokensList = [];
    this.#elementList = [];
  }

  create(revealInput: RevealElementInput) {
    this.#tokensList.push({ token: revealInput.token });
    const element = new RevealSkyflowElement(revealInput);
    this.#elementList.push(element);
    return element;
  }

  reveal() {
    return new Promise((rootResolve, rootReject) => {
      fetchRecordsByTokenId(this.#skyflowClient, this.#tokensList).then(
        (resolvedResult) => {
          const formattedResult = formatRecordsForIframe(resolvedResult);
          this.setRevealValuesInElements(formattedResult);
          rootResolve(formatRecordsForClient(resolvedResult));
        },
        (rejectedResult) => {
          const formattedResult = formatRecordsForIframe(rejectedResult);
          this.setRevealValuesInElements(formattedResult);
          rootReject(formatRecordsForClient(rejectedResult));
        }
      );
    });
  }

  private setRevealValuesInElements(revealedResult) {
    this.#elementList.forEach((current) => {
      if (
        Object.prototype.hasOwnProperty.call(revealedResult, current.getToken())
      ) {
        const revealedValue = revealedResult[current.getToken()];
        current.setRevealValue(revealedValue);
      } else {
        current.setError();
      }
    });
  }
}

export default RevealContainer;

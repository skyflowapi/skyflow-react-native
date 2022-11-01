/*
 Copyright (c) 2022 Skyflow, Inc.
*/
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  validateInitConfig,
  validateRevealElementRecords,
} from '../../core-utils/element-validations';
import {
  fetchRecordsByTokenId,
  formatRecordsForClient,
  formatRecordsForIframe,
} from '../../core-utils/reveal';
import {
  IRevealRecord,
  MessageType,
  RevealElementInput,
} from '../../utils/constants';
import logs from '../../utils/logs';
import { parameterizedString, printLog } from '../../utils/logs-helper';
import Container from '../Container';
import RevealSkyflowElement from '../RevealSkyflowElement';
import Skyflow from '../Skyflow';

const CLASS_NAME = 'RevealContainer';

class RevealContainer extends Container {
  #revealRecords: RevealElementInput[];
  #tokensList: IRevealRecord[];
  #elementList: RevealSkyflowElement[];
  #skyflowClient: Skyflow;

  constructor(skyflowClient: Skyflow) {
    super();
    this.#skyflowClient = skyflowClient;
    this.#tokensList = [];
    this.#elementList = [];
    this.#revealRecords = [];
  }

  create(revealInput: RevealElementInput) {
    this.#revealRecords.push(revealInput);
    this.#tokensList.push({ token: revealInput.token });
    const element = new RevealSkyflowElement(revealInput);
    this.#elementList.push(element);
    return element;
  }

  reveal() {
    printLog(
      logs.infoLogs.REVEAL_METHOD_INVOKED,
      MessageType.LOG,
      this.#skyflowClient.getLogLevel()
    );
    return new Promise((rootResolve, rootReject) => {
      try {
        validateInitConfig(this.#skyflowClient.getSkyflowConfig());
        validateRevealElementRecords(this.#revealRecords);
        fetchRecordsByTokenId(this.#skyflowClient, this.#tokensList).then(
          (resolvedResult) => {
            const formattedResult = formatRecordsForIframe(resolvedResult);
            this.setRevealValuesInElements(formattedResult);
            printLog(
              parameterizedString(
                logs.infoLogs.REVEAL_SUBMIT_SUCCESS,
                CLASS_NAME
              ),
              MessageType.LOG,
              this.#skyflowClient.getLogLevel()
            );
            rootResolve(formatRecordsForClient(resolvedResult));
          },
          (rejectedResult) => {
            const formattedResult = formatRecordsForIframe(rejectedResult);
            this.setRevealValuesInElements(formattedResult);
            printLog(
              logs.errorLogs.FAILED_REVEAL,
              MessageType.ERROR,
              this.#skyflowClient.getLogLevel()
            );
            rootReject(formatRecordsForClient(rejectedResult));
          }
        );
      } catch (err) {
        rootReject(err);
      }
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

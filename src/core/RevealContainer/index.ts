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
  ContainerType,
  Env,
  IRevealRecord,
  LogLevel,
  MessageType,
  RevealElementInput,
} from '../../utils/constants';
import logs from '../../utils/logs';
import { parameterizedString, printLog } from '../../utils/logs-helper';
import Container from '../Container';
import RevealSkyflowElement from '../RevealSkyflowElement';
import Skyflow from '../Skyflow';
import uuid from 'react-native-uuid';

const CLASS_NAME = 'RevealContainer';

class RevealContainer extends Container {
  type: string = ContainerType.REVEAL;

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
    const revealElementId = uuid.v4() as string;
    this.#revealRecords.push(revealInput);
    this.#tokensList.push({
      token: revealInput.token,
      redaction: revealInput?.redaction,
      elementId: revealElementId,
    });
    const element = new RevealSkyflowElement({
      ...revealInput,
      elementId: revealElementId,
    });
    this.#elementList.push(element);
    return element;
  }

  reveal() {
    printLog(
      logs.infoLogs.REVEAL_METHOD_INVOKED,
      MessageType.LOG,
      this.getContext().logLevel
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
              this.getContext().logLevel
            );
            rootResolve(formatRecordsForClient(resolvedResult));
          },
          (rejectedResult) => {
            const formattedResult = formatRecordsForIframe(rejectedResult);
            this.setRevealValuesInElements(formattedResult);
            printLog(
              logs.errorLogs.FAILED_REVEAL,
              MessageType.ERROR,
              this.getContext().logLevel
            );
            rootReject(formatRecordsForClient(rejectedResult));
          }
        );
      } catch (err) {
        rootReject(err);
      }
    });
  }

  getContext() {
    return {
      env: this.#skyflowClient?.getEnv() || Env.PROD,
      logLevel: this.#skyflowClient?.getLogLevel() || LogLevel.ERROR,
    };
  }

  private setRevealValuesInElements(revealedResult) {
    this.#elementList.forEach((current) => {
      if (
        Object.prototype.hasOwnProperty.call(revealedResult, current.elementId)
      ) {
        const revealedValue = revealedResult[current.elementId];
        current.setRevealValue(revealedValue);
      } else {
        current.setError();
      }
    });
  }
}

export default RevealContainer;

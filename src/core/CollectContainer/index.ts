/*
 Copyright (c) 2022 Skyflow, Inc.
*/
/* eslint-disable @typescript-eslint/no-unused-vars */
import { tokenize } from '../../core-utils/collect';
import {
  validateAdditionalFieldsInCollect,
  validateInitConfig,
} from '../../core-utils/element-validations';
import {
  CollectElementInput,
  ICollectOptions,
  LogLevel,
  MessageType,
} from '../../utils/constants';
import logs from '../../utils/logs';
import { parameterizedString, printLog } from '../../utils/logs-helper';
import SkyflowError from '../../utils/skyflow-error';
import SKYFLOW_ERROR_CODE from '../../utils/skyflow-error-code';
import CollectElement from '../CollectElement';
import Container from '../Container';
import type Skyflow from '../Skyflow';

const CLASS_NAME = 'CollectContainer';
class CollectContainer extends Container {
  #elementsList: CollectElement[];

  #skyflowClient: Skyflow;

  constructor(skyflowClient: Skyflow) {
    super();
    this.#elementsList = [];
    this.#skyflowClient = skyflowClient;
    printLog(
      parameterizedString(logs.infoLogs.COLLECT_CONTAINER_CREATED, CLASS_NAME),
      MessageType.LOG,
      this.#skyflowClient.getLogLevel()
    );
  }

  create(elementInput: CollectElementInput, options?: any) {
    const element = new CollectElement(elementInput, options, {
      env: this.#skyflowClient.getEnv(),
      LogLevel: this.#skyflowClient.getLogLevel(),
    });
    this.#elementsList.push(element);
    return element;
  }

  collect(options: ICollectOptions = { tokens: true }) {
    printLog(
      logs.infoLogs.COLLECT_METHOD_INVOKED,
      MessageType.LOG,
      this.#skyflowClient.getLogLevel()
    );
    return new Promise((rootResolve, rootReject) => {
      try {
        validateInitConfig(this.#skyflowClient.getSkyflowConfig());
        this.#elementsList.forEach((element) => {
          element.isValidElement();
        });
        if (options?.additionalFields) {
          validateAdditionalFieldsInCollect(options.additionalFields);
        }
        if (options && options.tokens && typeof options.tokens !== 'boolean') {
          throw new SkyflowError(
            SKYFLOW_ERROR_CODE.INVALID_TOKENS_IN_COLLECT,
            [],
            true
          );
        }
        tokenize(this.#skyflowClient, this.#elementsList, {
          ...options,
          tokens: options?.tokens !== undefined ? options.tokens : true,
        })
          .then((response) => {
            printLog(
              parameterizedString(
                logs.infoLogs.COLLECT_SUBMIT_SUCCESS,
                CLASS_NAME
              ),
              MessageType.LOG,
              this.#skyflowClient.getLogLevel()
            );
            rootResolve(response);
          })
          .catch((err) => {
            printLog(
              `${JSON.stringify(err)}`,
              MessageType.ERROR,
              this.#skyflowClient.getLogLevel()
            );
            rootReject(err);
          });
      } catch (err) {
        printLog(
          `${err.message}`,
          MessageType.ERROR,
          this.#skyflowClient.getLogLevel()
        );
        rootReject(err);
      }
    });
  }

  getContext() {
    return {
      env: this.#skyflowClient.getEnv(),
      logLevel: this.#skyflowClient.getLogLevel(),
    };
  }
}

export default CollectContainer;

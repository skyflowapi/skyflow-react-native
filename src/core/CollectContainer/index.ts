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
  Env,
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
      this.getContext().logLevel
    );
  }

  create(elementInput: CollectElementInput, options?: any) {
    const element = new CollectElement(
      elementInput,
      options,
      this.getContext()
    );
    this.#elementsList.push(element);
    return element;
  }

  collect(options: ICollectOptions = { tokens: true }) {
    printLog(
      logs.infoLogs.COLLECT_METHOD_INVOKED,
      MessageType.LOG,
      this.getContext().logLevel
    );
    return new Promise((rootResolve, rootReject) => {
      try {
        if (this.#elementsList.length === 0) {
          throw new SkyflowError(
            SKYFLOW_ERROR_CODE.EMPTY_COLLECT_ELEMENTS,
            [],
            true
          );
        }
        validateInitConfig(this.#skyflowClient?.getSkyflowConfig());
        this.#elementsList.forEach((element) => {
          element.triggerValidations();
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
              this.getContext().logLevel
            );
            rootResolve(response);
          })
          .catch((err) => {
            printLog(
              `${JSON.stringify(err)}`,
              MessageType.ERROR,
              this.getContext().logLevel
            );
            rootReject(err);
          });
      } catch (err) {
        printLog(
          `${err.message}`,
          MessageType.ERROR,
          this.getContext().logLevel
        );
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
}

export default CollectContainer;

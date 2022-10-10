/*
 Copyright (c) 2022 Skyflow, Inc.
*/
import Client from '../../core-utils/client';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Env, IConfig, LogLevel, MessageType } from '../../utils/constants';
import isTokenValid from '../../utils/jwt-utils';
import logs from '../../utils/logs';
import { printLog, parameterizedString } from '../../utils/logs-helper';
import SkyflowError from '../../utils/skyflow-error';
import SKYFLOW_ERROR_CODE from '../../utils/skyflow-error-code';

const CLASS_NAME = 'Skyflow';

class Skyflow {
  #client: Client;
  #config: IConfig;
  #bearerToken: string = '';

  constructor(config: IConfig) {
    this.#client = new Client();
    const options = {
      logLevel: config?.options?.logLevel || LogLevel.ERROR,
      env: config?.options?.env || Env.PROD,
    };
    this.#config = {
      ...config,
      options,
    };
  }

  getAccessToken() {
    return new Promise((resolve, reject) => {
      if (this.#bearerToken && isTokenValid(this.#bearerToken)) {
        printLog(
          parameterizedString(logs.infoLogs.REUSE_BEARER_TOKEN, CLASS_NAME),
          MessageType.LOG,
          this.#config.options.logLevel
        );
        resolve(this.#bearerToken);
      } else {
        try {
          this.#config
            .getBearerToken()
            .then((bearerToken) => {
              if (isTokenValid(bearerToken)) {
                this.#bearerToken = bearerToken;
                printLog(
                  parameterizedString(
                    logs.infoLogs.BEARER_TOKEN_RESOLVED,
                    CLASS_NAME
                  ),
                  MessageType.LOG,
                  this.#config.options.logLevel
                );
                resolve(this.#bearerToken);
              } else {
                printLog(
                  logs.errorLogs.INVALID_BEARER_TOKEN,
                  MessageType.ERROR,
                  this.#config.options.logLevel
                );
                reject(logs.errorLogs.INVALID_BEARER_TOKEN);
              }
            })
            .catch((err) => {
              printLog(
                logs.errorLogs.BEARER_TOKEN_REJECTED,
                MessageType.ERROR,
                this.#config.options.logLevel
              );
              reject(err);
            });
        } catch (err) {
          reject(
            new SkyflowError(
              SKYFLOW_ERROR_CODE.GET_BEARER_TOKEN_INVALID_RETURN,
              [],
              true
            )
          );
        }
      }
    });
  }

  getSkyflowConfig() {
    return this.#config;
  }

  getVaultID() {
    return this.#config.vaultID;
  }

  getVaultURL() {
    return this.#config.vaultURL;
  }

  getLogLevel() {
    return this.#config.options.logLevel;
  }

  getEnv() {
    return this.#config.options.env;
  }

  getHttpClient() {
    return this.#client;
  }
}

export default Skyflow;

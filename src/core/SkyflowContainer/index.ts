import {
  validateGetInput,
  validateInitConfig,
} from '../../core-utils/element-validations';
import { fetchRecordsGET } from '../../core-utils/reveal';
import {
  IConfig,
  IGetInput,
  IGetOptions,
  IGetRecord,
  MessageType,
  PUREJS_TYPES,
} from '../../utils/constants';
import logs from '../../utils/logs';
import { parameterizedString, printLog } from '../../utils/logs-helper';
import Skyflow from '../Skyflow';

const CLASS_NAME = 'SkyflowContainer';

class SkyflowContainer {
  #config: IConfig;

  #skyflowClient: Skyflow;

  constructor(skyflowClient: Skyflow) {
    this.#skyflowClient = skyflowClient;
    this.#config = skyflowClient.getSkyflowConfig();
  }

  get(getInput: IGetInput, options: IGetOptions) {
    return new Promise((resolve, reject) => {
      validateInitConfig(this.#config);
      try {
        printLog(
          parameterizedString(logs.infoLogs.VALIDATE_GET_INPUT, CLASS_NAME),
          MessageType.LOG,
          this.#config.options.logLevel
        );

        validateGetInput(getInput, options);
        printLog(
          parameterizedString(
            logs.infoLogs.EMIT_PURE_JS_REQUEST,
            CLASS_NAME,
            PUREJS_TYPES.GET
          ),
          MessageType.LOG,
          this.#config.options.logLevel
        );

        fetchRecordsGET(
          this.#skyflowClient,
          getInput.records as IGetRecord[],
          options
        ).then(
          (resolvedResult: any) => {
            printLog(
              parameterizedString(logs.infoLogs.GET_RESOLVED, CLASS_NAME),
              MessageType.LOG,
              this.#config.options.logLevel
            );

            resolve(resolvedResult);
          },
          (rejectedResult: any) => {
            if (rejectedResult.records === undefined) {
              printLog(
                logs.errorLogs.GET_REJECTED,
                MessageType.ERROR,
                this.#config.options.logLevel
              );
            } else {
              printLog(
                parameterizedString(logs.infoLogs.GET_RESOLVED, CLASS_NAME),
                MessageType.LOG,
                this.#config.options.logLevel
              );
            }
            return reject(rejectedResult);
          }
        );
      } catch (e) {
        printLog(e.message, MessageType.ERROR, this.#config.options.logLevel);
        reject(e);
      }
    });
  }
}

export default SkyflowContainer;

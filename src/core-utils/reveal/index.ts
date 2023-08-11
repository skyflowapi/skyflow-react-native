/*
 Copyright (c) 2022 Skyflow, Inc.
*/
/* eslint-disable @typescript-eslint/no-unused-vars */
import Skyflow from '../../core/Skyflow';
import {
  type IRevealRecord,
  type IRevealResponseType,
  LogLevel,
  MessageType,
  RedactionType,
  IGetRecord,
  IGetOptions,
} from '../../utils/constants';
import { printLog } from '../../utils/logs-helper';
import SkyflowError from '../../utils/skyflow-error';

interface IApiSuccessResponse {
  records: [
    {
      token: string;
      valueType: string;
      value: string;
    }
  ];
}

const formatForPureJsSuccess = (response: IApiSuccessResponse) => {
  const currentResponseRecords = response.records;
  return currentResponseRecords.map((record) => ({
    token: record.token,
    value: record.value,
  }));
};

const formatForPureJsFailure = (cause, tokenId: string) => ({
  token: tokenId,
  ...new SkyflowError(
    {
      code: cause?.error?.code,
      description: cause?.error?.description,
    },
    [],
    true
  ),
});

const getTokenRecordsFromVault = (
  skyflowClient: Skyflow,
  tokenRecord: IRevealRecord,
  authToken: string
): Promise<any> => {
  const vaultEndPointurl: string = `${skyflowClient.getVaultURL()}/v1/vaults/${skyflowClient.getVaultID()}/detokenize`;
  return skyflowClient.getHttpClient().request({
    requestMethod: 'POST',
    url: vaultEndPointurl,
    headers: {
      'authorization': `Bearer ${authToken}`,
      'content-type': 'application/json',
    },
    body: {
      detokenizationParameters: [
        {
          token: tokenRecord.token,
          redaction: tokenRecord?.redaction || RedactionType.PLAIN_TEXT,
        },
      ],
    },
  });
};

export const fetchRecordsByTokenId = (
  skyflowClient: Skyflow,
  tokenIdRecords: IRevealRecord[]
): Promise<IRevealResponseType> => {
  return new Promise((rootResolve, rootReject) => {
    skyflowClient
      .getAccessToken()
      .then((authToken) => {
        const vaultResponseSet: Promise<any>[] = tokenIdRecords.map(
          (tokenRecord) =>
            new Promise((resolve) => {
              const apiResponse: any = [];
              getTokenRecordsFromVault(
                skyflowClient,
                tokenRecord,
                authToken as string
              )
                .then(
                  (response: IApiSuccessResponse) => {
                    const fieldsData = formatForPureJsSuccess(response);
                    apiResponse.push(...fieldsData);
                  },
                  (cause: any) => {
                    const errorData = formatForPureJsFailure(
                      cause,
                      tokenRecord.token
                    );
                    printLog(
                      errorData.error?.description || '',
                      MessageType.ERROR,
                      LogLevel.ERROR
                    );
                    apiResponse.push(errorData);
                  }
                )
                .finally(() => {
                  resolve(apiResponse);
                });
            })
        );

        Promise.all(vaultResponseSet)
          .then((resultSet) => {
            const recordsResponse: Record<string, any>[] = [];
            const errorResponse: Record<string, any>[] = [];
            resultSet.forEach((result) => {
              result.forEach((res: Record<string, any>) => {
                if (Object.prototype.hasOwnProperty.call(res, 'error')) {
                  errorResponse.push(res);
                } else {
                  recordsResponse.push(res);
                }
              });
            });
            if (errorResponse.length === 0) {
              rootResolve({ records: recordsResponse });
            } else if (recordsResponse.length === 0)
              rootReject({ errors: errorResponse });
            else
              rootReject({ records: recordsResponse, errors: errorResponse });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        rootReject(err);
      });
  });
};

export const formatRecordsForIframe = (response: IRevealResponseType) => {
  const result: Record<string, string> = {};
  if (response.records) {
    response.records.forEach((record) => {
      result[record.token] = record.value;
    });
  }
  return result;
};

export const formatRecordsForClient = (response: IRevealResponseType) => {
  if (response.records) {
    const successRecords = response.records.map((record) => ({
      token: record.token,
    }));
    if (response.errors)
      return { success: successRecords, errors: response.errors };
    return { success: successRecords };
  }
  return { errors: response.errors };
};

export const fetchRecordsGET = async (
  skyflowClient: Skyflow,
  skyflowIdRecords: IGetRecord[],
  options: IGetOptions
) =>
  new Promise((rootResolve, rootReject) => {
    let vaultResponseSet: Promise<any>[];
    skyflowClient
      .getAccessToken()
      .then((authToken) => {
        vaultResponseSet = skyflowIdRecords.map(
          (skyflowIdRecord) =>
            new Promise((resolve, reject) => {
              getRecordsFromVault(
                skyflowIdRecord,
                options,
                skyflowClient,
                authToken as string
              )
                .then(
                  (resolvedResult: any) => {
                    const response: any[] = [];
                    const recordsData: any[] = resolvedResult.records;
                    recordsData.forEach((fieldData) => {
                      const id = fieldData.fields.skyflow_id;
                      const currentRecord = {
                        fields: {
                          id,
                          ...fieldData.fields,
                        },
                        table: skyflowIdRecord.table,
                      };
                      delete currentRecord.fields.skyflow_id;
                      response.push(currentRecord);
                    });
                    resolve(response);
                  },
                  (rejectedResult) => {
                    let errorResponse = rejectedResult;
                    if (rejectedResult && rejectedResult.error) {
                      errorResponse = {
                        error: {
                          code: rejectedResult?.error?.code,
                          description: rejectedResult?.error?.description,
                        },
                        ids: skyflowIdRecord.ids,
                        ...(skyflowIdRecord?.columnName
                          ? { columnName: skyflowIdRecord?.columnName }
                          : {}),
                      };
                    }
                    printLog(
                      rejectedResult.error?.description || '',
                      MessageType.ERROR,
                      LogLevel.ERROR
                    );
                    reject(errorResponse);
                  }
                )
                .catch((error) => {
                  reject(error);
                });
            })
        );
        Promise.allSettled(vaultResponseSet).then((resultSet) => {
          const recordsResponse: any[] = [];
          const errorsResponse: any[] = [];
          resultSet.forEach((result) => {
            if (result.status === 'fulfilled') {
              recordsResponse.push(...result.value);
            } else {
              errorsResponse.push(result.reason);
            }
          });
          if (errorsResponse.length === 0) {
            rootResolve({ records: recordsResponse });
          } else if (recordsResponse.length === 0)
            rootReject({ errors: errorsResponse });
          else rootReject({ records: recordsResponse, errors: errorsResponse });
        });
      })
      .catch((err) => {
        rootReject(err);
      });
  });

export const getRecordsFromVault = (
  getRecord: IGetRecord,
  options: IGetOptions,
  skyflowClient: Skyflow,
  authToken: string
) => {
  let paramList: string = '';
  const client = skyflowClient.getHttpClient();
  const config = skyflowClient.getSkyflowConfig();

  getRecord.ids?.forEach((skyflowId) => {
    paramList += `skyflow_ids=${skyflowId}&`;
  });

  getRecord.columnValues?.forEach((column) => {
    paramList += `column_name=${getRecord.columnName}&column_values=${column}&`;
  });

  if (options && Object.prototype.hasOwnProperty.call(options, 'tokens')) {
    paramList += `tokenization=${options.tokens}&`;
  }

  if (getRecord?.redaction) {
    paramList += `redaction=${getRecord.redaction}`;
  }

  const vault = config.vaultURL;
  const vaultEndPointurl: string = `${vault}/v1/vaults/${config.vaultID}/${getRecord.table}?${paramList}`;

  return client.request({
    requestMethod: 'GET',
    url: vaultEndPointurl,
    headers: {
      'authorization': `Bearer ${authToken}`,
      'content-type': 'application/json',
    },
  });
};

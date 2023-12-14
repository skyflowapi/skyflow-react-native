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

const formatForPureJsSuccess = (
  response: IApiSuccessResponse,
  elementId: string
) => {
  const currentResponseRecords = response.records;
  return currentResponseRecords.map((record) => ({
    token: record.token,
    value: record.value,
    valueType: record?.valueType,
    elementId,
  }));
};

const formatForPureJsFailure = (cause, tokenId: string, elementId: string) => ({
  token: tokenId,
  ...new SkyflowError(
    {
      code: cause?.error?.code,
      description: cause?.error?.description,
    },
    [],
    true
  ),
  elementId,
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
                    const fieldsData = formatForPureJsSuccess(
                      response,
                      tokenRecord.elementId
                    );
                    apiResponse.push(...fieldsData);
                  },
                  (cause: any) => {
                    const errorData = formatForPureJsFailure(
                      cause,
                      tokenRecord.token,
                      tokenRecord.elementId
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
      result[record.elementId] = record.value;
    });
  }
  return result;
};

export const formatRecordsForClient = (response: IRevealResponseType) => {
  let errorRecords;
  if (response?.errors) {
    errorRecords = response?.errors?.map((currentError) => ({
      token: currentError?.token,
      error: currentError?.error,
    }));
  }
  if (response.records) {
    const successRecords = response.records.map((record) => ({
      token: record.token,
      valueType: record.valueType,
    }));
    if (errorRecords) return { success: successRecords, errors: errorRecords };
    return { success: successRecords };
  }
  return { errors: errorRecords };
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
              const response: any[] = [];
              getRecordsFromVault(
                skyflowIdRecord,
                options,
                skyflowClient,
                authToken as string
              )
                .then(
                  (resolvedResult: any) => {
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
                    response.push(errorResponse);
                  }
                )
                .finally(() => {
                  resolve(response);
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
      authorization: `Bearer ${authToken}`,
    },
  });
};

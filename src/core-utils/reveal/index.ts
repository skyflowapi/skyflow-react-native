/* eslint-disable @typescript-eslint/no-unused-vars */
import Skyflow from '../../core/Skyflow';
import {
  type IRevealRecord,
  type IRevealResponseType,
  LogLevel,
  MessageType,
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
  token: string,
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
          token,
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
                tokenRecord.token,
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

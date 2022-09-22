/* eslint-disable @typescript-eslint/no-unused-vars */
import CollectElement from '../../core/CollectElement';
import _ from 'lodash';
import Skyflow from '../../core/Skyflow';
const set = require('set-value');

export const constructInsertRecordRequest = (
  records: any,
  options: Record<string, any> = { tokens: true }
) => {
  const requestBody: any = [];
  if (options?.tokens || options === null) {
    records.records.forEach((record: any, index: any) => {
      requestBody.push({
        method: 'POST',
        quorum: true,
        tableName: record.table,
        fields: record.fields,
      });
      requestBody.push({
        method: 'GET',
        tableName: record.table,
        ID: `$responses.${2 * index}.records.0.skyflow_id`,
        tokenization: true,
      });
    });
  } else {
    records.records.forEach((record: any) => {
      requestBody.push({
        method: 'POST',
        quorum: true,
        tableName: record.table,
        fields: record.fields,
      });
    });
  }
  return requestBody;
};

export const constructInsertRecordResponse = (
  responseBody: any,
  tokens: boolean,
  records: any[]
) => {
  if (tokens) {
    return {
      records: responseBody.responses
        .map((res: any, index: number) => {
          if (index % 2 !== 0) {
            const skyflowId =
              responseBody.responses[index - 1].records[0].skyflow_id;
            delete res.fields['*'];
            return {
              table: records[Math.floor(index / 2)].table,
              fields: {
                skyflow_id: skyflowId,
                ...res.fields,
              },
            };
          }
          return res;
        })
        .filter((record: any, index: number) => index % 2 !== 0),
    };
  }

  return {
    records: responseBody.responses.map((res: any, index: number) => ({
      table: records[index].table,
      skyflow_id: res.records[0].skyflow_id,
    })),
  };
};

export const constructElementsInsertReq = (req: any, options: any) => {
  const records: any[] = [];

  const tables = Object.keys(req);
  tables.forEach((table) => {
    records.push({
      table,
      fields: req[table],
    });
  });
  return { records };
};

export const insertRequest = (
  skyflowClient: Skyflow,
  insertRecords: any,
  options: any
) => {
  const tokenizeRequestBody = constructInsertRecordRequest(
    insertRecords,
    options
  );
  return new Promise((rootResolve, rootReject) => {
    skyflowClient
      .getAccessToken()
      .then((authToken) => {
        skyflowClient
          .getHttpClient()
          .request({
            body: {
              records: tokenizeRequestBody,
            },
            requestMethod: 'POST',
            url: `${skyflowClient.getVaultURL()}/v1/vaults/${skyflowClient.getVaultID()}`,
            headers: {
              'authorization': `Bearer ${authToken}`,
              'content-type': 'application/json',
            },
          })
          .then((response: any) => {
            rootResolve(
              constructInsertRecordResponse(
                response,
                options.tokens,
                insertRecords.records
              )
            );
          })
          .catch((error) => {
            rootReject(error);
          });
      })
      .catch((err) => {
        rootReject(err);
      });
  });
};

export const tokenize = (
  skyflowClient: Skyflow,
  elementList: CollectElement[],
  options: any
) => {
  const elementsData: Record<string, any> = {};

  // TODO: check valid state of elements
  // TODO: check duplicate elements
  let errorMessage = '';
  elementList.forEach((currentElement) => {
    if (!currentElement.getInternalState().isValid) {
      errorMessage += `${currentElement.getElementInput().column}: ${
        currentElement.errorText
      } `;
    }
  });
  if (errorMessage.length > 0) {
    return Promise.reject({
      code: 400,
      description: `Interface: collect container - Provide complete and valid inputs for ${errorMessage}`,
    });
  }

  elementList.forEach((currentElement: CollectElement) => {
    const { table, column } = currentElement.getElementInput();
    if (elementsData[table]) {
      set(elementsData[table], column, currentElement.getInternalState().value);
    } else {
      elementsData[table] = {};
      set(elementsData[table], column, currentElement.getInternalState().value);
    }
  });

  const constructedRecords = constructElementsInsertReq(elementsData, options);

  return insertRequest(skyflowClient, constructedRecords, options);
};

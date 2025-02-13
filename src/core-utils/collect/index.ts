/*
 Copyright (c) 2022 Skyflow, Inc.
*/
/* eslint-disable @typescript-eslint/no-unused-vars */
import CollectElement from '../../core/CollectElement';
import _ from 'lodash';
import Skyflow from '../../core/Skyflow';
import SkyflowError from '../../utils/skyflow-error';
import SKYFLOW_ERROR_CODE from '../../utils/skyflow-error-code';
import { IInsertRecord, IInsertResponse } from '../../../src/utils/constants';
import omit from 'lodash/omit';
const set = require('set-value');

const getUpsertColumn = (tableName: string, options: Record<string, any>) => {
  let uniqueColumn = '';
  options?.upsert?.forEach((upsertOptions) => {
    if (tableName === upsertOptions.table) {
      uniqueColumn = upsertOptions.column;
    }
  });
  return uniqueColumn;
};

export const constructInsertRecordRequest = (
  records: any,
  options: Record<string, any> = { tokens: true }
) => {
  const requestBody: any = [];
  if (options?.tokens || options === null) {
    records.records.forEach((record: any, index: any) => {
      const upsertColumn = getUpsertColumn(record.table, options);
      requestBody.push({
        method: 'POST',
        quorum: true,
        tableName: record.table,
        fields: record.fields,
        ...(options?.upsert ? { upsert: upsertColumn } : {}),
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
      const upsertColumn = getUpsertColumn(record.table, options);
      requestBody.push({
        method: 'POST',
        quorum: true,
        tableName: record.table,
        fields: record.fields,
        ...(options?.upsert ? { upsert: upsertColumn } : {}),
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

const keyify = (obj, prefix = '') =>
  Object.keys(obj).reduce((res: any, el) => {
    if (Array.isArray(obj[el])) {
      return [...res, prefix + el];
    }
    if (typeof obj[el] === 'object' && obj[el] !== null) {
      return [...res, ...keyify(obj[el], `${prefix + el}.`)];
    }
    return [...res, prefix + el];
  }, []);

export const checkDuplicateColumns = (additionalColumns, columns, table) => {
  const keys = keyify(additionalColumns);
  keys.forEach((key) => {
    const value = _.get(columns, key);
    if (value) {
      throw new SkyflowError(
        SKYFLOW_ERROR_CODE.DUPLICATE_ELEMENT,
        [`${key}`, `${table}`],
        true
      );
    }
  });
};

export const constructElementsUpdateReq = (update: any, options: any) => {
  const updateRecords: IInsertRecord[] = [];
  let ids = Object.keys(update);
  const additionalFields = options?.additionalFields;
  if(additionalFields) {
    // merge additional fields in req
    additionalFields.records.forEach((record)=>{
      if(record.fields.skyflowID) {
        if(ids.includes(record.fields.skyflowID)) {
          checkDuplicateColumns(
            record.fields, update[record.fields.skyflowID], record.table,
          );
          const temp = record.fields;
          _.merge(temp, update[record.fields.skyflowID]);
          update[record.fields.skyflowID] = temp;
        } else {
          update[record.fields.skyflowID] = {
            ...record.fields,
            table: record.table,
          };
        }
      }
    })
  }

  ids = Object.keys(update);
  ids.forEach((id) => {
    updateRecords.push({
      table: update[id].table,
      fields: update[id],
      skyflowID: id,
    });
  });
  return { updateRecords };
};

export const constructElementsInsertReq = (req: any, options: any) => {
  const records: any[] = [];

  let tables = Object.keys(req);
  const additionalFields = options?.additionalFields;
  if (additionalFields) {
    // merge additionalFields in req
    additionalFields.records.forEach((record) => {
      if(!record.fields.skyflowID) {
        if (tables.includes(record.table)) {
          checkDuplicateColumns(record.fields, req[record.table], record.table);
          const temp = record.fields;
          _.merge(temp, req[record.table]);
          req[record.table] = temp;
        } else {
          req[record.table] = record.fields;
        }
      }
    });
  }
  tables = Object.keys(req);
  tables.forEach((table) => {
    records.push({
      table,
      fields: req[table],
    });
  });
  return { records };
};

export const tokenize = (
  skyflowClient: Skyflow,
  elementList: CollectElement[],
  options: any
) => {
  const elementsData: Record<string, any> = {};
  const elementsUpdateData: Record<string, any> = {};
  let errorMessage = '';
  elementList.forEach((currentElement) => {
    if (!currentElement.getInternalState().isValid) {
      errorMessage += `${
        currentElement.getElementInput().column
      }: ${currentElement.getErrorText()} `;
    }
  });
  if (errorMessage.length > 0) {
    return Promise.reject(
      new SkyflowError(
        SKYFLOW_ERROR_CODE.COMPLETE_AND_VALID_INPUTS,
        [errorMessage],
        true
      )
    );
  }

  elementList.forEach((currentElement: CollectElement) => {
    const { table, column, skyflowID } = currentElement.getElementInput();
    if(skyflowID || skyflowID==="") {
      if(skyflowID === '' || skyflowID === null) {
        return Promise.reject(new SkyflowError(
          SKYFLOW_ERROR_CODE.EMPTY_SKYFLOW_ID_COLLECT,
          [],
          true
        ));
      }
      if(elementsUpdateData[skyflowID]) {
        set(
          elementsUpdateData[skyflowID],
          column,
          currentElement.getInternalState().value,
        );
      } else {
        elementsUpdateData[skyflowID] = {};
        set(
          elementsUpdateData[skyflowID],
          column,
          currentElement.getInternalState().value,
        );
        set(
          elementsUpdateData[skyflowID],
          'table',
          table,
        );
      }
    }
    else if (elementsData[table]) {
      set(elementsData[table], column, currentElement.getInternalState().value);
    } else {
      elementsData[table] = {};
      set(elementsData[table], column, currentElement.getInternalState().value);
    }
  });

  let constructedRecords;
  let constructedUpdateRecords;
  let finalInsertRequest;
  let insertResponse: IInsertResponse;
  let updateResponse: IInsertResponse;
  let insertErrorResponse: any;
  let updateErrorResponse: any;
  let insertDone = false;
  let updateDone = false;

  try {
    constructedRecords = constructElementsInsertReq(elementsData, options);
    constructedUpdateRecords = constructElementsUpdateReq(elementsUpdateData, options);
    finalInsertRequest = constructInsertRecordRequest(constructedRecords, options);
  } catch (error) {
    return Promise.reject(error);
  }

  const sendRequest = ()  => new Promise((rootResolve, rootReject)=>{
    const tokenizeRequestBody = constructInsertRecordRequest(
      constructedRecords,
      options
    );

    skyflowClient.getAccessToken().then((authToken)=>{
      if(finalInsertRequest.length!=0) {
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
          insertResponse = constructInsertRecordResponse(
            response,
            options.tokens,
            constructedRecords.records
          );
          insertDone = true;
          if (constructedUpdateRecords.updateRecords.length === 0) {
            rootResolve(insertResponse);
          }
          if (updateDone && updateErrorResponse !== undefined) {
            if (updateErrorResponse.records === undefined) {
              updateErrorResponse.records = insertResponse.records;
            } else {
              updateErrorResponse.records = insertResponse.records
                .concat(updateErrorResponse.records);
            }
            rootReject(updateErrorResponse);
          } else if (updateDone && updateResponse !== undefined) {
            rootResolve({ records: insertResponse.records.concat(updateResponse.records) });
          }
        })
        .catch((error) => {
          insertDone = true;
          if (constructedUpdateRecords.updateRecords.length === 0) {
            rootReject(error);
          } else {
            insertErrorResponse = {
              errors: [
                {
                  error: {
                    code: error?.error?.code,
                    description: error?.error?.description,
                  },
                },
              ],
            };
          }
          if (updateDone && updateResponse !== undefined) {
            const errors = insertErrorResponse.errors;
            const records = updateResponse.records;
            rootReject({ errors, records });
          } else if (updateDone && updateErrorResponse !== undefined) {
            updateErrorResponse.errors = updateErrorResponse.errors
              .concat(insertErrorResponse.errors);
            rootReject(updateErrorResponse);
          }
        });
      }
      if(constructedUpdateRecords.updateRecords.length !== 0) {
        updateRecordsBySkyflowID(constructedUpdateRecords, skyflowClient, options)
          .then((response: any)=>{
            updateResponse = {
              records: response,
            };
            updateDone = true;
            if (finalInsertRequest.length === 0) {
              rootResolve(updateResponse);
            }
            if (insertDone && insertResponse !== undefined) {
              rootResolve({ records: insertResponse.records.concat(updateResponse.records) });
            } else if (insertDone && insertErrorResponse !== undefined) {
              const errors = insertErrorResponse.errors;
              const records = updateResponse.records;
              rootReject({ errors, records });
            }
          })
          .catch((error: any)=>{
            updateErrorResponse = error;
            updateDone = true;
            if (finalInsertRequest.length === 0) {
              rootReject(error);
            }
            if (insertDone && insertResponse !== undefined) {
              if (updateErrorResponse.records === undefined) {
                updateErrorResponse.records = insertResponse.records;
              } else {
                updateErrorResponse.records = insertResponse.records
                  .concat(updateErrorResponse.records);
              }
              rootReject(updateErrorResponse);
            } else if (insertDone && insertErrorResponse !== undefined) {
              updateErrorResponse.errors = updateErrorResponse.errors
                .concat(insertErrorResponse.errors);
              rootReject(updateErrorResponse);
            }
          })
      }
    }).catch((err) => {
      rootReject(err);
    });
  }) 

  return new Promise((resolve, reject) => {
    sendRequest()
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};

export const updateRecordsBySkyflowID = async (
  skyflowIdRecords,
  skyflowClient: Skyflow,
  options,
) => new Promise((rootResolve, rootReject) => {
  let updateResponseSet: Promise<any>[];
  skyflowClient.getAccessToken().then((authToken) => {
    updateResponseSet = skyflowIdRecords.updateRecords.map(
      (skyflowIdRecord: IInsertRecord) => new Promise((resolve, reject)=>{
        updateRecordsInVault(skyflowIdRecord, skyflowClient, options)
          .then((resolvedResult: any) => {
            const resp = constructFinalUpdateRecordResponse(
              resolvedResult, options?.tokens, skyflowIdRecord,
            );
            resolve(resp);
          },
          (rejectedResult) => {
            let errorResponse = rejectedResult;
            if (rejectedResult && rejectedResult.error) {
              errorResponse = {
                error: {
                  code: rejectedResult?.error?.code,
                  description: rejectedResult?.error?.description,
                },
              };
            }
            reject(errorResponse);
          }).catch((error) => {
            reject(error);
          });
      })
    );
    Promise.allSettled(updateResponseSet).then((resultSet: any) => {
      const recordsResponse: any[] = [];
      const errorsResponse: any[] = [];
      resultSet.forEach((result: { status: string; value: any; reason?: any; }) => {
        if (result.status === 'fulfilled') {
          recordsResponse.push(result.value);
        } else {
          errorsResponse.push(result.reason);
        }
      });

      if (errorsResponse.length === 0) {
        rootResolve(recordsResponse);
      } else if (recordsResponse.length === 0) rootReject({ errors: errorsResponse });
      else rootReject({ records: recordsResponse, errors: errorsResponse });
    });
  }).catch((err) => {
    rootReject(err);
  });
});

const updateRecordsInVault = (
  skyflowIdRecord: IInsertRecord,
  skyflowClient: Skyflow,
  options,
) => {
  const table = skyflowIdRecord.fields.table;
  const skyflowID = skyflowIdRecord.skyflowID;
  skyflowIdRecord.fields = omit(skyflowIdRecord.fields, 'table');
  skyflowIdRecord.fields = omit(skyflowIdRecord.fields, 'skyflowID');

  return new Promise((rootResolve, rootReject) => {
    skyflowClient
      .getAccessToken()
      .then((authToken) => {
        skyflowClient
          .getHttpClient()
          .request({
            body: {
              record: {
                fields: { ...skyflowIdRecord.fields },
              },
              tokenization: options?.tokens !== undefined ? options.tokens : true,
            },
            requestMethod: 'PUT',
            url: `${skyflowClient.getVaultURL()}/v1/vaults/${skyflowClient.getVaultID()}/${table}/${skyflowID}`, //get table and skyflowID
            headers: {
              'authorization': `Bearer ${authToken}`,
              'content-type': 'application/json',
            },
          })
          .then((response: any) => {
            rootResolve(response);
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

export const constructFinalUpdateRecordResponse = (
  responseBody: any,
  tokens: boolean,
  records: any,
) => {
  if (tokens) {
    return {
      table: records.table,
      fields: {
        skyflow_id: records.skyflowID,
        ...responseBody.tokens,
      },
    };
  }
  return {
    table: records.table,
    skyflow_id: responseBody.skyflow_id,
  };
};
/*
    Copyright (c) 2022 Skyflow, Inc.
*/
import { tokenize } from '../../src/core-utils/collect';
import CollectElement from '../../src/core/CollectElement';
import Skyflow from '../../src/core/Skyflow';
import { ElementType, Env, LogLevel } from '../../src/utils/constants';
import * as ClientModule from '../../src/core-utils/client';
import logs from '../../src/utils/logs';
import SkyflowError from '../../src/utils/skyflow-error';
import SKYFLOW_ERROR_CODE from '../../src/utils/skyflow-error-code';
import { DEFAULT_COLLECT_ELEMENT_ERROR_TEXT } from '../../src/core/constants';

describe('test collect utils class', () => {
  it('test tokenize with tokens true', (done) => {
    const successResponse = {
      responses: [
        { records: [{ skyflow_id: 'test_skyflow_id' }] },
        { fields: { string: 'test_token' } },
      ],
    };

    jest.spyOn(ClientModule, 'default').mockImplementation(() => ({
      request: () => Promise.resolve(successResponse),
    }));

    const testSkyflowClient = new Skyflow({
      vaultID: '1234',
      vaultURL: 'https://url.com',
      getBearerToken: () => Promise.resolve('valid_token'),
    });
    jest
      .spyOn(testSkyflowClient, 'getAccessToken')
      .mockResolvedValue('valid_token');

    const collectElement = new CollectElement(
      { table: 'table1', column: 'string', type: ElementType.INPUT_FIELD },
      {},
      { env: Env.PROD, logLevel: LogLevel.ERROR }
    );

    const collectElement2 = new CollectElement(
      { table: 'table1', column: 'int32', type: ElementType.INPUT_FIELD },
      {},
      { env: Env.PROD, logLevel: LogLevel.ERROR }
    );
    collectElement.onChangeElement('1232');
    collectElement2.onChangeElement('test');

    const tokenizeResponse = tokenize(
      testSkyflowClient,
      [collectElement, collectElement2],
      {
        tokens: true,
      }
    );
    tokenizeResponse
      .then((response) => {
        expect(response.records[0].table).toBe('table1');
        expect(response.records[0].fields.string).toBe('test_token');
        expect(response.records[0].fields.skyflow_id).toBe('test_skyflow_id');
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  it('test tokenize with tokens false', (done) => {
    const successResponse = {
      responses: [{ records: [{ skyflow_id: 'test_skyflow_id' }] }],
    };

    jest.spyOn(ClientModule, 'default').mockImplementation(() => ({
      request: () => Promise.resolve(successResponse),
    }));

    const testSkyflowClient = new Skyflow({
      vaultID: '1234',
      vaultURL: 'https://url.com',
      getBearerToken: () => Promise.resolve('valid_token'),
    });
    jest
      .spyOn(testSkyflowClient, 'getAccessToken')
      .mockResolvedValue('valid_token');

    const collectElement = new CollectElement(
      { table: 'table1', column: 'string', type: ElementType.INPUT_FIELD },
      {},
      { env: Env.PROD, logLevel: LogLevel.ERROR }
    );
    collectElement.onChangeElement('1232');
    const tokenizeResponse = tokenize(testSkyflowClient, [collectElement], {
      tokens: false,
    });
    tokenizeResponse
      .then((response) => {
        expect(response.records[0].table).toBe('table1');
        expect(response.records[0].skyflow_id).toBe('test_skyflow_id');
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('test tokenize with addtional fields', (done) => {
    const successResponse = {
      responses: [
        { records: [{ skyflow_id: 'test_skyflow_id' }] },
        { fields: { string: 'test_token', int32: 'test_int_token' } },
        { records: [{ skyflow_id: 'test_skyflow_id2' }] },
        { fields: { string: 'test_token' } },
      ],
    };

    jest.spyOn(ClientModule, 'default').mockImplementation(() => ({
      request: () => Promise.resolve(successResponse),
    }));

    const testSkyflowClient = new Skyflow({
      vaultID: '1234',
      vaultURL: 'https://url.com',
      getBearerToken: () => Promise.resolve('valid_token'),
    });
    jest
      .spyOn(testSkyflowClient, 'getAccessToken')
      .mockResolvedValue('valid_token');

    const collectElement = new CollectElement(
      { table: 'table1', column: 'string', type: ElementType.INPUT_FIELD },
      {},
      { env: Env.PROD, logLevel: LogLevel.ERROR }
    );
    collectElement.onChangeElement('test_value');
    const tokenizeResponse = tokenize(testSkyflowClient, [collectElement], {
      tokens: true,
      additionalFields: {
        records: [
          { table: 'table1', fields: { int32: 'test_int' } },
          { table: 'table2', fields: { string: 'test_string' } },
        ],
      },
    });
    tokenizeResponse
      .then((response) => {
        expect(response.records[0].table).toBe('table1');
        expect(response.records[0].fields.string).toBe('test_token');
        expect(response.records[0].fields.int32).toBe('test_int_token');
        expect(response.records[0].fields.skyflow_id).toBe('test_skyflow_id');
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('test tokenize with failed request', (done) => {
    const failureError = new SkyflowError(
      {
        code: 400,
        description:
          'Object Name tab was not found for Vault test_vault - requestId: test_req_id',
      },
      [],
      true
    );

    jest.spyOn(ClientModule, 'default').mockImplementation(() => ({
      request: () => Promise.reject(failureError),
    }));

    const testSkyflowClient = new Skyflow({
      vaultID: '1234',
      vaultURL: 'https://url.com',
      getBearerToken: () => Promise.resolve('valid_token'),
    });
    jest
      .spyOn(testSkyflowClient, 'getAccessToken')
      .mockResolvedValue('valid_token');

    const collectElement = new CollectElement(
      { table: 'table1', column: 'string', type: ElementType.INPUT_FIELD },
      {},
      { env: Env.PROD, logLevel: LogLevel.ERROR }
    );
    collectElement.onChangeElement('1232');
    const tokenizeResponse = tokenize(testSkyflowClient, [collectElement], {
      tokens: true,
    });
    tokenizeResponse
      .then((response) => {
        done(response);
      })
      .catch((err) => {
        try {
          expect(err.error).toBe(failureError.error);
          done();
        } catch (error) {
          done(error);
        }
      });
  });

  it('test tokenize with invalid element value', (done) => {
    const testSkyflowClient = new Skyflow({
      vaultID: '1234',
      vaultURL: 'https://url.com',
      getBearerToken: () => Promise.resolve('valid_token'),
    });
    const collectElement = new CollectElement(
      { table: 'table1', column: 'string', type: ElementType.INPUT_FIELD },
      { required: true },
      { env: Env.PROD, logLevel: LogLevel.ERROR }
    );
    const tokenizeResponse = tokenize(testSkyflowClient, [collectElement], {
      tokens: true,
    });
    tokenizeResponse
      .then((res) => {
        done(res);
      })
      .catch((err) => {
        try {
          expect(err).toEqual(
            new SkyflowError(
              SKYFLOW_ERROR_CODE.COMPLETE_AND_VALID_INPUTS,
              [`string: ${DEFAULT_COLLECT_ELEMENT_ERROR_TEXT} `],
              true
            )
          );
          done();
        } catch (error) {
          done(error);
        }
      });
  });

  it('test tokenize with invalid bearer token', (done) => {
    const testSkyflowClient = new Skyflow({
      vaultID: '1234',
      vaultURL: 'https://url.com',
      getBearerToken: () => Promise.resolve('valid_token'),
    });
    jest
      .spyOn(testSkyflowClient, 'getAccessToken')
      .mockRejectedValue(logs.errorLogs.INVALID_BEARER_TOKEN);

    const collectElement = new CollectElement(
      { table: 'table1', column: 'string', type: ElementType.INPUT_FIELD },
      {},
      { env: Env.PROD, logLevel: LogLevel.ERROR }
    );
    collectElement.onChangeElement('1232');
    const tokenizeResponse = tokenize(testSkyflowClient, [collectElement], {
      tokens: true,
    });
    tokenizeResponse
      .then((response) => {
        done(response);
      })
      .catch((err) => {
        try {
          expect(err).toBe(logs.errorLogs.INVALID_BEARER_TOKEN);
        } catch (error) {
          done(error);
        }
        done();
      });
  });

  it('test tokenize with addtional fields duplicate columns', (done) => {
    const testSkyflowClient = new Skyflow({
      vaultID: '1234',
      vaultURL: 'https://url.com',
      getBearerToken: () => Promise.resolve('valid_token'),
    });
    const collectElement = new CollectElement(
      { table: 'table1', column: 'string', type: ElementType.INPUT_FIELD },
      {},
      { env: Env.PROD, logLevel: LogLevel.ERROR }
    );
    collectElement.onChangeElement('test_value');
    const tokenizeResponse = tokenize(testSkyflowClient, [collectElement], {
      tokens: true,
      additionalFields: {
        records: [
          { table: 'table1', fields: { string: 'test_int' } },
          { table: 'table2', fields: { string: 'test_string' } },
        ],
      },
    });
    tokenizeResponse
      .then((response) => {
        done(response);
      })
      .catch((err) => {
        try {
          expect(err).toEqual(
            new SkyflowError(
              SKYFLOW_ERROR_CODE.DUPLICATE_ELEMENT,
              ['string', 'table1'],
              true
            )
          );
          done();
        } catch (error) {
          done(error);
        }
      });
  });
});

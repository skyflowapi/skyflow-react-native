/*
    Copyright (c) 2022 Skyflow, Inc.
*/
import Skyflow from '../../src/core/Skyflow';
import { Env, LogLevel } from '../../src/utils/constants';
import * as TokenUtils from '../../src/utils/jwt-utils';
import SKYFLOW_ERROR_CODE from '../../src/utils/skyflow-error-code';
import logs from '../../src/utils/logs';
import Client from '../../src/core-utils/client';

const testConfig = {
  vaultID: '1234',
  vaultURL: 'https://url.com',
  options: {
    env: Env.PROD,
    logLevel: LogLevel.ERROR,
  },
};
describe('test Skyflow Class', () => {
  it('test getAccessToken function success', (done) => {
    jest.spyOn(TokenUtils, 'default').mockReturnValue(true);
    const successMock = jest.fn().mockResolvedValue('valid_token');
    const skyflow = new Skyflow({
      ...testConfig,
      getBearerToken: successMock,
    });
    skyflow
      .getAccessToken()
      .then((token) => {
        expect(token).toBe('valid_token');
        skyflow
          .getAccessToken()
          .then((prevToken) => {
            expect(prevToken).toBe('valid_token');
            done();
          })
          .catch((err) => {
            done(err);
          });
      })
      .catch((err) => {
        done(err);
      });
  });
  it('test getAccessToken function error', (done) => {
    jest.spyOn(TokenUtils, 'default').mockReturnValue(true);
    const failMock = jest.fn().mockRejectedValue('Error Occured');
    const skyflow = new Skyflow({
      ...testConfig,
      getBearerToken: failMock,
    });
    skyflow
      .getAccessToken()
      .then((token) => {
        done(token);
      })
      .catch((err) => {
        try {
          expect(err).toBe('Error Occured');
          done();
        } catch (error) {
          done(error);
        }
      });
  });

  it('test getAccessToken function invalid bearertoken function', (done) => {
    jest.spyOn(TokenUtils, 'default').mockReturnValue(true);
    const skyflow = new Skyflow({
      ...testConfig,
      getBearerToken: true,
    });
    skyflow
      .getAccessToken()
      .then((token) => {
        done(token);
      })
      .catch((err) => {
        try {
          expect(err.error).toEqual(
            SKYFLOW_ERROR_CODE.GET_BEARER_TOKEN_INVALID_RETURN
          );
          done();
        } catch (error) {
          done(error);
        }
      });
  });

  it('test getAccessToken function invalid token ', (done) => {
    jest.spyOn(TokenUtils, 'default').mockReturnValue(false);
    const successMock = jest.fn().mockResolvedValue('valid_token');
    const skyflow = new Skyflow({
      ...testConfig,
      getBearerToken: successMock,
    });
    skyflow
      .getAccessToken()
      .then((token) => {
        done(token);
      })
      .catch((err) => {
        try {
          expect(err).toBe(logs.errorLogs.INVALID_BEARER_TOKEN);
          done();
        } catch (error) {
          done(error);
        }
      });
  });

  it('test httpClient', () => {
    const skyflow = new Skyflow({
      ...testConfig,
      getBearerToken: true,
    });
    const httpClient = skyflow.getHttpClient();
    expect(httpClient).toBeInstanceOf(Client);
  });

  it('test getter functions', () => {
    const successMock = jest.fn().mockResolvedValue('valid_token');
    const skyflow = new Skyflow({
      ...testConfig,
      getBearerToken: successMock,
    });
    const config = skyflow.getSkyflowConfig();
    expect(config.vaultID).toBe(testConfig.vaultID);
    expect(skyflow.getVaultID()).toBe(testConfig.vaultID);

    expect(config.vaultURL).toBe(testConfig.vaultURL);
    expect(skyflow.getVaultURL()).toBe(testConfig.vaultURL);

    expect(config.options).toEqual(testConfig.options);
    expect(config.getBearerToken).toBe(successMock);
  });

  it('test default options', () => {
    const successMock = jest.fn().mockResolvedValue('valid_token');
    const skyflow = new Skyflow({
      ...testConfig,
      options: {},
      getBearerToken: successMock,
    });
    expect(skyflow.getEnv()).toBe(testConfig.options.env);
    expect(skyflow.getLogLevel()).toBe(testConfig.options.logLevel);
  });
});

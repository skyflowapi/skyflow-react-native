/*
    Copyright (c) 2022 Skyflow, Inc.
*/
import Skyflow from '../../src/core/Skyflow';
import {
  formatRecordsForClient,
  formatRecordsForIframe,
  fetchRecordsGET,
  fetchRecordsByTokenId,
} from '../../src/core-utils/reveal';
import * as ClientModule from '../../src/core-utils/client';
import { RedactionType } from '../../src/utils/constants';

describe('formatRecordsForClient fn test', () => {
  it('only success records', () => {
    const testInput = {
      records: [
        { token: '7402-2242-2342-232', value: '231', valueType: 'STRING' },
      ],
    };
    const fnResponse = formatRecordsForClient(testInput, {
      '7402-2242-2342-232': '231',
    });
    expect(fnResponse.success.length).toBe(1);
    expect(fnResponse.errors).toBeUndefined();
  });
  it('both success and error records', () => {
    const testInput = {
      records: [{ token: '7402-2242-2342-232', value: '231' }],
      errors: [{ token: '3232-6434-3253-4221' }],
    };
    const fnResponse = formatRecordsForClient(testInput, {
      '7402-2242-2342-232': '231',
    });
    expect(fnResponse.errors.length).toBe(1);
    expect(fnResponse.success.length).toBe(1);
  });
  it('only error records', () => {
    const testInput = { errors: [{ token: '3232-6434-3253-4221' }] };
    const fnResponse = formatRecordsForClient(testInput);
    expect(fnResponse.errors.length).toBe(1);
    expect(fnResponse.success).toBeUndefined();
  });
});

describe('formatRecordsForIframe fn test', () => {
  it('no records should return empty object', () => {
    const testInput = {};
    const fnResponse = formatRecordsForIframe(testInput);
    expect(fnResponse).toStrictEqual({});
  });

  it('with records should return token value object', () => {
    const testInput = {
      records: [
        { token: '7823-323-242-2232', value: 'token_value', elementId: '7823' },
      ],
    };
    const fnResponse = formatRecordsForIframe(testInput);
    expect(fnResponse).toStrictEqual({ 7823: 'token_value' });
  });
});

const testRevealRecords = [{ token: 'test_token1' }, { token: 'test_token2' }];

describe('test fetchRecordsByTokenId', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('test with invalid getAccessToken', () => {
    const testSkyflowClient = new Skyflow({
      vaultID: '1234',
      vaultURL: 'https://url.com',
      getBearerToken: () => Promise.resolve('valid_token'),
    });

    jest
      .spyOn(testSkyflowClient, 'getAccessToken')
      .mockRejectedValue('Invalid Access Token');

    const revealResponse = fetchRecordsByTokenId(
      testSkyflowClient,
      testRevealRecords
    );
    revealResponse.catch((err) => {
      expect(err).toEqual('Invalid Access Token');
    });
  });

  it('test with valid Reveal records', (done) => {
    const successResponse = {
      records: [
        {
          token: 'test_token1',
          value: 'token_value',
        },
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
      .mockResolvedValue('valid token');

    const revealResponse = fetchRecordsByTokenId(testSkyflowClient, [
      testRevealRecords[0],
    ]);
    revealResponse
      .then((res) => {
        expect(res.records[0].token).toBe(successResponse.records[0].token);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('test with invalid Reveal records', (done) => {
    const failureResponse = {
      token: 'test_token2',
      error: {
        code: 400,
        description: 'Token Not Found for test_token2',
      },
    };

    jest.spyOn(ClientModule, 'default').mockImplementation(() => ({
      request: () => Promise.reject(failureResponse),
    }));

    const testSkyflowClient = new Skyflow({
      vaultID: '1234',
      vaultURL: 'https://url.com',
      getBearerToken: () => Promise.resolve('valid_token'),
    });

    jest
      .spyOn(testSkyflowClient, 'getAccessToken')
      .mockResolvedValue('valid token');

    const revealResponse = fetchRecordsByTokenId(testSkyflowClient, [
      testRevealRecords[1],
    ]);
    revealResponse
      .then((res) => {
        done(res);
      })
      .catch((err) => {
        try {
          expect(err.errors[0].token).toBe(failureResponse.token);
          expect(err.errors[0].error).toEqual(failureResponse.error);
          done();
        } catch (error) {
          done(error);
        }
      });
  });

  it('test with Partial valid Reveal records', (done) => {
    const successResponse = {
      records: [
        {
          token: 'test_token1',
          value: 'token_value',
        },
      ],
    };
    const failureResponse = {
      token: 'test_token2',
      error: {
        code: 400,
        description: 'Token Not Found for test_token2',
      },
    };

    jest.spyOn(ClientModule, 'default').mockImplementation(() => ({
      request: (requestInput) => {
        return new Promise((resolve, reject) => {
          if (
            requestInput.body.detokenizationParameters[0].token ===
            'test_token1'
          )
            resolve(successResponse);
          else reject(failureResponse);
        });
      },
    }));

    const testSkyflowClient = new Skyflow({
      vaultID: '1234',
      vaultURL: 'https://url.com',
      getBearerToken: () => Promise.resolve('valid_token'),
    });

    jest
      .spyOn(testSkyflowClient, 'getAccessToken')
      .mockResolvedValue('valid token');

    const revealResponse = fetchRecordsByTokenId(
      testSkyflowClient,
      testRevealRecords
    );
    revealResponse
      .then((res) => {
        done(res);
      })
      .catch((err) => {
        try {
          expect(err.errors[0].token).toBe('test_token2');
          expect(err.records[0].token).toBe('test_token1');
          done();
        } catch (error) {
          done(error);
        }
      });
  });

  it('test with valid Reveal records and redaction plain text', (done) => {
    const successResponse = {
      records: [
        {
          token: 'test_token1',
          value: 'token_value',
        },
      ],
    };

    let requestBody;
    jest.spyOn(ClientModule, 'default').mockImplementation(() => ({
      request: (args) => {
        requestBody = args.body;
        return Promise.resolve(successResponse);
      },
    }));

    const testSkyflowClient = new Skyflow({
      vaultID: '1234',
      vaultURL: 'https://url.com',
      getBearerToken: () => Promise.resolve('valid_token'),
    });

    jest
      .spyOn(testSkyflowClient, 'getAccessToken')
      .mockResolvedValue('valid token');

    const revealResponse = fetchRecordsByTokenId(testSkyflowClient, [
      { token: 'test_token1', redaction: RedactionType.PLAIN_TEXT },
    ]);
    revealResponse
      .then((res) => {
        expect(res.records[0].token).toBe(successResponse.records[0].token);
        const tokenRecords = requestBody.detokenizationParameters;
        tokenRecords.forEach((record) => {
          expect(record.token).toBe('test_token1');
          expect(record.redaction).toBe('PLAIN_TEXT');
        });
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('test with valid Reveal records and redaction redacted', (done) => {
    const successResponse = {
      records: [
        {
          token: 'test_token1',
          value: 'token_value',
        },
      ],
    };

    let requestBody;
    jest.spyOn(ClientModule, 'default').mockImplementation(() => ({
      request: (args) => {
        requestBody = args.body;
        return Promise.resolve(successResponse);
      },
    }));

    const testSkyflowClient = new Skyflow({
      vaultID: '1234',
      vaultURL: 'https://url.com',
      getBearerToken: () => Promise.resolve('valid_token'),
    });

    jest
      .spyOn(testSkyflowClient, 'getAccessToken')
      .mockResolvedValue('valid token');

    const revealResponse = fetchRecordsByTokenId(testSkyflowClient, [
      { token: 'test_token1', redaction: RedactionType.REDACTED },
    ]);
    revealResponse
      .then((res) => {
        expect(res.records[0].token).toBe(successResponse.records[0].token);
        const tokenRecords = requestBody.detokenizationParameters;
        tokenRecords.forEach((record) => {
          expect(record.token).toBe('test_token1');
          expect(record.redaction).toBe('REDACTED');
        });
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('test with valid Reveal records and redaction masked', (done) => {
    const successResponse = {
      records: [
        {
          token: 'test_token1',
          value: 'token_value',
        },
      ],
    };

    let requestBody;
    jest.spyOn(ClientModule, 'default').mockImplementation(() => ({
      request: (args) => {
        requestBody = args.body;
        return Promise.resolve(successResponse);
      },
    }));

    const testSkyflowClient = new Skyflow({
      vaultID: '1234',
      vaultURL: 'https://url.com',
      getBearerToken: () => Promise.resolve('valid_token'),
    });

    jest
      .spyOn(testSkyflowClient, 'getAccessToken')
      .mockResolvedValue('valid token');

    const revealResponse = fetchRecordsByTokenId(testSkyflowClient, [
      { token: 'test_token1', redaction: RedactionType.MASKED },
    ]);
    revealResponse
      .then((res) => {
        expect(res.records[0].token).toBe(successResponse.records[0].token);
        const tokenRecords = requestBody.detokenizationParameters;
        tokenRecords.forEach((record) => {
          expect(record.token).toBe('test_token1');
          expect(record.redaction).toBe('MASKED');
        });
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('test with valid Reveal records and redaction default', (done) => {
    const successResponse = {
      records: [
        {
          token: 'test_token1',
          value: 'token_value',
        },
      ],
    };

    let requestBody;
    jest.spyOn(ClientModule, 'default').mockImplementation(() => ({
      request: (args) => {
        requestBody = args.body;
        return Promise.resolve(successResponse);
      },
    }));

    const testSkyflowClient = new Skyflow({
      vaultID: '1234',
      vaultURL: 'https://url.com',
      getBearerToken: () => Promise.resolve('valid_token'),
    });

    jest
      .spyOn(testSkyflowClient, 'getAccessToken')
      .mockResolvedValue('valid token');

    const revealResponse = fetchRecordsByTokenId(testSkyflowClient, [
      { token: 'test_token1', redaction: RedactionType.DEFAULT },
    ]);
    revealResponse
      .then((res) => {
        expect(res.records[0].token).toBe(successResponse.records[0].token);
        const tokenRecords = requestBody.detokenizationParameters;
        tokenRecords.forEach((record) => {
          expect(record.token).toBe('test_token1');
          expect(record.redaction).toBe('DEFAULT');
        });
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('test with valid Reveal records default redaction should passed as default', (done) => {
    const successResponse = {
      records: [
        {
          token: 'test_token1',
          value: 'token_value',
        },
      ],
    };

    let requestBody;
    jest.spyOn(ClientModule, 'default').mockImplementation(() => ({
      request: (args) => {
        requestBody = args.body;
        return Promise.resolve(successResponse);
      },
    }));

    const testSkyflowClient = new Skyflow({
      vaultID: '1234',
      vaultURL: 'https://url.com',
      getBearerToken: () => Promise.resolve('valid_token'),
    });

    jest
      .spyOn(testSkyflowClient, 'getAccessToken')
      .mockResolvedValue('valid token');

    const revealResponse = fetchRecordsByTokenId(testSkyflowClient, [
      { token: 'test_token1' },
    ]);
    revealResponse
      .then((res) => {
        expect(res.records[0].token).toBe(successResponse.records[0].token);
        const tokenRecords = requestBody.detokenizationParameters;
        tokenRecords.forEach((record) => {
          expect(record.token).toBe('test_token1');
          expect(record.redaction).toBe('PLAIN_TEXT');
        });
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

const getRecordID = {
  ids: ['id1'],
  table: 'pii_fields',
  redaction: RedactionType.PLAIN_TEXT,
};

const getRecordColumn = {
  table: 'pii_fields',
  redaction: RedactionType.PLAIN_TEXT,
  columnName: 'column-name',
  columnValues: ['value1'],
};

const getRecordColumnValues = {
  table: 'pii_fields',
  redaction: RedactionType.PLAIN_TEXT,
  columnName: 'name',
  columnValues: ['name', 'value2', 'value3'],
};

const optionsFalse = { tokens: false };
const optionsTrue = { tokens: true };

const invalidGetRequest = {
  records: [
    {
      ids: ['invalid_id1'],
      table: 'pii_fields',
    },
  ],
};

const getErrorResponse = {
  error: {
    code: 404,
    description: 'No records found requestId - 3wq45w8-2fni-33fd-vt62-3rdsbe45',
  },
  ids: ['id1'],
};

const getSuccessResponse = {
  records: [
    {
      fields: {
        cvv: 123,
        id: 'id1',
        name: 'name',
      },
      table: 'pii_fields',
    },
  ],
};

describe('fetchRecordGET fn test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should throw error for invalid access token', (done) => {
    const testSkyflowClient = new Skyflow({
      vaultID: '1234',
      vaultURL: 'https://url.com',
      getBearerToken: () => Promise.reject('valid_token'),
    });

    jest
      .spyOn(testSkyflowClient, 'getAccessToken')
      .mockRejectedValue('Invalid Access Token');

    fetchRecordsGET(
      testSkyflowClient,
      [getRecordID, getRecordColumn],
      optionsFalse
    ).catch((err) => {
      expect(err).toEqual('Invalid Access Token');
      done();
    });
  });

  it('should reject promise in case of error', (done) => {
    jest.spyOn(ClientModule, 'default').mockImplementation(() => ({
      request: () => Promise.reject(getErrorResponse),
    }));

    const testSkyflowClient = new Skyflow({
      vaultID: '1234',
      vaultURL: 'https://url.com',
      getBearerToken: () => Promise.resolve('valid_token'),
    });

    jest
      .spyOn(testSkyflowClient, 'getAccessToken')
      .mockResolvedValue('valid token');

    fetchRecordsGET(testSkyflowClient, invalidGetRequest.records, optionsTrue)
      .then(
        (res) => {},
        (err) => {
          expect(err.errors.length).toBe(1);
          expect(err.records).toBe(undefined);
          expect(err.errors[0].error.code).toBe(404);
          expect(err.errors[0].error.description).toBe(
            getErrorResponse.error.description
          );
          done();
        }
      )
      .catch((err) => {
        done(err);
      });
  });

  it('should give success reponse in case of success', (done) => {
    jest.spyOn(ClientModule, 'default').mockImplementation(() => ({
      request: () => Promise.resolve(getSuccessResponse),
    }));

    const testSkyflowClient = new Skyflow({
      vaultID: '1234',
      vaultURL: 'https://url.com',
      getBearerToken: () => Promise.resolve('valid_token'),
    });

    jest
      .spyOn(testSkyflowClient, 'getAccessToken')
      .mockResolvedValue('valid token');

    fetchRecordsGET(
      testSkyflowClient,
      [getRecordID, getRecordColumn],
      optionsFalse
    )
      .then((res) => {
        expect(res.errors).toBe(undefined);
        expect(res.records.length).toBe(2);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should reject promise in case of partial success', (done) => {
    jest.spyOn(ClientModule, 'default').mockImplementation(() => ({
      request: (requestInput) => {
        return new Promise((resolve, reject) => {
          if (requestInput.url.includes('column_name=column-name'))
            resolve(getSuccessResponse);
          else reject(getErrorResponse);
        });
      },
    }));

    const testSkyflowClient = new Skyflow({
      vaultID: '1234',
      vaultURL: 'https://url.com',
      getBearerToken: () => Promise.resolve('valid_token'),
    });

    jest
      .spyOn(testSkyflowClient, 'getAccessToken')
      .mockResolvedValue('valid token');

    const getRequestRecords = [
      { ...invalidGetRequest.records[0] },
      getRecordColumn,
    ];

    fetchRecordsGET(testSkyflowClient, getRequestRecords, optionsFalse)
      .then(
        (res) => {},
        (err) => {
          expect(err.errors.length).toBe(1);
          expect(err.records.length).toBe(1);
          done();
        }
      )
      .catch((err) => {
        done(err);
      });
  });

  it('should send request with single column name in url for multiple column values', (done) => {
    let reqArg;
    jest.spyOn(ClientModule, 'default').mockImplementation(() => ({
      request: (args) => {
        reqArg = args;
        return Promise.resolve(getSuccessResponse);
      },
    }));

    const testSkyflowClient = new Skyflow({
      vaultID: '1234',
      vaultURL: 'https://url.com',
      getBearerToken: () => Promise.resolve('valid_token'),
    });

    jest
      .spyOn(testSkyflowClient, 'getAccessToken')
      .mockResolvedValue('valid token');

    fetchRecordsGET(
      testSkyflowClient,
      [getRecordID, getRecordColumnValues],
      optionsFalse
    )
      .then((res) => {
        expect(res.errors).toBe(undefined);
        expect(res.records.length).toBe(2);
        console.log('url', reqArg);
        expect(reqArg.url.match(/column_name=name/gi)?.length).toBe(1);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

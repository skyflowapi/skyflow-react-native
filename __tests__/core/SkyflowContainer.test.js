import * as revealUtils from '../../src/core-utils/reveal';
import Skyflow from '../../src/core/Skyflow';
import SkyflowContainer from '../../src/core/SkyflowContainer';
import { RedactionType } from '../../src/utils/constants';
import { parameterizedString } from '../../src/utils/logs-helper';
import SKYFLOW_ERROR_CODE from '../../src/utils/skyflow-error-code';

const testSkyflowClient = new Skyflow({
  vaultID: '1234',
  vaultURL: 'https://validurl.com',
  getBearerToken: () => Promise.resolve('valid_auth_token'),
});

describe('test SkyflowContiner class', () => {
  let skyflowContainer;
  beforeEach(() => {
    skyflowContainer = new SkyflowContainer(testSkyflowClient);
  });

  it('should be an instance of SkyflowContainer class', () => {
    expect(skyflowContainer).toBeInstanceOf(SkyflowContainer);
  });
});

const getRequestIDs = {
  records: [
    {
      ids: ['id1'],
      table: 'pii_fields',
      redaction: RedactionType.PLAIN_TEXT,
    },
  ],
};

const invalidGetRequest = {
  records: [
    {
      ids: ['id1'],
      table: 'pii_fields',
    },
  ],
};

const getSuccessRecord = {
  fields: {
    cvv: 123,
    id: 'id1',
    name: 'name',
  },
  table: 'pii_fields',
};

const getErrorRecord = {
  error: {
    code: 404,
    description: 'No records found requestId - 3wq45w8-2fni-33fd-vt62-3rdsbe45',
  },
  ids: ['id1'],
};

describe('test get method of SkyflowContainer class', () => {
  let skyflowContainer;
  beforeEach(() => {
    skyflowContainer = new SkyflowContainer(testSkyflowClient);
  });

  it('should throw error in case of invalid input', (done) => {
    jest
      .spyOn(revealUtils, 'fetchRecordsGET')
      .mockResolvedValue({ records: [getSuccessRecord] });

    skyflowContainer.get(invalidGetRequest).catch((err) => {
      expect(err?.errors[0]?.description).toEqual(
        parameterizedString(
          SKYFLOW_ERROR_CODE.MISSING_REDACTION_IN_GET.description,
          0
        )
      );
      done();
    });
  });

  it('should return response with records in case of success', (done) => {
    jest
      .spyOn(revealUtils, 'fetchRecordsGET')
      .mockResolvedValue({ records: [getSuccessRecord] });

    skyflowContainer
      .get(getRequestIDs)
      .then((res) => {
        expect(res.records.length).toBe(1);
        expect(res.errors).toBe(undefined);
        expect(res.records[0]).toEqual(getSuccessRecord);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should return response with records and errors in case of partial success', (done) => {
    jest.spyOn(revealUtils, 'fetchRecordsGET').mockRejectedValue({
      records: [getSuccessRecord],
      errors: [getErrorRecord],
    });

    skyflowContainer
      .get(getRequestIDs)
      .then(
        (res) => {},
        (err) => {
          expect(err.records.length).toBe(1);
          expect(err.errors.length).toBe(1);
          expect(err.records[0]).toEqual(getSuccessRecord);
          expect(err.errors[0]).toEqual(getErrorRecord);
          done();
        }
      )
      .catch((err) => {
        done(err);
      });
  });

  it('should return response with errors in case of failure', (done) => {
    jest
      .spyOn(revealUtils, 'fetchRecordsGET')
      .mockRejectedValue({ errors: [getErrorRecord] });

    skyflowContainer
      .get(getRequestIDs)
      .then(
        (res) => {},
        (err) => {
          expect(err.records).toBe(undefined);
          expect(err.errors.length).toBe(1);
          expect(err.errors[0]).toEqual(getErrorRecord);
          done();
        }
      )
      .catch((err) => {
        done(err);
      });
  });
});

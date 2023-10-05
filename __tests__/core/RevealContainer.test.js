/*
    Copyright (c) 2022 Skyflow, Inc.
*/
import * as revealUtils from '../../src/core-utils/reveal';
import RevealContainer from '../../src/core/RevealContainer';
import RevealSkyflowElement from '../../src/core/RevealSkyflowElement';
import Skyflow from '../../src/core/Skyflow';
import SKYFLOW_ERROR_CODE from '../../src/utils/skyflow-error-code';

const testSkyflowClient = new Skyflow({
  vaultID: '1234',
  vaultURL: 'https://validurl.com',
  getBearerToken: () => Promise.resolve('valid_auth_token'),
});

describe('test RevealConatiner Class', () => {
  let revealContainer;
  beforeEach(() => {
    revealContainer = new RevealContainer(testSkyflowClient);
  });
  it('test constructor', () => {
    expect(revealContainer).toBeInstanceOf(RevealContainer);
  });

  it('test create method', () => {
    const revealElement = revealContainer.create({
      token: 'random_token',
    });
    expect(revealElement).toBeInstanceOf(RevealSkyflowElement);
  });

  it('test reveal method success', (done) => {
    const revealSuccessValue = {
      records: [
        {
          token: 'random_token',
          value: 'test_value',
        },
      ],
    };
    jest
      .spyOn(revealUtils, 'fetchRecordsByTokenId')
      .mockResolvedValue(revealSuccessValue);
    const setValueMock = jest.fn();
    const setErrorMock = jest.fn();

    const revealElement = revealContainer.create({
      token: 'random_token',
    });
    revealElement.setMethods(setValueMock, setErrorMock);
    revealContainer
      .reveal()
      .then((res) => {
        expect(res).toEqual({ success: [{ token: 'random_token' }] });
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  it('test reveal method partial success', (done) => {
    const setValueMock = jest.fn();
    const setErrorMock = jest.fn();
    const setValueMock2 = jest.fn();
    const setErrorMock2 = jest.fn();

    const revealElement1 = revealContainer.create({
      token: 'random_token',
      elementId: '123',
    });
    revealElement1.setMethods(setValueMock, setErrorMock);
    const revealElement2 = revealContainer.create({
      token: 'invalid_token',
      elementId: '456',
    });
    revealElement2.setMethods(setValueMock2, setErrorMock2);

    const revealFailedVaule = {
      records: [
        {
          token: 'random_token',
          value: 'test_value',
          valueType: 'STRING',
          elementId: revealElement1.elementId,
        },
      ],
      errors: [
        {
          token: 'invalid_token',
          error: {
            code: 404,
            description: 'Tokens not found for invalid_token',
          },
        },
      ],
    };
    jest
      .spyOn(revealUtils, 'fetchRecordsByTokenId')
      .mockRejectedValue(revealFailedVaule);

    revealContainer
      .reveal()
      .then((res) => {
        done(res);
      })
      .catch((err) => {
        try {
          expect(setValueMock).toBeCalledTimes(1);
          expect(setErrorMock).toBeCalledTimes(0);
          expect(setErrorMock2).toHaveBeenCalledTimes(1);
          expect(setValueMock2).toBeCalledTimes(0);
          expect(err).toEqual({
            success: [{ token: 'random_token', valueType: 'STRING' }],
            errors: revealFailedVaule.errors,
          });
          done();
        } catch (error) {
          done(error);
        }
      });
  });

  it('test reveal validations invalid skyflow client', (done) => {
    const testRevealContainer = new RevealContainer(new Skyflow({}));
    testRevealContainer.reveal().catch((error) => {
      try {
        expect(error.error).toEqual(SKYFLOW_ERROR_CODE.VAULTID_IS_REQUIRED);
        done();
      } catch (err) {
        done(err);
      }
    });
  });
  it('test reveal validations invalid token in element', (done) => {
    const revealElement = revealContainer.create({
      token: '',
    });
    revealContainer.reveal().catch((error) => {
      try {
        expect(error.errors).toEqual([
          { ...SKYFLOW_ERROR_CODE.EMPTY_TOKEN_ID_REVEAL },
        ]);
        done();
      } catch (err) {
        done(err);
      }
    });
  });
});

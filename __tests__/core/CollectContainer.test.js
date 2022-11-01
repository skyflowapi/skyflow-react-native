/*
    Copyright (c) 2022 Skyflow, Inc.
*/
import { tokenize } from '../../src/core-utils/collect';
import CollectContainer from '../../src/core/CollectContainer';
import CollectElement from '../../src/core/CollectElement';
import { CardType } from '../../src/core/constants';
import Skyflow from '../../src/core/Skyflow';
import { ElementType, Env, LogLevel } from '../../src/utils/constants';
import SKYFLOW_ERROR_CODE from '../../src/utils/skyflow-error-code';
import SkyflowError from '../../src/utils/skyflow-error';

const testSkyflowClient = new Skyflow({
  vaultID: '1234',
  vaultURL: 'https://validurl.com',
  getBearerToken: () => Promise.resolve('valid_auth_token'),
});

jest.mock('../../src/core-utils/collect', () => ({
  __esModule: true,
  tokenize: jest.fn(),
}));
describe('test CollectConatiner Class', () => {
  let collectContainer;
  beforeEach(() => {
    collectContainer = new CollectContainer(testSkyflowClient);
  });

  it('test constructor', () => {
    expect(collectContainer).toBeInstanceOf(CollectContainer);
  });

  it('test create method', () => {
    const collectElement = collectContainer.create(
      {
        table: 'table1',
        column: 'string1',
        type: ElementType.CARD_NUMBER,
      },
      { required: true }
    );
    expect(collectElement).toBeInstanceOf(CollectElement);
    expect(collectElement.getCardType()).toBe(CardType.DEFAULT);
  });

  it('test getContext method', () => {
    expect(collectContainer.getContext()).toEqual({
      env: Env.PROD,
      logLevel: LogLevel.ERROR,
    });
  });
  it('test collect method with invalid elements', (done) => {
    const collectFailureValue = {
      code: '404',
      description: 'unable to find table1',
    };
    tokenize.mockRejectedValue(collectFailureValue);
    const collectElement = collectContainer.create(
      { table: 'table1', column: 'string1', type: ElementType.CARD_NUMBER },
      { required: true }
    );
    collectContainer
      .collect()
      .then((res) => {
        done(res);
      })
      .catch((err) => {
        try {
          expect(err).toBe(collectFailureValue);
          done();
        } catch (error) {
          done(error);
        }
      });
  });

  it('test collect method with valid elements', (done) => {
    const collectSuccessValue = {
      records: [{ table: 'cards', fields: { cardNumber: 'card_token' } }],
    };
    tokenize.mockResolvedValue(collectSuccessValue);
    const collectElement = collectContainer.create(
      { table: 'table1', column: 'string1', type: ElementType.CARD_NUMBER },
      { required: false }
    );
    collectContainer
      .collect()
      .then((res) => {
        expect(res).toBe(collectSuccessValue);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('test collect method with additional fields', (done) => {
    const collectSuccessValue = {
      records: [{ table: 'cards', fields: { cardNumber: 'card_token' } }],
    };
    tokenize.mockResolvedValue(collectSuccessValue);
    const collectElement = collectContainer.create(
      { table: 'table1', column: 'string1', type: ElementType.CARD_NUMBER },
      { required: false }
    );
    collectContainer
      .collect({
        additionalFields: {
          records: [{ table: 'persons', fields: { name: 'test1', age: 24 } }],
        },
      })
      .then((res) => {
        expect(res).toBe(collectSuccessValue);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  it('test collect method with invalid option tokens', (done) => {
    const collectElement = collectContainer.create(
      { table: 'table1', column: 'string1', type: ElementType.CARD_NUMBER },
      { required: false }
    );
    collectContainer
      .collect({ tokens: 'not_token_type' })
      .then((res) => {
        done(res);
      })
      .catch((err) => {
        try {
          expect(err).toEqual(
            new SkyflowError(
              SKYFLOW_ERROR_CODE.INVALID_TOKENS_IN_COLLECT,
              [],
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

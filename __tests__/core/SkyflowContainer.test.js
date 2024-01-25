import Skyflow from '../../src/core/Skyflow';
import SkyflowContainer from '../../src/core/SkyflowContainer';

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

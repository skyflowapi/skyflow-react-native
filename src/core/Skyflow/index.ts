import Client from '../../core-utils/client';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IConfig } from '../../utils/constants';
import isTokenValid from '../../utils/jwt-utils';

class Skyflow {
  #client: Client;
  #config: IConfig;
  #bearerToken: string = '';

  constructor(config: IConfig) {
    this.#client = new Client();
    this.#config = config;
  }

  getAccessToken() {
    return new Promise((resolve, reject) => {
      if (this.#bearerToken && isTokenValid(this.#bearerToken)) {
        console.log('Reusing Bearer Token');
        resolve(this.#bearerToken);
      } else {
        console.log('Generating new Bearer Token');
        this.#config
          .getBearerToken()
          .then((bearerToken) => {
            if (isTokenValid(bearerToken)) {
              this.#bearerToken = bearerToken;
              resolve(this.#bearerToken);
            } else {
              reject('Invalid Bearer Token');
            }
          })
          .catch((err) => {
            console.error('Failed to fetch Bearer Token', err);
          });
      }
    });
  }

  getVaultID() {
    return this.#config.vaultID;
  }

  getVaultURL() {
    return this.#config.vaultURL;
  }

  getOptions() {
    return this.#config.options;
  }

  getHttpClient() {
    return this.#client;
  }
}

export default Skyflow;

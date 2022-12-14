/*
 Copyright (c) 2022 Skyflow, Inc.
*/

import * as React from 'react';
import {SafeAreaView} from 'react-native';

import {Env, IConfig, LogLevel, SkyflowProvider} from 'skyflow-react-native';
import ElementView from './ElementView';

const App = () => {
  const skyflowConfig: IConfig = {
    getBearerToken: () => {
      return new Promise((resolve, reject) => {
        const Http = new XMLHttpRequest();

        Http.onreadystatechange = () => {
          if (Http.readyState === 4) {
            if (Http.status === 200) {
              const response = JSON.parse(Http.responseText);
              resolve(response.accessToken);
            } else {
              reject('Error occured');
            }
          }
        };

        Http.onerror = error => {
          reject('Error occured');
        };

        const url = '<YOUR_AUTH_BEARER_TOKEN_API_URL>';
        Http.open('GET', url);
        Http.send();
      });
    },
    vaultID: '<VAULT_ID>',
    vaultURL: '<VAULT_URL>',
    options: {
      logLevel: LogLevel.ERROR,
      env: Env.PROD,
    },
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <SkyflowProvider config={skyflowConfig}>
        <ElementView />
      </SkyflowProvider>
    </SafeAreaView>
  );
};

export default App;

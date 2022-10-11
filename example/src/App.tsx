/*
 Copyright (c) 2022 Skyflow, Inc.
*/

import * as React from 'react';

import { Env, IConfig, LogLevel, SkyflowProvider, } from 'skyflow-react-native';
import ElementView from './ElementView';

const App = () => {
  const skyflowConfig:IConfig= {
    getBearerToken: () => {
      return new Promise((resolve, reject) => {
        const Http = new XMLHttpRequest();
    
        Http.onreadystatechange = () => {
          if (Http.readyState == 4) {
            if (Http.status == 200) {
              const response = JSON.parse(Http.responseText);
              resolve(response.accessToken);
            } else {
              reject("Error occured");
            }
          }
        };
    
        Http.onerror = (error) => {
          reject("Error occured");
        };
    
        const url = "<TOKEN_END_POINT_URL>";
        Http.open("GET", url);
        Http.send();
      })
    },
    vaultID: '<VAULT_ID>',
    vaultURL: '<VAULT_URL>',
    options: {
      logLevel: LogLevel.ERROR,
      env: Env.PROD
    }
  }


  return (
    <SkyflowProvider config={skyflowConfig}>
      <ElementView />
    </SkyflowProvider>

  );
}

export default App;
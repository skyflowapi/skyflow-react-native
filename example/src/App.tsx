/*
 Copyright (c) 2022 Skyflow, Inc.
*/

import * as React from 'react';
import { Button, SafeAreaView, View } from 'react-native';
import { SkyflowProvider, LogLevel, IConfig, Env } from "skyflow-react-native"
import ElementView from './ElementView';
import ComposableElements from './ComposableElements';
import CardBrandChoice from './CoBrandedCard';

const App = () => {

  const [displayComposable, setDisplayComposable] = React.useState(false);
  const [displayCollect, setDisplayCollect] = React.useState(false);
  const [displayCobrandedCard, setDisplayCobrandedCard] = React.useState(false);

  const handleReset = () => {
    setDisplayCollect(false);
    setDisplayComposable(false);
    setDisplayCobrandedCard(false);
  }

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
    <SafeAreaView style={{ flex: 1 }}>
      <SkyflowProvider config={skyflowConfig}>
        {!displayCollect && !displayComposable && !displayCobrandedCard && <>
          <View style={{ margin: 10 }}>
            <Button onPress={() => { setDisplayCollect(true) }} title='Collect And Reveal Elements' />
          </View>
          <View style={{ margin: 10 }}>
            <Button onPress={() => { setDisplayComposable(true) }} title='Composable Elements' />
          </View>
          <View style={{ margin: 10 }}>
            <Button onPress={() => { setDisplayCobrandedCard(true) }} title='Co-branded Card' />
          </View>
        </>}

        {displayCollect && <ElementView handleReset={handleReset} />}
        {displayComposable && <ComposableElements handleReset={handleReset} />}
        {displayCobrandedCard && <CardBrandChoice handleReset={handleReset} />}
      </SkyflowProvider>
    </SafeAreaView>
  );
};

export default App;

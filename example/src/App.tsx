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

        resolve('eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2MiOiJiOTYzZTcxMjFkZDY0YTZkOTY0MGQ3ZTNlNGNjODdhNyIsImF1ZCI6Imh0dHBzOi8vbWFuYWdlLWJsaXR6LnNreWZsb3dhcGlzLmRldiIsImV4cCI6MTc2NjMyNzg5NCwiaWF0IjoxNzY2MjQxNDk0LCJpc3MiOiJzYS1hdXRoQG1hbmFnZS1ibGl0ei5za3lmbG93YXBpcy5kZXYiLCJqdGkiOiJwZWViYTFiYmExZTA0ODFjODk0ZGM2MWVjN2ZhODk5OSIsInN1YiI6Im0xODQ2YzA2M2FlODQ4MjhhNzM4OWQ3ZTc0OTE5MzE5In0.c1n87PWuKU0LJ2-tSwlK5rsTUfjE_zKKAkeDYclkP0Xh_6gnAynA83UoxJV8qDbPsmu1zuCXW7Pt4-M6kCDUViVkv2KhHYDbDByXl_PG7cVNrj0d6kxkUm_FORRFmyyCWZKy3S2tomdw_gQar2LakuENuWXAR2gL5LSywb_XZmJxgolLe6RdqcHxdSQTV5j7PkjbhfSnkuMaFK0_z8fA8Wdm-44aCa-eALAFEHCZ0-YiQqlB_24ERQxL9bfD6dxiVJqyWVEg-hrGUE0WDUtNQVhoevbcQdC7GxH7AA_yk2xUxxJh7w7OzN1-YBmQWXGgQUZg4DXT9qnugNxeH8B6Tg')
      });
    },
    vaultID: 'tfe60a6eef66434b82e982285610e668',
    vaultURL: 'https://qhdmceurtnlz.vault.skyflowapis.dev',
    options: {
      logLevel: LogLevel.ERROR,
      env: Env.PROD,
    },
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SkyflowProvider config={skyflowConfig}>
        {/* {!displayCollect && !displayComposable && !displayCobrandedCard && <>
          <View style={{ margin: 10 }}>
            <Button onPress={() => { setDisplayCollect(true) }} title='Collect And Reveal Elements' />
          </View>
          <View style={{ margin: 10 }}>
            <Button onPress={() => { setDisplayComposable(true) }} title='Composable Elements' />
          </View>
          <View style={{ margin: 10 }}>
            <Button onPress={() => { setDisplayCobrandedCard(true) }} title='Co-branded Card' />
          </View>
        </>} */}

        {true && <ElementView handleReset={handleReset} />}
        {/* {displayComposable && <ComposableElements handleReset={handleReset} />}
        {displayCobrandedCard && <CardBrandChoice handleReset={handleReset} />} */}
      </SkyflowProvider>
    </SafeAreaView>
  );
};

export default App;

# Skyflow React Native Example
This is an example React Native Application that shows how we can achieve collect and reveal functionality using Skyflow React Native SDK.

## Description
This example application is a small React Native application that consists of two main components one is `CollectElements` which shows how we can build Skyflow Collect Elements which can be used for the secure collection of data and the other is `RevealElements` which shows how we can build Skyflow Reveal Elements which can be used to securely reveal the data.

## Prerequisite
- Node - version 14 and above. 
- If you want to run this example application on `android`

    - Android Virtual Device (comes along with Android Studio).

- If you want to run this example application on `ios`
    - IOS Simulator ( comes along with Xcode ).
    
- Installation steps for the above depending on your OS can be found in [React Native Setup Guide](https://reactnative.dev/docs/environment-setup#development-os)


## Installing dependencies
**Step 1:** Clone Skyflow React Native SDK repo.
```
git clone https://github.com/skyflowapi/skyflow-react-native.git
```
**Step 2:** Install dependencies in the root directory.
```
npm install 
```
**Step 3:** Change to the example directory and install dependencies.
```
cd example
npm install
``` 

## Configuring application
This example application collects four fields of data and reveals those fields data tokens, to collect and reveal the data you need a vault and a token endpoint URL which provides a Skyflow bearer token generated from the service account of the same vault.     

### Creating The Vault
1. In a browser, navigate to Skyflow Studio and log in.
2. Create a vault by clicking **Create Vault** > **Upload Vault Schema**.
3. Choose provided [VaultSchema.json](schema/vaultSchema.json).
3. Once the vault is created, click the gear icon and select **Edit Vault** Details.
4. copy created `Vault URL` and `Vault ID` values, and replace the values of `<VAULT_URL>` and `<VAULT_ID>` in the [App.tsx](src/App.tsx) file.
5. replace `<TOKEN_END_POINT_URL>` with your token endpoint URL.


## Running the application

Open up the terminal. Make sure you are in the example directory for the below steps.

**Step 1:** Run the JS server.
```
npm run start
```

Let JS server keeps running, for the below steps open a new terminal within the example directory. 


**Step 2:** To run the example application on an `android` simulator.
```
npm run android
```

**Step 3:** To run the example application on an `ios` simulator(require MacOS).

run the below commands only during the initial setup(not required every time you rebuild the app).
```
cd ios

pod install

cd ..
```

To build and run the application on an `ios` simulator.
```
npm run ios
```


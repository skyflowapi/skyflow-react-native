# Skyflow React Native Example
This example React Native application shows how to build data collection and reveal functionality using the Skyflow React Native SDK.

## Description
This example consists of two main components: CollectElements shows how to build Skyflow Collect Elements that securely collect data, and RevealElements shows how to build Skyflow Reveal Elements that securely reveal data.

## Prerequisite
- Node - version 14 or above. 
- To run this example on Android, Android Virtual Device (which comes bundled with Android Studio).
- To run this example on iOS, iOS Simulator (which comes with Xcode).
    
- Installation steps for the above depending on your OS can be found in [React Native Setup Guide](https://reactnative.dev/docs/environment-setup#development-os).


## Installing dependencies
**Step 1.** Clone the Skyflow React Native SDK repo:
```
    git clone https://github.com/skyflowapi/skyflow-react-native.git
```
**Step 2.** Install dependencies in the root directory:
```
    npm install    
```
**Step 3.** Navigate to the example directory and install dependencies:
```
    cd example

    npm install
```
## Configuring application
This example collects four fields of data and reveals those fields' data tokens. To collect and reveal the data, you need a vault and a token endpoint URL that provides a Skyflow bearer token generated from the service account of the same vault.    

### Creating the vault
1. In a browser, navigate to Skyflow Studio and sign in.
2. Create a vault by clicking **Create Vault** > **Upload Vault Schema**.
3. Upload the included [vaultSchema.json](schema/vaultSchema.json).
3. When the vault is ready, click the gear icon and select **Edit Vault Details**.
4. Copy the Vault URL and Vault ID values, then update these values in [App.tsx](src/App.tsx).

### Implement Skyflow auth token endpoint
1. On your backend, integrate with a Skyflow SDK so you can generate bearer tokens. See [Authenticate](https://docs.skyflow.com/api-authentication/).
2. Implement a backend API endpoint that provides a Skyflow bearer token.
3. In [App.tsx](src/App.tsx), replace `<YOUR_AUTH_BEARER_TOKEN_API_URL>` with your bearer token API endpoint URL.


## Running the application

Open up the terminal. Make sure you are in the example directory for the below steps.

**Step 1:** Start the server by opening a terminal and running the following command:

```
    npm run start
```

Let JS server keeps running, for the below steps open a new terminal within the example directory. 


**Step 2:** To run the example application on an Android Virtual Device:
```
    npm run android
```
     
**Step 3:** To run the example application on an iOS Simulator:

Perform the initial setup (only required once):
```
    cd ios

    pod install

    cd ..   
```

Build and run the application:
```
    npm run ios
```        


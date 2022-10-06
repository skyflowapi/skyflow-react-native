# Skyflow React Native SDK

Skyflow’s React Native SDK can be used to securely collect, tokenize, and reveal sensitive data in the react native application without exposing your infrastructure to sensitive data

---
## Table of Contents
- [**Including Skyflow-React-Native**](#Including-Skyflow-React-Native) 
- [**Initializing Skyflow-React**](#Initializing Skyflow-React-Native)
- [**Securely collecting data client-side**](#Securely-collecting-data-client-side)
- [**Securely revealing data client-side**](#Securely-revealing-data-client-side)
- [**Reporting a Vulnerability**](#Reporting-Vulnerability)
- [**License**](#License)
---

## Including Skyflow-React-Native


## Installation

Using [npm](https://npmjs.org/)

```
npm install skyflow-react-native
```
---
## Initializing Skyflow-React-Native
React Native components are wrapped in skyflow provider which takes in config object and SDK internally initializes a skyflow client.

```jsx
import { SkyflowProvider, LogLevel, Env } from 'skyflow-react-native';
const App = ()=>{
    const config = {
        vaultID: 'string',          //Id of the vault that the client should connect to 
        vaultURL: 'string',         //URL of the vault that the client should connect to
        getBearerToken: helperFunc,  //helper function that retrieves a Skyflow bearer token from your backend
        options: {
            logLevel: LogLevel.DEBUG, // optional, if not specified default is ERROR 
            env: Env.DEV          // optional, if not specified default is PROD 
        }
    }
    return (
        <SkyflowProvider config={config}>
            // other elements goes here..
        </SkyflowProvider>
    )
}

```
For the `getBearerToken` parameter, pass in a helper function that retrieves a Skyflow bearer token from your backend. This function will be invoked when the SDK needs to insert or retrieve data from the vault. A sample implementation is shown below: 

For example, if the response of the consumer tokenAPI is in the below format

```
{
   'accessToken': string,
   'tokenType': string
}

```
then, your getBearerToken Implementation should be as below

```jsx
getBearerToken: () => {
    return new Promise((resolve, reject) => {
        const Http = new XMLHttpRequest();

        Http.onreadystatechange = () => {
            if (Http.readyState == 4) {
                if (Http.status == 200) {
                    const response = JSON.parse(Http.responseText);
                    resolve(response.accessToken);
                } else {
                    reject('Error occured');
                }
            }
        };

        Http.onerror = (error) => {
            reject('Error occured');
        };

        const url = 'https://api.acmecorp.com/skyflowToken';
        Http.open('GET', url);
        Http.send();
    })

}

```
For `logLevel` parameter, there are 4 accepted values in  `LogLevel`

- `DEBUG`
    
  When `LogLevel.DEBUG` is passed, all level of logs will be printed(DEBUG, INFO, WARN, ERROR).

- `INFO`

  When `LogLevel.INFO` is passed, INFO logs for every event that has occurred during the SDK flow execution will be printed along with WARN and ERROR logs.


- `WARN`

  When `LogLevel.WARN` is passed, WARN and ERROR logs will be printed.

- `ERROR`

  When `LogLevel.ERROR` is passed, only ERROR logs will be printed.

`Note`:
  - The ranking of logging levels is as follows :  DEBUG < INFO < WARN < ERROR
  - Since `logLevel` is optional, by default the logLevel will be  `ERROR`.



For `env` parameter, there are 2 accepted values in `Env`

- `PROD`
- `DEV`

  In [Event Listeners](#event-listener-on-collect-elements), actual value of element can only be accessed inside the handler when the `env` is set to `DEV`.

`Note`:
  - Since `env` is optional, by default the env will be  `PROD`.
  - Use `env` option with caution, make sure the env is set to `PROD` when using `skyflow-react-native` in production. 

---
## Securely collecting data client-side
-  [**Using Skyflow Elements to collect data**](#using-skyflow-elements-to-collect-data)
-  [**Event Listener on Collect Elements**](#event-listener-on-collect-elements)

### Using Skyflow Elements to collect data

**Skyflow Elements** provide developers with pre-built form elements to securely collect sensitive data client-side. These elements are provided by Skyflow, this reduces your PCI compliance scope by not exposing your front-end application to sensitive data. Follow the steps below to securely collect data with Skyflow Elements.
### Step 1: Create a container

First create a container for the form elements using the `useCollectContainer` hook as show below:

```jsx
 const container = useCollectContainer()
```
### Step 2: Create a collect Element
 
```jsx
import { CardNumberElement } from 'skyflow-react-native';

<CardNumberElement
    container='<CONTAINER>'
    table='<TABLE_NAME>'
    column='<COLUMN_NAME>'
      … props
/>
```

The following `props` can be passed to Skyflow collect Element: 

``` javascript
{
    conatiner: 'CollectContainer' // required, the collect container
    table: 'string',             //required, the table this data belongs to
    column: 'string',            //required, the column into which this data should be inserted
    label: 'string',             //optional, label for the form element
    placeholder: 'string',       //optional, placeholder for the form element
    validations: []              // optional array of validation rules
    onChange: Function;          //optional, function that is passed to trigger the onChange event
    onFocus: Function;           //optional, function that is passed to trigger the onChange event
    onBlur: Function;            //optional, function that is passed to trigger the onChange event
    onReady: Function;          //optional, function that is passed to trigger the onChange event
    inputStyles: {}             // optional, styles object applied to the textinput field 
    labelStyles: {}             // optional, styles object applied to label of textinput field
    errorTextStyle: {}          // optional, styles object applied to errortext of textinput field
}
```

The `table` and `column` fields indicate which table and column in the vault the Element corresponds to. 

**Note**: 
-  Use dot delimited strings to specify columns nested inside JSON fields (e.g. `address.street.line1`)

All elements can be styled using [StyleSheet](https://reactnative.dev/docs/stylesheet) syntax.

An example of styling an element :

```jsx
import { StyleSheet } from 'react-native';


const elementInputStyles = StyleSheet.create({
  base:{
      color: '#1d1d1d',
  },
  invalid:{
    color:'#f44336'
  },
});

// passing the styles object to element
    <CardNumberElement
        container='<CONTAINER>'
        table='<TABLE_NAME>'
        column='<COLUMN_NAME>'
        inputStyles={elementInputStyles}
    />
```

The `inputStyles` field accepts a style object which consists of CSS properties that should be applied to the form element in the following states:
- `base`: all other variants inherit from these styles
- `complete`: applied when the Element has valid input
- `empty`: applied when the Element has no input
- `focus`: applied when the Element has focus
- `invalid`: applied when the Element has invalid input

The states that are available for `labelStyles` are `base` and `focus`.

An example of a labelStyles object:

```jsx
const elementLabelStyles = StyleSheet.create({
    base:{
        fontWeight:'normal'
    },
    focus:{
        fontWeight:'bold'
    },
});
```

The state that is available for `errorTextStyles` is only the `base` state, it shows up when there is some error in the collect element.

An example of a errorTextStyles object:

```jsx
const errorTextStyles = StyleSheet.create({
    base:{
        color:'#f44336'
    }
});
```
We support the following collect elements in the react Native SDK:

- `CardHolderNameElement`
- `CardNumberElement`
- `ExpirationDateElement`
- `CvvElement`
- `PinElement`
- `ExpirationDateElement`
- `ExpirationMonthElement`
- `ExpirationYearElement`
- `InputFieldElement` 
  
The InputFieldElement type is a custom UI element without any built-in validations. See the section on [validations](#validations) for more information on validations.
  

Along with Collect Element we can define other options which takes a object of optional parameters as described below:

```jsx
const options = {
    required: boolean,  //optional, indicates whether the field is marked as required. Defaults to 'false'
    format: string, //optional, format for the element (only applicable currently for EXPIRATION_DATE, EXPIRATION_YEAR ElementType)
}
```

`required` parameter indicates whether the field is marked as required or not. If not provided, it defaults to false


`format` parameter takes string value and indicates the format pattern applicable to the element type, It's currently only applicable to `EXPIRATION_DATE` and `EXPIRATION_YEAR` element types.


The values that are accepted for `EXPIRATION_DATE` are
  - `MM/YY` (default)
  - `MM/YYYY`
  - `YY/MM`
  - `YYYY/MM`

The values that are accepted for `EXPIRATION_YEAR` are
  - `YY` (default)
  - `YYYY`

`NOTE`: If not specified or invalid value is passed to the `format` then it takes default value.

### Step 3: Collect data from Elements

When the form is ready to be submitted, call the `collect(options?)` method on the container object. The `options` parameter takes a object of optional parameters as shown below: 

- `tokens`: indicates whether tokens for the collected data should be returned or not. Defaults to 'true'
- `additionalFields`: Non-PCI elements data to be inserted into the vault which should be in the `records` object format.

```javascript
const options = {
    tokens: true  //optional, indicates whether tokens for the collected data should be returned. Defaults to 'true'
    additionalFields: {
        records: [
            {
                table: 'string', //table into which record should be inserted
                fields: {
                    column1: 'value', //column names should match vault column names
                    //...additional fields here
                }
            }
            //...additional records here
        ]
    } //optional
}

container.collect(options)
```
### End to end example of collecting data with Skyflow Elements

```jsx
import React from 'react';
import { CardNumberElement, useCollectContainer } from 'skyflow-react-native';
import { View,StyleSheet,Button } from 'react-native'; 

const App = ()=> {

    const collectContainer = useCollectContainer();

    const handleCollect = ()=>{
        collectContainer.collect().then((response:any)=>{
          console.log('Collect Success: ',JSON.stringify(response));
        }).catch((err)=>{
          console.error('Collect Failed: ',JSON.stringify(err));
        });
    };

    return(
      <View style={viewStyles.box}>
            <CardNumberElement 
            container={collectContainer}
            table='cards'
            column='card_number'
            placeholder='XXXX XXXX XXXX XXXX'
            label='Card Number'   
            inputStyles={elementInputStyles}
            labelStyles={elementLabelStyles}
            errorTextStyles={errorTextStyles}
            onChange={handleOnChange}
            />

      </View>
      <View style={viewStyles.box}>
        <Button title='Collect' onPress={handleCollect} />
      </View>
    );
};

const elementInputStyles = StyleSheet.create({
  base:{
      borderWidth:2,
      borderRadius:4,
      borderColor: '#eae8ee',
      paddingVertical: 8,
      paddingHorizontal:6,
      color: '#1d1d1d',
  },
  invalid:{
    color:'#f44336'
  }

});

const elementLabelStyles = StyleSheet.create({
  focus:{
    fontWeight:'bold'
  },
});

const errorTextStyles = StyleSheet.create({
  base:{
    color:'#f44336'
  }
});

const viewStyles = StyleSheet.create({
    box:{
      marginVertical: 5
    }
})


export default App;

```
**Sample Response :**
```javascript
{
    'records': [
        {
            'table': 'cards',
            'fields': {
                'card_number': 'f3907186-e7e2-466f-91e5-48e12c2bcbc1',
            }
        }
    ]
}
```
## Validations:

Skyflow-React-Native SDK which internally provides two types of validations on Collect Elements

### 1. Default Validations:
Every Collect Element except `InputFieldElement` has a set of default validations listed below:
- `CardNumberElement`: Card number validation with checkSum algorithm(Luhn algorithm).
Available card lengths for defined card types are [12, 13, 14, 15, 16, 17, 18, 19]. 
A valid 16 digit card number will be in the format - `XXXX XXXX XXXX XXXX`
- `CardHolderNameElement`: Name should be 2 or more symbols, valid characters should match pattern -  `^([a-zA-Z\\ \\,\\.\\-\\']{2,})$`
- `CvvElement`: Card CVV can have 3-4 digits
- `ExpirationDateElement`: Any date starting from current month. By default valid expiration date should be in short year format - `MM/YY`
- `PinElement`: Can have 4-12 digits

### 2. Custom Validations:
Custom validations can be added to any element which will be checked after the default validations have passed. The following Custom validation rules are currently supported:
- `REGEX_MATCH_RULE`: You can use this rule to specify any Regular Expression to be matched with the input field value

```jsx
const regexMatchRule = {
    type: ValidationRuleType.REGEX_MATCH_RULE,
    params: {
        regex: RegExp,
        error: string // optional, default error is 'VALIDATION FAILED'
    }
}
```

- `LENGTH_MATCH_RULE`: You can use this rule to set the minimum and maximum permissible length of the input field value

```jsx
const lengthMatchRule = {
    type: ValidationRuleType.LENGTH_MATCH_RULE,
    params: {
        min: number, // optional
        max: number, // optional 
        error: string // optional, default error is 'VALIDATION FAILED'
    }
}
```
The Sample for using custom validations:

```jsx
/*
  A simple example that illustrates custom validations.
  Adding REGEX_MATCH_RULE , LENGTH_MATCH_RULE to collect element.
*/
import { CardNumberElement, ValidationRuleType } from 'skyflow-react-native';

// This rule allows 1 or more alphabets
const alphabetsOnlyRegexRule = {
    type: ValidationRuleType.REGEX_MATCH_RULE,
    params: {
        regex: /^[A-Za-z]+$/,
        error: 'Only alphabets are allowed'
    }
};

// This rule allows input length between 4 and 6 characters
const lengthRule = {
    type: ValidationRuleType.LENGTH_MATCH_RULE,
    params: {
        min: 4,
        max: 6,
        error: 'Must be between 4 and 6 alphabets'
    }
};

const form = (props) => {

    return <CardNumberElement
        container='COLLECT CONTAINER'
        table='<TABLE_NAME>'
        column='<COLUMN_NAME>'
        validations= {[alphabetsOnlyRegexRule, lengthRule]}
             ...props
    />
}
```
## Event Listener on Collect Elements

Event listeners can be triggered by passing the handler methods as props to the Element components.


There are 4 events which SDK supports:
- `CHANGE`  
  Change event is triggered when the Element's value changes.

- `READY`   
   Ready event is triggered when the Element is fully rendered

- `FOCUS`   
 Focus event is triggered when the Element gains focus

- `BLUR`    
  Blur event is triggered when the Element loses focus.

The handler ```function(state) => void```   is a callback function you provide, that will be called when the event is fired with the state object as shown below. 

```javascript
state : {
  elementType: Skyflow.ElementType
  isEmpty: boolean 
  isFocused: boolean
  isValid: boolean
  value: string
}
```

`Note:`
values of SkyflowElements will be returned in elementstate object only when `env` is  `DEV`,  else it is empty string i.e, ''

### Example Usage of Event Listener on Collect Elements
```jsx

import React from 'react';
import { CardNumberElement } from 'skyflow-react-native';
import { View, Button } from 'react-native';

function App() {
    const container = useCollectContainer()

    const handleCollect =()=>{
        collectContainer.collect().then((response:any)=>{
          console.log('Collect Success: ',JSON.stringify(response));
        }).catch((err)=>{
          console.error('Collect Failed: ',JSON.stringify(err));
        });
      }
    
    const handleOnChange = (state)=>{
      console.log('Change Listener Triggered',state);
    };

    const handleOnFocus = (state)=>{
      console.log('Focus Listener Triggered',state);
    };

    const handleOnBlur = (state)=>{
      console.log('Blur Listener Triggered',state);
    }

    return( <View>
      <View style={viewStyles.box}>
        <CardNumberElement 
         container={collectContainer}
         table='cards'
         column='card_number'
         placeholder='XXXX XXXX XXXX XXXX'
         label='Card Number'   
         onChange={handleOnChange}
         onFocus={handleOnFocus}
         onBlur={handleOnBlur}
        />
      </View>
      <View style={viewStyles.box}>
        <Button title='Collect' onPress={handleCollect} />
      </View>
    </View>);
}

export default App;

```
### Sample Element state object when `env` is `DEV`

```javascript
{
    elementType: 'CARD_NUMBER'
    isEmpty: false
    isFocused: true
    isValid: false
    value: '411'
}

```
### Sample Element state object when `env` is `PROD`

```javascript
{
    elementType: 'CARD_NUMBER'
    isEmpty: false
    isFocused: true
    isValid: false
    value: ''
}
```
## Securely revealing data client-side

### Using Skyflow Elements to reveal data

Skyflow Elements can be used to securely reveal data in application without exposing your front end to the sensitive data. This is great for use cases like card issuance where you may want to reveal the card number to a user without increasing your PCI compliance scope. 

### Step 1: Create a container
To start, create a container using the `useRevealContainer()` method of the Skyflow client as shown below.

```jsx
  const revealContainer = useRevealContainer()
```

### Step 2: Create a reveal element

```jsx
import { RevealElement } from 'skyflow-react-native';

<RevealElement
    token='<DATA_TOKEN>'
    container='<CONTAINER>'   
      … props
/>
```
The following `props` can be passed to Skyflow reveal element: 

```javascript 
{
    container: 'RevealContainer' // required, the reveal container
    token:'string'               // required, the actual data token
    label: 'string',             // optional, label for the form element
    altText: 'string'            // optional, string that is shown before reveal, will show token if altText is not provided
    inputStyles: {},             // optional styles to be applied to the element
    labelStyles: {},             // optional, styles to be applied to the label of the reveal element
    errorTextStyles: {},         // optional styles that will be applied to the errorText of the reveal element
}   
```
`Note`: 

- The `inputStyles`, `labelStyles` and `errorTextStyles` parameters accepts a styles object as described in the [previous section](#step-2-create-a-collect-element) for collecting data but only a single variant is available i.e. base.

### End to end example using Reveal Element

```jsx
import React from 'react';
import { RevealElement, useRevealContainer } from 'skyflow-react-native';
import {View, Button } from 'react-native';

const App = ()=> {
    const revealContainer = useRevealContainer();

    const handleReveal = () => {
        revealContainer.reveal().then((response) => {
            console.log('Reveal Success', JSON.stringfy(response));
        }).catch((err) => {
            console.error('Reveal Failed', JSON.stringfy(response));
        });
    }

    return (
        <View>
            <RevealElement
             token={'b63ec4e0-bbad-4e43-96e6-6bd50f483f75'}
             container={revealContainer}
             label='Card Number'
             altText='XXXX XXXX XXXX XXXX'
             inputStyles={revealInputStyles}
             labelStyles={revealLabelStyles}
             errorTextStyles={revealerrorTextStyles}
            />
            <RevealElement
             token={'89024714-6a26-4256-b9d4-55ad69aa4047'}
             container={revealContainer}
             label='SSN'
             altText='XXX-XX-XXXX'
             inputStyles={revealInputStyles}
             labelStyles={revealLabelStyles}
             errorTextStyles={revealerrorTextStyles}
            />
            <View style={buttonStyles.button}>
                <Button title='Reveal' onPress={handleReveal}/>
            </View>
        </View>
    );
 }
    const revealInputStyles = StyleSheet.create({
        base: {
            color: '#1c1e21',
            fontWeight: '600',
        }
    });

    const revealLabelStyles = StyleSheet.create({
        base: {
            color: '#1c1e21',
            fontWeight: '400'
        }
    });

    const revealerrorTextStyles = StyleSheet.create({
        base: {
            color: 'orangered'
        }
    });

    const buttonStyles = StyleSheet.create({
        button:{
            margin: 10
        }
    });

export default App;

```
### Sample Response

```javascript
{
    'success': [
        {
            'token': 'b63ec4e0-bbad-4e43-96e6-6bd50f483f75'
        }
    ],
        'errors': [
            {
                'token': '89024714-6a26-4256-b9d4-55ad69aa4047',
                'error': {
                    'code': 404,
                    'description': 'Tokens not found for 89024714-6a26-4256-b9d4-55ad69aa4047'
                }
            }
        ]
}
```
## Reporting a Vulnerability

If you discover a potential security issue in this project, please reach out to us at security@skyflow.com. Please do not create public GitHub issues or Pull Requests, as malicious actors could potentially view them.

## License

This project is licensed under the MIT license. See the [LICENSE](https://github.com/skyflowapi/skyflow-react-js/blob/master/LICENSE) file for more info.
# Skyflow React Native SDK

Skyflow’s React Native SDK can be used to securely collect, tokenize, and reveal sensitive data in the React Native application without exposing your infrastructure to sensitive data.

---
## Table of Contents
- [**Including Skyflow React Native**](#including-skyflow-react-native) 
- [**Initializing Skyflow React Native**](#initializing-skyflow-react-native)
- [**Securely collecting data client-side**](#securely-collecting-data-client-side)
- [**Securely revealing data client-side**](#securely-revealing-data-client-side)
- [**Reporting a Vulnerability**](#reporting-a-vulnerability)
- [**License**](#license)
---

## Including Skyflow React Native
### Requirements
- The minimum supported version of React Native is v0.65.3. If you use an older version, upgrade React Native to use this library

## Installation

Using [npm](https://npmjs.org/)

```
npm install skyflow-react-native
```
---
## Initializing Skyflow React Native
React Native components are wrapped in a Skyflow provider that takes a `config` object as input. The SDK internally initializes a Skyflow client.

```jsx
import { SkyflowProvider, LogLevel, Env } from 'skyflow-react-native';
const App = ()=>{
    const config = {
        vaultID: 'string',          // ID of the vault that the client should connect to. 
        vaultURL: 'string',         // URL of the vault that the client should connect to.
        getBearerToken: helperFunc,  // Helper function that retrieves a Skyflow bearer token from your backend.
        options: {
            logLevel: LogLevel.DEBUG, // Optional, if not specified default is ERROR. 
            env: Env.DEV          // Optional, if not specified default is PROD.
        }
    }
    return (
        <SkyflowProvider config={config}>
            // Other elements goes here.
        </SkyflowProvider>
    )
}

```
For the `getBearerToken` parameter, pass a helper function that retrieves a Skyflow bearer token from your backend. This function will be invoked when the SDK needs to insert or retrieve data from the vault. A sample implementation is shown below.

For example, if the response of the your backend bearer tokenAPI is in the below format

```
{
   'accessToken': string,
   'tokenType': string
}

```
then, your getBearerToken(helper function) implementation should be as below.

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
    });

};

```
For the `logLevel` parameter, there are four accepted values in  `LogLevel`.

- `DEBUG`
    
  When `LogLevel.DEBUG` is passed, all log levels will be printed(DEBUG, INFO, WARN, ERROR).

- `INFO`

  When `LogLevel.INFO` is passed, INFO logs for every event that has occurred during the SDK flow execution will be printed along with WARN and ERROR logs.


- `WARN`

  When `LogLevel.WARN` is passed, WARN and ERROR logs will be printed.

- `ERROR`

  When `LogLevel.ERROR` is passed, only ERROR logs will be printed.

**Note**:
  - The ranking of logging levels is as follows :  DEBUG < INFO < WARN < ERROR.
  - Since `logLevel` is optional, by default the logLevel will be  `ERROR`.



For `env` parameter, there are two accepted values in `Env`: 

- `PROD`
- `DEV`

In [Event Listeners](#event-listener-on-collect-elements), the actual value of element can only be accessed inside the handler when the `env` is set to `DEV`.

**Note**:
  - Since `env` is optional, by default the environment will be  `PROD`.
  - Use `env` option with caution, make sure the `env` is set to `PROD` when using `skyflow-react-native` in production. 

---
## Securely collecting data client-side
-  [**Using Skyflow Elements to collect data**](#using-skyflow-elements-to-collect-data)
-  [**Event listener on collect elements**](#event-listener-on-collect-elements)

### Using Skyflow Elements to collect data

**Skyflow Elements** provide developers with pre-built form elements to securely collect sensitive data client-side. These elements are provided by Skyflow, this reduces your PCI compliance scope by not exposing your frontend application to sensitive data. Follow the steps below to securely collect data with Skyflow Elements.
### Step 1: Create a container

First create a container for the form elements using the `useCollectContainer` hook as shown below:

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

The following `props` can be passed to Skyflow Collection Element:

``` javascript
{
    conatiner: 'CollectContainer'  // Required, the collect container.
    table: 'string',               // Required, the table this data belongs to.
    column: 'string',              // Required, the column into which this data should be inserted.
    label: 'string',               // Optional, label for the form element.
    placeholder: 'string',         // Optional, placeholder for the form element.
    validations: []                // Optional, array of validation rules.
    onChange: Function;            // Optional, function that is passed to trigger the onChange event.
    onFocus: Function;             // Optional, function that is passed to trigger the onChange event.
    onBlur: Function;              // Optional, function that is passed to trigger the onChange event.
    onReady: Function;             // Optional, function that is passed to trigger the onChange event.
    inputStyles: {}                // Optional, styles object applied to the textinput field.
    labelStyles: {}                // Optional, styles object applied to label of textinput field.
    errorTextStyle: {}             // Optional, styles object applied to errortext of textinput field.
}
```

The `table` and `column` fields indicate which table and column in the vault the Element corresponds to. 

**Note**: 
-  Use dot delimited strings to specify columns nested inside JSON fields (e.g. `address.street.line1`)

All elements can be styled using [StyleSheet](https://reactnative.dev/docs/stylesheet) syntax.

An example of styling an element:

```jsx
import { StyleSheet } from 'react-native';


const elementInputStyles = StyleSheet.create({
    base: {
        color: '#1d1d1d',
    },
    invalid: {
        color: '#f44336',
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
- `base`: applied by default, all below variants inherit from these styles.
- `complete`: applied when the element has valid input.
- `empty`: applied when the element has no input.
- `focus`: applied when the element has focus.
- `invalid`: applied when the element has invalid input.

The states that are available for `labelStyles` are `base`, `focus` and `requiredAsterisk`.
- `requiredAsterisk`: styles applied for the Asterisk symbol in the label. 

An example of a labelStyles object:

```jsx
const elementLabelStyles = StyleSheet.create({
    base: {
        fontWeight: 'normal'
    },
    focus: {
        fontWeight: 'bold'
    },
    requiredAsterisk: {
        color: 'red'
    }
});
```

The state that is available for `errorTextStyles` is only the `base` state, it shows up when there is some error in the collect element.

An example of a errorTextStyles object:

```jsx
const errorTextStyles = StyleSheet.create({
    base: {
        color: '#f44336'
    }
});
```
The following collection elements are supported in the React Native SDK:

- `CardHolderNameElement`
- `CardNumberElement`
- `ExpirationDateElement`
- `CvvElement`
- `PinElement`
- `ExpirationDateElement`
- `ExpirationMonthElement`
- `ExpirationYearElement`
- `InputFieldElement` 
  
The InputFieldElement type is a custom UI element without any built-in validations. See the section on [validations](#validations) for more information.
  

Along with the collect element props you can define other options that take an object of optional parameters as described below:

```jsx
const options = {
    required: boolean,  // Optional, indicates whether the field is marked as required. Defaults to 'false'.
    format: string,     // Optional, format for the element (only applicable currently for EXPIRATION_DATE, EXPIRATION_YEAR ElementType).
}
```

The `required` parameter indicates whether the field is marked as required or not. If not provided, it defaults to false.


The `format` parameter takes string value and indicates the format pattern applicable to the element type, It's currently only applicable to `EXPIRATION_DATE` and `EXPIRATION_YEAR` element types.


The values that are accepted for `EXPIRATION_DATE` are
  - `MM/YY` (default)
  - `MM/YYYY`
  - `YY/MM`
  - `YYYY/MM`

The values that are accepted for `EXPIRATION_YEAR` are
  - `YY` (default)
  - `YYYY`

**Note**: If not specified or an invalid value is passed to the `format` then it takes default value.

### Step 3: Collect data from Elements

To submit a form, call the collect(options?) method on the container object. The `options` parameter takes an object of optional parameters as shown below: 

- `tokens`: indicates whether tokens for the collected data should be returned or not. Defaults to 'true'.
- `additionalFields`: Non-PCI elements data to be inserted into the vault which should be in the `records` object format.

```javascript
const options = {
    tokens: true,  // Optional, indicates whether tokens for the collected data should be returned. Defaults to 'true'.
    additionalFields: {
        records: [
            {
                table: 'string',       // Table into which record should be inserted.
                fields: {
                    column1: 'value',  // Column names should match vault column names.
                    // ...additional fields here.
                }
            }
            // ...additional records here.
        ]
    } // Optional
}

container.collect(options)
```
### End to end example of collecting data with Skyflow Elements

```jsx
import React from 'react';
import { CardNumberElement, useCollectContainer } from 'skyflow-react-native';
import { View, StyleSheet, Button } from 'react-native';

const App = () => {
    const collectContainer = useCollectContainer();

    const handleCollect = () => {
        collectContainer.collect().then((response: any) => {
            console.log('Collect Success: ', JSON.stringify(response));
        }).catch((err) => {
            console.error('Collect Failed: ', JSON.stringify(err));
        });
    };

    return (
        <>
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
                    options={{
                        required: true
                    }}
                />

            </View>
            <View style={viewStyles.box}>
                <Button title='Collect' onPress={handleCollect} />
            </View>
        </>

    );
};

const elementInputStyles = StyleSheet.create({
    base: {
        borderWidth: 2,
        borderRadius: 4,
        borderColor: '#eae8ee',
        paddingVertical: 8,
        paddingHorizontal: 6,
        color: '#1d1d1d',
    },
    invalid: {
        color: '#f44336'
    },
});

const elementLabelStyles = StyleSheet.create({
    focus: {
        fontWeight: 'bold'
    },
});

const errorTextStyles = StyleSheet.create({
    base: {
        color: '#f44336'
    }
});

const viewStyles = StyleSheet.create({
    box: {
        marginVertical: 5
    }
});


export default App;
```
**Sample response :**
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

The Skyflow React Native SDK provides two types of validations on Collect Elements.

### 1. Default Validations:
Every Collect Element except `InputFieldElement` has a set of default validations listed below:
- `CardNumberElement`: Card number is validated with checkSum algorithm(Luhn algorithm). Available card lengths for defined card types are [12, 13, 14, 15, 16, 17, 18, 19]. A valid 16 digit card number will be in the format - `XXXX XXXX XXXX XXXX`.
- `CardHolderNameElement`: Name should be two or more symbols, valid characters should match pattern -  `^([a-zA-Z\\ \\,\\.\\-\\']{2,})$`.
- `CvvElement`: Card CVV can have 3-4 digits.
- `ExpirationDateElement`: Any date starting from current month. By default valid expiration date should be in short year format - `MM/YY`.
- `PinElement`: Can have 4-12 digits.

### 2. Custom Validations:
Custom validations can be added to any element and are checked after the default validations have passed. The following custom validation rules are currently supported:
- `REGEX_MATCH_RULE`: You can use this rule to specify any regular expression to be matched with the input field value.

```jsx
const regexMatchRule = {
    type: ValidationRuleType.REGEX_MATCH_RULE,
    params: {
        regex: RegExp,
        error: string // Optional, default error is 'VALIDATION FAILED'.
    }
}
```

- `LENGTH_MATCH_RULE`: You can use this rule to set the minimum and maximum permissible length of the input field value.

```jsx
const lengthMatchRule = {
    type: ValidationRuleType.LENGTH_MATCH_RULE,
    params: {
        min: number,  // Optional
        max: number,  // Optional 
        error: string // Optional, default error is 'VALIDATION FAILED'.
    }
}
```
The Sample for using custom validations: 

```jsx
/*
  A simple example that illustrates custom validations.
  Adding REGEX_MATCH_RULE , LENGTH_MATCH_RULE to collect element.
*/
import { InputFieldElement, ValidationRuleType } from 'skyflow-react-native';

// This rule allows one or more alphabets.
const alphabetsOnlyRegexRule = {
    type: ValidationRuleType.REGEX_MATCH_RULE,
    params: {
        regex: /^[A-Za-z]+$/,
        error: 'Only alphabets are allowed'
    }
};

// This rule allows input length between 4 and 6 characters.
const lengthRule = {
    type: ValidationRuleType.LENGTH_MATCH_RULE,
    params: {
        min: 4,
        max: 6,
        error: 'Must be between 4 and 6 alphabets'
    }
};

const form = (props) => (
    return (
        <InputFieldElement
            container='COLLECT CONTAINER'
            table='<TABLE_NAME>'
            column='<COLUMN_NAME>'
            validations={[alphabetsOnlyRegexRule, lengthRule]}
            ...props
        />
    );
);
```
## Event Listener on Collect Elements

Event listeners are triggered by passing the handler methods as props to the Element components.


There are four events which SDK supports:
- `CHANGE`  
  Change event is triggered when the element's value changes.

- `READY`   
   Ready event is triggered when the element is fully rendered.

- `FOCUS`   
 Focus event is triggered when the element gains focus.

- `BLUR`    
  Blur event is triggered when the element loses focus.

The handler ```function(state) => void```   is a callback function you provide, that will be called when the event is fired with the state object as shown below. 

```javascript
state : {
  elementType: ElementType
  isEmpty: boolean 
  isFocused: boolean
  isValid: boolean
  value: string
}
```

**Note**:
Skyflow Elements only return `value` in the `state` object when `env` is `DEV`. When `env` isn't `DEV`, `value` is empty string.

### Example Usage of Event Listener on Collect Elements
```jsx
import React from 'react';
import { CardNumberElement, useCollectContainer } from 'skyflow-react-native';
import { View, Button, StyleSheet } from 'react-native';

const App = () => {
    const collectContainer = useCollectContainer()

    const handleCollect = () => {
        collectContainer.collect().then((response: any) => {
            console.log('Collect Success: ', JSON.stringify(response));
        }).catch((err) => {
            console.error('Collect Failed: ', JSON.stringify(err));
        });
    }

    const handleOnChange = (state) => {
        console.log('Change Listener Triggered', state);
    };

    const handleOnFocus = (state) => {
        console.log('Focus Listener Triggered', state);
    };

    const handleOnBlur = (state) => {
        console.log('Blur Listener Triggered', state);
    }

    return (
        <View>
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
        </View>
    );
};

const viewStyles = StyleSheet.create({
    box: {
        marginVertical: 5,
    }
});

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

Skyflow Elements can securely reveal data in an application without exposing your frontend to sensitive data. This is useful for cases like card issuance, where you may want to reveal the card number to a user without increasing your PCI compliance scope.

### Step 1: Create a container
To start, create a container using the `useRevealContainer()` method of the Skyflow client as shown below.

```jsx
  const revealContainer = useRevealContainer();
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
The following `props` can be passed to a Skyflow reveal element: 

```javascript 
{
    container: 'RevealContainer' // Required, the reveal container.
    token:'string'               // Required, the actual data token.
    label: 'string',             // Optional, label for the form element.
    altText: 'string'            // Optional, string that is shown before reveal, will show token if altText is not provided.
    inputStyles: {},             // Optional, styles to be applied to the element.
    labelStyles: {},             // Optional, styles to be applied to the label of the reveal element.
    errorTextStyles: {},         // Optional, styles that will be applied to the errorText of the reveal element.
}   
```
**Note**: 

- The `inputStyles`, `labelStyles` and `errorTextStyles` parameters accepts a style object of `base` variant.
### End to end example using reveal element

```jsx
import React from 'react';
import { RevealElement, useRevealContainer } from 'skyflow-react-native';
import { View, Button, StyleSheet } from 'react-native';

const App = () => {
    const revealContainer = useRevealContainer();

    const handleReveal = () => {
        revealContainer.reveal().then((response) => {
            console.log('Reveal Success', JSON.stringify(response));
        }).catch((err) => {
            console.error('Reveal Failed', JSON.stringify(err));
        });
    };

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
                <Button title='Reveal' onPress={handleReveal} />
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
    button: {
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

If you discover a potential security issue in this project, please reach out to us at security@skyflow.com. Please don't create public GitHub issues or pull requests, as malicious actors could potentially view them.

## License

This project is licensed under the MIT license. See the [LICENSE](https://github.com/skyflowapi/skyflow-react-native/blob/main/LICENSE) file for more info.

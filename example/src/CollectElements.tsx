/*
 Copyright (c) 2022 Skyflow, Inc.
*/

import React from "react";
import { Button, StyleSheet, View } from "react-native";
import { CardHolderNameElement, CardNumberElement, ExpirationDateElement, InputFieldElement, useCollectContainer, ValidationRuleType } from 'skyflow-react-native';

const CollectElements = (props) => {
  const collectContainer = useCollectContainer();

  const lengthRule = {
    type: ValidationRuleType.LENGTH_MATCH_RULE,
    params: {
      min: 4,
      max: 8,
      error: "Must be between 4 and 8 alphabets"
    }
  };
  const ssnRegexRule = {
    type: ValidationRuleType.REGEX_MATCH_RULE,
    params: {
      regex: /^(?!(000|666|9))\d{3}-(?!00)\d{2}-(?!0000)\d{4}$/,
      error: "Invalid SSN"
    }
  }


  const handleCollect = () => {
    collectContainer.collect().then((response: any) => {
      console.log('Collect Success: ', JSON.stringify(response));
      const fieldsTokenData = response.records[0].fields;
      props.setTokens(fieldsTokenData);
    }).catch((err) => {
      console.error('Collect Failed: ', err);
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

  return (<View>
    <View style={viewStyles.box}>
      <CardNumberElement
        container={collectContainer}
        table='cards'
        column="card_number"
        placeholder="XXXX XXXX XXXX XXXX"
        label="Card Number"
        inputStyles={elementInputStyles}
        labelStyles={elementLabelStyles}
        errorTextStyles={errorTextStyles}
        onChange={handleOnChange}
      />
    </View>
    <View style={viewStyles.box}>
      <ExpirationDateElement
        container={collectContainer}
        table='cards'
        column="expiration_date"
        placeholder="MM/YYYY"
        label="Expiration Date"
        options={{
          format: 'MM/YYYY'
        }}
        inputStyles={elementInputStyles}
        errorTextStyles={errorTextStyles}
        onFocus={handleOnFocus}
      />
    </View>
    <View style={viewStyles.box}>
      <CardHolderNameElement
        container={collectContainer}
        table='cards'
        column="cardholder_name"
        placeholder="john"
        label="Name on Card"
        validations={[lengthRule]}
        inputStyles={elementInputStyles}
        errorTextStyles={errorTextStyles}
        onBlur={handleOnBlur}
      />
    </View>
    <View style={viewStyles.box}>
      <InputFieldElement
        container={collectContainer}
        table='cards'
        column="ssn"
        placeholder="XXX-XX-XXXX"
        label="SSN"
        validations={[ssnRegexRule]}
        inputStyles={elementInputStyles}
        errorTextStyles={errorTextStyles}
      />
    </View>
    <View style={viewStyles.box}>
      <Button title="Collect" onPress={handleCollect} />
    </View>
  </View>);
};

const elementInputStyles = StyleSheet.create({
  base: {
    borderWidth: 2,
    borderRadius: 4,
    borderColor: '#eae8ee',
    paddingVertical: 8,
    paddingHorizontal: 6,
    color: "#1d1d1d",
  },
  invalid: {
    color: '#f44336'
  }

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
})

export default CollectElements;
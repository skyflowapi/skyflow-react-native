/*
  Copyright (c) 2022 Skyflow, Inc.
*/

import React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import {
  CardHolderNameElement,
  CardNumberElement,
  CvvElement,
  ExpirationDateElement,
  InputFieldElement,
  useCollectContainer,
  ValidationRuleType,
} from 'skyflow-react-native';

const CollectElements = props => {
  const collectContainer = useCollectContainer();

  const options = {
    tokens: true,
    additionalFields: {
      records: [
        {
          table: "table1",
          fields: {
            skyflowID: "",     //Add a valid skyflow-id for which you want to update the data
            gender: "MALE",
          },
        }
      ],
    },
  };

  const handleCollect = () => {
    collectContainer
      .collect(options)
      .then((response: any) => {
        console.log('Collect Success: ', JSON.stringify(response));
        const fieldsTokenData = response.records[0].fields;
        props.setTokens(fieldsTokenData);
      })
      .catch(err => {
        console.error('Collect Failed: ', err);
      });
  };

  const handleOnChange = state => {
    console.log('Change Listener Triggered', state);
  };

  const handleOnFocus = state => {
    console.log('Focus Listener Triggered', state);
  };

  const handleOnBlur = state => {
    console.log('Blur Listener Triggered', state);
  };

  return (
    <View>
      <View style={viewStyles.box}>
        <CardNumberElement
          container={collectContainer}
          table='cards'
          column='card_number'
          placeholder='XXXX XXXX XXXX XXXX'
          label='Card Number'
          inputStyles={cardNumElementInputStyles}
          labelStyles={elementLabelStyles}
          errorTextStyles={errorTextStyles}
          onChange={handleOnChange}
          skyflowID=''   //Add a valid skyflow-id for which you want to update the data
        />
      </View>
      <View style={viewStyles.box}>
        <ExpirationDateElement
          container={collectContainer}
          table='cards'
          column='expiration_date'
          placeholder='MM/YYYY'
          label='Expiration Date'
          options={{
            format: 'MM/YYYY',
          }}
          inputStyles={elementInputStyles}
          errorTextStyles={errorTextStyles}
          onFocus={handleOnFocus}
          skyflowID=''   //Add a valid skyflow-id for which you want to update the data
        />
      </View>
      <View style={viewStyles.box}>
        <CardHolderNameElement
          container={collectContainer}
          table='cards'
          column='cardholder_name'
          placeholder='john'
          label='Name on Card'
          inputStyles={elementInputStyles}
          errorTextStyles={errorTextStyles}
          onBlur={handleOnBlur}
        />
      </View>
      <View style={viewStyles.box}>
        <CvvElement
          container={collectContainer}
          table='cards'
          column='card_cvv'
          placeholder='cvv'
          label='Card CVV'
          inputStyles={elementInputStyles}
          errorTextStyles={errorTextStyles}
          skyflowID=''   //Add a valid skyflow-id for which you want to update the data
        />
      </View>
      <View style={viewStyles.box}>
        <Button title='Collect' onPress={handleCollect} />
      </View>

      <View style={viewStyles.box}>
        <Button title='Reset' onPress={props.handleReset} />
      </View>
    </View>
  );
};

const cardNumElementInputStyles = StyleSheet.create({
  base: {
    color: '#1d1d1d',
  },
  invalid: {
    color: '#f44336',
  },
});

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
    color: '#f44336',
  },
});

const elementLabelStyles = StyleSheet.create({
  focus: {
    fontWeight: 'bold',
  },
});

const errorTextStyles = StyleSheet.create({
  base: {
    color: '#f44336',
  },
});

const viewStyles = StyleSheet.create({
  box: {
    marginVertical: 5,
  },
});

export default CollectElements;

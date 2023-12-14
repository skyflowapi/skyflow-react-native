/*
  Copyright (c) 2022 Skyflow, Inc.
*/

import React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import {
  RedactionType,
  RevealElement,
  useRevealContainer,
  useSkyflow,
} from 'skyflow-react-native';

const RevealElements = (props) => {
  const revealContainer = useRevealContainer();
  const skyflowContainer = useSkyflow();

  const handleReveal = () => {
    revealContainer
      .reveal()
      .then(response => {
        console.log('Reveal Success', JSON.stringify(response));
      })
      .catch(err => {
        console.error('Reveal Failed', JSON.stringify(err));
      });
  };

  const handleGet = () =>{
    const getRecord1 = {
      ids: [
        '<SKYFLOW_ID_1>',
        '<SKYFLOW_ID_2>',
      ],
      table: 'cards',
    };

    const getRecord2 = {
      table: 'cards',
      columnName: '<COLUMN_NAME>',
      columnValues: ['<COLUMN_VALUE_1>', '<COLUMN_VALUE_2>'],
    };

    const getRequest1 = { records: [getRecord1] };

    const getRequest2 = {
      records: [
        { ...getRecord1, redaction: RedactionType.PLAIN_TEXT },
        { ...getRecord2, redaction: RedactionType.PLAIN_TEXT },
      ],
    };

    // Get Tokens by Skyflow ID
    skyflowContainer
      .get(getRequest1, { tokens: true })
      .then((response) => {
        console.log('Get request 1 Success', JSON.stringify(response));
      })
      .catch((err) => {
        console.error('Get request 1 Failed', JSON.stringify(err));
      });

    // get by Skyflow ID and Column Values
    skyflowContainer
      .get(getRequest2, { tokens: false })
      .then((response) => {
        console.log('Get request 2 Success', JSON.stringify(response));
      })
      .catch((err) => {
        console.error('Get request 2 Failed', JSON.stringify(err));
      });
  };

  return (
    <View>
      <RevealElement
        token={props.tokens.card_number}
        container={revealContainer}
        label='Card Number'
        altText='XXXX XXXX XXXX XXXX'
        inputStyles={revealInputStyles}
        labelStyles={revealLabelStyles}
        errorTextStyles={revealerrorTextStyles}
        redaction={RedactionType.REDACTED}
      />
      <RevealElement
        token={props.tokens.expiration_date}
        container={revealContainer}
        label='Expiration Date'
        altText='XX/XXXX'
        inputStyles={revealInputStyles}
        labelStyles={revealLabelStyles}
        errorTextStyles={revealerrorTextStyles}
        redaction={RedactionType.PLAIN_TEXT}
      />
      <RevealElement
        token={props.tokens.cardholder_name}
        container={revealContainer}
        label='Name on Card'
        altText='XXXXX'
        inputStyles={revealInputStyles}
        labelStyles={revealLabelStyles}
        errorTextStyles={revealerrorTextStyles}
        redaction={RedactionType.DEFAULT}
      />
      <RevealElement
        token={props.tokens.ssn}
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
      <View style={buttonStyles.button}>
        <Button title='Get method' onPress={handleGet} />
      </View>
      <View style={buttonStyles.button}>
        <Button
          title='GO TO COLLECT'
          onPress={() => {
            props.setShowRevealView(null);
          }}
        />
      </View>
      <View style={buttonStyles.button}>
        <Button
          title='HOME'
          onPress={props.handleReset}
        />
      </View>
    </View>
  );
};

const revealInputStyles = StyleSheet.create({
  base: {
    color: '#1c1e21',
    fontWeight: '600',
  },
});

const revealLabelStyles = StyleSheet.create({
  base: {
    color: '#1c1e21',
    fontWeight: '400',
  },
});

const revealerrorTextStyles = StyleSheet.create({
  base: {
    color: 'orangered',
  },
});

const buttonStyles = StyleSheet.create({
  button: {
    margin: 10,
  },
});
export default RevealElements;

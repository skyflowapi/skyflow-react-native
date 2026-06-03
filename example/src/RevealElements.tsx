/*
  Copyright (c) 2022 Skyflow, Inc.
*/

import React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import {
  OrderBy,
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
    const getRecordByIds = {
      ids: ['<SKYFLOW_ID_1>', '<SKYFLOW_ID_2>'],
      table: 'cards',
    };

    const getRecordByColumn = {
      table: 'cards',
      columnName: '<COLUMN_NAME>',
      columnValues: ['<COLUMN_VALUE_1>', '<COLUMN_VALUE_2>'],
    };

    // Get tokens by Skyflow ID
    skyflowContainer
      .get(
        { records: [getRecordByIds] },
        { tokens: true }
      )
      .then((response) => {
        console.log('Get tokens Success', JSON.stringify(response));
      })
      .catch((err) => {
        console.error('Get tokens Failed', JSON.stringify(err));
      });

    // Get plain text by Skyflow ID and column values
    skyflowContainer
      .get(
        {
          records: [
            { ...getRecordByIds, redaction: RedactionType.PLAIN_TEXT },
            { ...getRecordByColumn, redaction: RedactionType.PLAIN_TEXT },
          ],
        },
        { tokens: false }
      )
      .then((response) => {
        console.log('Get plain text Success', JSON.stringify(response));
      })
      .catch((err) => {
        console.error('Get plain text Failed', JSON.stringify(err));
      });

    // Get specific fields only (column-scoped policy compatible)
    skyflowContainer
      .get(
        {
          records: [
            {
              ...getRecordByIds,
              redaction: RedactionType.PLAIN_TEXT,
              fields: ['occupation', 'annual_income'],
            },
          ],
        },
        { tokens: false }
      )
      .then((response) => {
        console.log('Get with fields Success', JSON.stringify(response));
      })
      .catch((err) => {
        console.error('Get with fields Failed', JSON.stringify(err));
      });

    // Get with pagination and ordering
    skyflowContainer
      .get(
        {
          records: [
            {
              ...getRecordByColumn,
              redaction: RedactionType.PLAIN_TEXT,
              fields: ['name', 'email'],
              offset: '0',
              limit: '10',
            },
          ],
        },
        {
          tokens: false,
          orderBy: OrderBy.ASCENDING,
          downloadURL: false,
        }
      )
      .then((response) => {
        console.log('Get with pagination Success', JSON.stringify(response));
      })
      .catch((err) => {
        console.error('Get with pagination Failed', JSON.stringify(err));
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
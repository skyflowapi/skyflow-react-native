/*
  Copyright (c) 2022 Skyflow, Inc.
*/

import React from 'react';
import {Button, StyleSheet, View} from 'react-native';
import {RedactionType, RevealElement, useRevealContainer} from 'skyflow-react-native';

const RevealElements = props => {
  const revealContainer = useRevealContainer();

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
        <Button
          title='Reset'
          onPress={() => {
            props.setShowRevealView(null);
          }}
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

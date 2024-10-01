/*
  Copyright (c) 2022 Skyflow, Inc.
*/

import React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import {
  CardHolderNameElement,
  CardNumberElement,
  ExpirationDateElement,
  InputFieldElement,
  useCollectContainer,
  CardType
} from 'skyflow-react-native';

const CoBrandedCard = (props) => {

  const collectContainer = useCollectContainer();

  const handleCollect = () => {
    collectContainer
      .collect()
      .then((response: any) => {
        console.log('Collect Success: ', JSON.stringify(response));
        const fieldsTokenData = response.records[0].fields;
      })
      .catch((err) => {
        console.error('Collect Failed: ', err);
      });
  };

  const binLookup = (bin) => {
    const myHeaders = new Headers();
    myHeaders.append("X-skyflow-authorization", "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2MiOiJmNzk0ZmY4NmZiYzgxMWVhYmQ2YzNhOTExNDNlM2Q0MiIsImF1ZCI6Imh0dHBzOi8vbWFuYWdlLnNreWZsb3dhcGlzLmRldiIsImV4cCI6MTcyNzc4NTE3NywiaWF0IjoxNzI3Njk4Nzc3LCJpc3MiOiJzYS1hdXRoQG1hbmFnZS5za3lmbG93YXBpcy5kZXYiLCJqdGkiOiJhYzkwYzM1NzM5MmE0OTE0ODAzNGEzZTgxMGU1YzAyOSIsInN1YiI6ImcwMjg1ZDNhYTY2ODQzNDJhZTU1MmMyMDU0YjJmZTY0In0.mG60KBC9B8Heud1hPhyrCX2CJ4xggbpCbNxS6mNRQnLBmvoIW3xqkjG4mQ9LUY5hnCwyQJlPAbzTB2U2FpYruau8LjZz0ZijFvSvVcYBoDtA7m1h8LONbyGYwLmz6q4a3yyJexJ2x4Dab4WNB0PN1m8dgM4nT5KuXjv7q2-AAwY9T3HpvztRJFBMUIMVBXAirlq8sqFaPvqMD6E2wl9AB70tHR5X_hGVo5szo9EJX0G8ddJBYLrkdZJUPXHFxyzWpv1CM6FLL3JiZxDrtdoNPk-dk4YgTSKIA_NgjxWFkMcCrOebSjR7-9XEkrXpQZXf4C2BBLaH4yaEAZHEcZr9ow");
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify({
      "BIN": bin
    });
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };
    return fetch("https://sb.area51.vault.skyflowapis.dev/v1/card_lookup", requestOptions);
  };

  const getCardSchemes = (cardData)=>{
    let schemeList = [];
    cardData.forEach((card)=>{
      if(card.card_scheme === 'VISA'){
          schemeList.push(CardType.VISA);
      }else if(card.card_scheme === 'MASTERCARD'){
          schemeList.push(CardType.MASTERCARD)
      }else if(card.card_scheme === 'CARTES BANCAIRES'){
        schemeList.push(CardType.CARTES_BANCAIRES)
      }
    })
    return schemeList
  }

  const [scheme, setScheme] = React.useState<CardType[]>([]);

  let calledUpdate = false;

  const handleOnChange = (state) => {
    console.log("onChange event triggered: ", state)
    const currentBin = state.value.slice(0, 8);
    if (currentBin.length >= 8 && !calledUpdate) {
      calledUpdate = true;
      // Perform Bin Lookup
      binLookup(currentBin)
        .then((response) => response.text())
        .then((result) => {
          console.log("RESULT OF BIN_LOOKUP: ", result)
          const cardData = JSON.parse(result)['cards_data'];
          const schemeList = getCardSchemes(cardData);
          setScheme(schemeList);
        })
        .catch((error) => console.error(error));
    } else if(currentBin.length < 8 && calledUpdate){
        calledUpdate = false
        setScheme([])
      }
  };

  

  return (
    <View style={viewStyles.container}>
      <View style={viewStyles.box}>
        <CardNumberElement
          container={collectContainer}
          table="cards"
          column="card_number"
          placeholder="XXXX XXXX XXXX XXXX"
          label={'Card number'}
          inputStyles={cardNumElementInputStyles}
          labelStyles={elementLabelStyles}
          errorTextStyles={errorTextStyles}
          onChange={handleOnChange}
          options={{
            cardMetadata: { scheme: scheme }
          }}
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
        />
      </View>
      <View style={viewStyles.box}>
        <CardHolderNameElement
          container={collectContainer}
          table='cards'
          column='cardholder_name'
          placeholder={'Name'}
          label={'Cardholder name'}
          inputStyles={elementInputStyles}
          labelStyles={elementLabelStyles}
          errorTextStyles={errorTextStyles}
        />
      </View>
      <View style={viewStyles.box}>
        <InputFieldElement
          container={collectContainer}
          table='cards'
          column='ssn'
          placeholder='XXX-XX-XXXX'
          label='SSN'
          inputStyles={elementInputStyles}
          errorTextStyles={errorTextStyles}
        />
      </View>
      <View style={viewStyles.box}>
        <Button title="Collect" onPress={handleCollect} />
      </View>
      <View style={viewStyles.box}>
        <Button title="Reset" onPress={props.handleReset} />
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
  container: {
    padding: 10
  }
});

export default CoBrandedCard;

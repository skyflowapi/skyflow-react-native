/*
  Copyright (c) 2023 Skyflow, Inc.
*/

import React from 'react';
import { Button, Text, View } from 'react-native';
import {
    CardHolderNameElement,
    CardNumberElement,
    ComposableContainer,
    CvvElement,
    ExpirationDateElement,
    useComposableContainer,
} from 'skyflow-react-native';

const ComposableElements = props => {

    const options = {
        layout: [3, 1],
        styles: {
            base: {
                borderWidth: 2,
                borderRadius: 4,
                borderColor: '#eae8ee',
                paddingVertical: 4,
                paddingHorizontal: 5,
                marginLeft: 5,
                marginRight: 5,
                justifyContent: 'space-between',
                color: '#1d1d1d',
            }
        },
        errorTextStyles: {
            base: {
                color: 'green',
            }
        }
    }

    const handleEvent = (event) => {
        console.log('Event Emitted', event);
    }

    const container = useComposableContainer(options);

    const handleCollect = () => {
        container
            .collect()
            .then((response: any) => {
                console.log('Collect Success: ', JSON.stringify(response));
            })
            .catch(err => {
                console.error('Collect Failed: ', err);
            });
    };
    return (
        <View style={{ marginTop: 10 }}>
            <Text style={{ marginBottom: 10, alignSelf: 'center', fontWeight: 'bold' }}>Composable Elements</Text>
            <ComposableContainer container={container}>
                <CardNumberElement
                    container={container}
                    table='cards'
                    column='card_number'
                    placeholder='XXXX XXXX XXXX XXXX'
                    onChange={handleEvent}
                />
                <ExpirationDateElement
                    container={container}
                    table='cards'
                    column='expiry_date'
                    placeholder='MM/YYYY'
                    options={{
                        format: 'MM/YYYY',
                    }}
                    onBlur={handleEvent}
                />
                <CvvElement
                    container={container}
                    table='cards'
                    column='cvv'
                    placeholder='XXXX'
                    onFocus={handleEvent}
                />

                <CardHolderNameElement
                    container={container}
                    table='cards'
                    column='first_name'
                    placeholder='john'
                    onBlur={handleEvent}
                />

            </ComposableContainer>
            <View style={{ margin: 4 }}>
                <Button title='Collect' onPress={handleCollect} />
            </View>
            <View style={{ margin: 4 }}>
                <Button title='Reset' onPress={props.handleReset} />
            </View>
        </View>
    );
};

export default ComposableElements;

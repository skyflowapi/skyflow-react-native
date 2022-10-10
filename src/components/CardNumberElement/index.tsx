/*
 Copyright (c) 2022 Skyflow, Inc.
*/
import React, { useEffect } from "react";
import { Text, TextInput, View } from "react-native";
import type CollectElement from "../../core/CollectElement";
import { CARD_NUMBER_MASK, DEFAULT_CARD_INPUT_MAX_LENGTH } from "../../core/constants";
import { CollectElementProps, ElementType } from "../../utils/constants";

const CardNumberElement: React.FC<CollectElementProps> = ({ container, options,...rest }) => {
    const [element,setElement] = React.useState<CollectElement>(undefined);
    const [elementValue,setElementValue] = React.useState<string>('');
    const [errorText,setErrorText] = React.useState<string>('');
    const [maxLength,setMaxLength] = React.useState<number>(DEFAULT_CARD_INPUT_MAX_LENGTH);
    const [labelStyles,setLabelStyles] = React.useState(rest?.labelStyles?.base || {});
    const [inputStyles,setInputStyles] = React.useState(rest?.inputStyles?.base || {});

    useEffect(() => {
        const element:CollectElement = container.create({...rest,type:ElementType.CARD_NUMBER},options);
        setElement(element);
        if(rest.onReady){
            rest.onReady(element.getInternalState());
        }
    }, []);
    return (<View>
        <Text style={labelStyles}>{rest.label}</Text>
        <TextInput
            value={elementValue}
            placeholder={rest.placeholder}
            onChangeText={(text)=>{
                element?.onChangeElement(text)
                setElementValue(element.getInternalState().value)
                setMaxLength(CARD_NUMBER_MASK[element.getCardType()].length || DEFAULT_CARD_INPUT_MAX_LENGTH);
            }}
            onFocus={()=>{
                element?.onFocusElement();
                setLabelStyles(element.updateLabelStyles());
                setInputStyles(element.updateInputStyles());
            }}
            onBlur={()=>{
                element?.onBlurElement();
                setErrorText(element?.getErrorText() || '');
                setElementValue(element.getInternalState().value);
                setLabelStyles(element.updateLabelStyles());
                setInputStyles(element.updateInputStyles());
            }}
            keyboardType='numeric'
            maxLength={maxLength}
            style={inputStyles}
        />
        <Text style={rest?.errorTextStyles?.base || {}}>{errorText}</Text> 
    </View>);
}

export default CardNumberElement;
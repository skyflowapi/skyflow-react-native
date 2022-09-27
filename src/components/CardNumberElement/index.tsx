import React, { useEffect } from "react";
import { Text, TextInput, View } from "react-native";
import type CollectElement from "../../core/CollectElement";
import { CARD_NUMBER_MASK, CARD_TYPE_REGEX, DEFAULT_CARD_INPUT_MAX_LENGTH } from "../../core/constants";
import { CollectElementProps, ElementType } from "../../utils/constants";

const CardNumberElement: React.FC<CollectElementProps> = ({ container, options,...rest }) => {
    const [element,setElement] = React.useState<CollectElement>(undefined);
    const [elementValue,setElementValue] = React.useState<string>('');
    const [errorText,setErrorText] = React.useState<string>('');
    const [maxLength,setMaxLength] = React.useState<number>(DEFAULT_CARD_INPUT_MAX_LENGTH);
    useEffect(() => {
        const element:CollectElement = container.create({...rest,type:ElementType.CARD_NUMBER},options);
        setElement(element);
        if(rest.onReady){
            rest.onReady(element.getInternalState());
        }
    }, []);
    return (<View>
        <Text>{rest.label}</Text>
        <TextInput
            value={elementValue}
            placeholder={rest.placeholder}
            onChangeText={(text)=>{
                element?.onChangeElement(text)
                setElementValue(element.getInternalState().value)
                setMaxLength(CARD_NUMBER_MASK[element.getCardType()].length || DEFAULT_CARD_INPUT_MAX_LENGTH);
            }}
            onFocus={()=>{
                element?.onFocusElement()
            }}
            onBlur={()=>{
                element?.onBlurElement();
                setErrorText(element?.errorText || '');
                setElementValue(element.getInternalState().value)
            }}
            keyboardType='numeric'
            maxLength={maxLength}
        />
        <Text>{errorText}</Text> 
    </View>);
}

export default CardNumberElement;
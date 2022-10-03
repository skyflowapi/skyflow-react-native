import React, { useEffect } from "react";
import { Text, TextInput, View } from "react-native";
import type CollectElement from "../../core/CollectElement";
import { DEFAULT_EXPIRATION_DATE_FORMAT } from "../../core/constants";
import { CollectElementProps, ElementType } from "../../utils/constants";

const ExpirationDateElement: React.FC<CollectElementProps> = ({ container, options={format:DEFAULT_EXPIRATION_DATE_FORMAT},...rest }) => {
    const [element,setElement] = React.useState<CollectElement>();
    const [elementValue,setElementValue] = React.useState<string>('');
    const [errorText,setErrorText] = React.useState<string>('');
    useEffect(() => {
        const element:CollectElement = container.create({...rest,type:ElementType.EXPIRATION_DATE},options);
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
                element?.onChangeElement(text);
                setElementValue(element.getInternalState().value)
            }}
            onFocus={()=>{
                element?.onFocusElement()
            }}
            onBlur={()=>{
                element?.onBlurElement();
                setErrorText(element?.getErrorText() || '');
                setElementValue(element.getInternalState().value)
            }}
            maxLength={options.format.length}
            keyboardType='numeric'
        />
        <Text>{errorText}</Text> 
    </View>);
}

export default ExpirationDateElement;
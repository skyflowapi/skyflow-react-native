import React, { useEffect } from "react";
import { Text, TextInput, View } from "react-native";
import type CollectElement from "../../core/CollectElement";
import { CollectElementProps, ElementType } from "../../utils/constants";

const CardHolderNameElement: React.FC<CollectElementProps> = ({ container, options,...rest }) => {
    const [element,setElement] = React.useState<CollectElement>();
    const [errorText,setErrorText] = React.useState<string>('');
    useEffect(() => {
        const element:CollectElement = container.create({...rest,type:ElementType.CARDHOLDER_NAME},options);
        setElement(element);
        if(rest.onReady){
            rest.onReady(element.getInternalState());
        }
    }, []);

    return (<View>
        <Text>{rest.label}</Text>
        <TextInput
            placeholder={rest.placeholder}
            onChangeText={(text)=>{
                element?.onChangeElement(text)
            }}
            onFocus={()=>{
                element?.onFocusElement()
            }}
            onBlur={()=>{
                element?.onBlurElement();
                setErrorText(element?.getErrorText() || '');
            }}
        />
        <Text>{errorText}</Text> 
    </View>);
}

export default CardHolderNameElement;
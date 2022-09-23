import React, { useEffect } from "react";
import { Text, TextInput, View } from "react-native";
import type CollectElement from "../../core/CollectElement";
import { FOUR_DIGIT_YEAR_FORMAT, TWO_DIGIT_YEAR_FORMAT } from "../../core/constants";
import { CollectElementProps, ElementType } from "../../utils/constants";

const ExpirationYearElement: React.FC<CollectElementProps> = ({ container, options={format:TWO_DIGIT_YEAR_FORMAT},...rest }) => {
    const [element,setElement] = React.useState<CollectElement>();
    const [errorText,setErrorText] = React.useState<string>('');
    useEffect(() => {
        const element:CollectElement = container.create({...rest,type:ElementType.EXPIRATION_YEAR},options);
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
                element?.onChangeElement(text);
            }}
            onFocus={()=>{
                element?.onFocusElement();
            }}
            onBlur={()=>{
                element?.onBlurElement();
                setErrorText(element?.errorText || '');
            }}
            maxLength={options?.format === FOUR_DIGIT_YEAR_FORMAT ? 4 : 2}
            keyboardType='numeric'
        />
        <Text>{errorText}</Text> 
    </View>);
}

export default ExpirationYearElement;
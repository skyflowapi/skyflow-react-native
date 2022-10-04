import React, { useEffect } from "react";
import { Text, TextInput, View } from "react-native";
import type CollectElement from "../../core/CollectElement";
import { CollectElementProps, DEFAULT_COLLECT_ELEMENT_STYLES, ElementType } from "../../utils/constants";

const ExpirationMonthElement: React.FC<CollectElementProps> = ({ container, options,...rest }) => {
    const [element,setElement] = React.useState<CollectElement>();
    const [elementValue,setElementValue] = React.useState<string>('');
    const [errorText,setErrorText] = React.useState<string>('');
    const [labelStyles,setLabelStyles] = React.useState(rest?.labelStyles?.base || {});
    const [inputStyles,setInputStyles] = React.useState({base: rest?.inputStyles?.base }|| DEFAULT_COLLECT_ELEMENT_STYLES.base);

    useEffect(() => {
        const element:CollectElement = container.create({...rest,type:ElementType.EXPIRATION_MONTH},options);
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
                element?.onChangeElement(text);
                setElementValue(element.getInternalState().value)
            }}
            onFocus={()=>{
                element?.onFocusElement()
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
            maxLength={2}
            keyboardType='numeric'
            style={inputStyles}
        />
        <Text style={rest?.errorTextStyles?.base || {}}>{errorText}</Text> 
    </View>);
}

export default ExpirationMonthElement;
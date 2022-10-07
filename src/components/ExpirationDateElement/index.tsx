import React, { useEffect } from "react";
import { Text, TextInput, View } from "react-native";
import type CollectElement from "../../core/CollectElement";
import { DEFAULT_EXPIRATION_DATE_FORMAT } from "../../core/constants";
import { CollectElementOptions, CollectElementProps, ElementType } from "../../utils/constants";
import { formatCollectElementOptions } from "../../utils/helpers";

const ExpirationDateElement: React.FC<CollectElementProps> = ({ container, options,...rest }) => {
    const [element,setElement] = React.useState<CollectElement>();
    const [elementValue,setElementValue] = React.useState<string>('');
    const [errorText,setErrorText] = React.useState<string>('');
    const [labelStyles,setLabelStyles] = React.useState(rest?.labelStyles?.base || {});
    const [inputStyles,setInputStyles] = React.useState(rest?.inputStyles?.base || {});
    const [maxLength,setMaxLength] = React.useState(DEFAULT_EXPIRATION_DATE_FORMAT.length);

    useEffect(() => {
        const elementOptions:CollectElementOptions = formatCollectElementOptions(ElementType.EXPIRATION_DATE,options,container.getContext().logLevel);
        setMaxLength(elementOptions.format.length);
        const element:CollectElement = container.create({...rest,type:ElementType.EXPIRATION_DATE},elementOptions);
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
            maxLength={maxLength}
            keyboardType='numeric'
            style={inputStyles}
        />
        <Text style={rest?.errorTextStyles?.base || {}}>{errorText}</Text> 
    </View>);
}

export default ExpirationDateElement;
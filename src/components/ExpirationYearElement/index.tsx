import React, { useEffect } from "react";
import { Text, TextInput, View } from "react-native";
import type CollectElement from "../../core/CollectElement";
import { DEFAULT_EXPIRATION_YEAR_FORMAT } from "../../core/constants";

import { CollectElementOptions, CollectElementProps, ElementType } from "../../utils/constants";
import { formatCollectElementOptions } from "../../utils/helpers";

const ExpirationYearElement: React.FC<CollectElementProps> = ({ container, options,...rest }) => {
    const [element,setElement] = React.useState<CollectElement>();
    const [errorText,setErrorText] = React.useState<string>('');
    const [labelStyles,setLabelStyles] = React.useState(rest?.labelStyles?.base || {});
    const [inputStyles,setInputStyles] = React.useState(rest?.inputStyles?.base || {});
    const [maxLength,setMaxLength] = React.useState(DEFAULT_EXPIRATION_YEAR_FORMAT.length);

    useEffect(() => {
        const elementOptions:CollectElementOptions = formatCollectElementOptions(ElementType.EXPIRATION_YEAR,options,container.getContext().logLevel);
        setMaxLength(elementOptions.format.length);
        const element:CollectElement = container.create({...rest,type:ElementType.EXPIRATION_YEAR},elementOptions);
        setElement(element);
        if(rest.onReady){
            rest.onReady(element.getInternalState());
        }
    }, []);

    return (<View>
        <Text style={labelStyles}>{rest.label}</Text>
        <TextInput
            placeholder={rest.placeholder}
            onChangeText={(text)=>{
                element?.onChangeElement(text);
            }}
            onFocus={()=>{
                element?.onFocusElement();
                setLabelStyles(element.updateLabelStyles());
                setInputStyles(element.updateInputStyles());
            }}
            onBlur={()=>{
                element?.onBlurElement();
                setErrorText(element?.getErrorText() || '');
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

export default ExpirationYearElement;
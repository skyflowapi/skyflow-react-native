import React, { useEffect } from "react";
import { Text, TextInput, View } from "react-native";
import type CollectElement from "../../core/CollectElement";
import { CollectElementProps, DEFAULT_COLLECT_ELEMENT_STYLES, ElementType } from "../../utils/constants";

const InputField: React.FC<CollectElementProps> = ({ container, options,...rest }) => {
    const [element,setElement] = React.useState<CollectElement>();
    const [errorText,setErrorText] = React.useState<string>('');
    const [labelStyles,setLabelStyles] = React.useState(rest?.labelStyles?.base || {});
    const [inputStyles,setInputStyles] = React.useState({base: rest?.inputStyles?.base }|| DEFAULT_COLLECT_ELEMENT_STYLES.base);

    useEffect(() => {
        const element:CollectElement = container.create({...rest,type:ElementType.INPUT_FIELD},options);
        setElement(element);
        if(rest.onReady){
            rest.onReady(element.getClientState());
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
            style={inputStyles}
        />
        <Text style={rest?.errorTextStyles?.base || {}}>{errorText}</Text> 
    </View>);
}

export default InputField;
/*
 Copyright (c) 2022 Skyflow, Inc.
*/
import React, { useEffect } from "react";
import { Text } from "react-native";
import RevealSkyflowElement from "../../core/RevealSkyflowElement";
import { RevealElementProps } from "../../utils/constants"


const RevealElement: React.FC<RevealElementProps> = ({container,label,...rest})=>{
    const [element,setElement] = React.useState<RevealSkyflowElement>(undefined);
    const [errorText,setErrorText] = React.useState<string>('');
    const [value,setValue] = React.useState(rest?.altText || rest.token);

    useEffect(()=>{
        const revealElement = container.create(rest);
        setElement(revealElement);
        revealElement.setMethods(setValue, setErrorText);
    },[]);

    return <>
        <Text style={rest.labelStyles?.base || {}}>{label}</Text>
        <Text selectable style={rest?.inputStyles?.base || {}}>{value}</Text>
        <Text style={rest?.errorTextStyles?.base || {}}>{errorText}</Text>
    </>

}

export default RevealElement;
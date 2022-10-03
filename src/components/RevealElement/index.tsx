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
        <Text>{label}</Text>
        <Text selectable>{value}</Text>
        <Text>{errorText}</Text>
    </>

}

export default RevealElement;
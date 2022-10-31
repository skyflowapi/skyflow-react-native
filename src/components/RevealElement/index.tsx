/*
 Copyright (c) 2022 Skyflow, Inc.
*/
import React, { useEffect } from "react";
import { Text } from "react-native";
import RevealSkyflowElement from "../../core/RevealSkyflowElement";
import { RevealElementProps } from "../../utils/constants"
import SkyflowError from "../../utils/skyflow-error";
import SKYFLOW_ERROR_CODE from "../../utils/skyflow-error-code";


const RevealElement: React.FC<RevealElementProps> = ({ container, label, ...rest }) => {
    const [element, setElement] = React.useState<RevealSkyflowElement>(undefined);
    const [errorText, setErrorText] = React.useState<string>('');
    const [value, setValue] = React.useState(rest?.altText || rest.token);

    useEffect(() => {
        if (container) {
            const revealElement = container.create(rest);
            setElement(revealElement);
            revealElement.setMethods(setValue, setErrorText);
        } else {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.CONTAINER_OBJECT_IS_REQUIRED, ['Reveal', 'useRevealContainer()'], true)
        }

    }, []);

    return <>
        <Text style={rest.labelStyles?.base || {}}>{label}</Text>
        <Text selectable style={rest?.inputStyles?.base || {}}>{value}</Text>
        <Text style={rest?.errorTextStyles?.base || {}}>{errorText}</Text>
    </>

}

export default RevealElement;
/*
 Copyright (c) 2022 Skyflow, Inc.
*/
import React, { useEffect, useImperativeHandle, forwardRef } from "react";
import { Text } from "react-native";
import RevealSkyflowElement from "../../core/RevealSkyflowElement";
import { RevealElementProps } from "../../utils/constants"
import SkyflowError from "../../utils/skyflow-error";
import SKYFLOW_ERROR_CODE from "../../utils/skyflow-error-code";

const RevealElement = forwardRef((props: RevealElementProps, ref) => {
    const { container, label, ...rest } = props;
    const [element, setElement] = React.useState<RevealSkyflowElement | undefined>(undefined);
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

    useImperativeHandle(ref, () => ({
        setToken: (newToken: string) => {
            if (element) {
                element.setToken(newToken);
                setValue(newToken);
            } else {
                throw new SkyflowError(SKYFLOW_ERROR_CODE.ELEMENT_NOT_FOUND, ['RevealElement'], true);
            }
        }
    }), [element]);

    return (
        <>
            <Text style={rest.labelStyles?.base || {}}>{label}</Text>
            <Text selectable style={rest?.inputStyles?.base || {}}>{value}</Text>
            <Text style={rest?.errorTextStyles?.base || {}}>{errorText}</Text>
        </>
    );
});

RevealElement.displayName = 'RevealElement';

export default RevealElement;
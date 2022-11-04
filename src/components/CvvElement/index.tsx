/*
 Copyright (c) 2022 Skyflow, Inc.
*/
import React, { useEffect } from "react";
import { Text, TextInput, View } from "react-native";
import type CollectElement from "../../core/CollectElement";
import { CollectElementProps, ElementType, ELEMENT_REQUIRED_ASTERISK, REQUIRED_MARK_DEFAULT_STYLE } from "../../utils/constants";
import SkyflowError from "../../utils/skyflow-error";
import SKYFLOW_ERROR_CODE from "../../utils/skyflow-error-code";

const CvvElement: React.FC<CollectElementProps> = ({ container, options = { requried: false }, ...rest }) => {
    const [element, setElement] = React.useState<CollectElement>();
    const [errorText, setErrorText] = React.useState<string>('');
    const [labelStyles, setLabelStyles] = React.useState(rest?.labelStyles?.base || {});
    const [inputStyles, setInputStyles] = React.useState(rest?.inputStyles?.base || {});

    useEffect(() => {
        if (container) {
            const element: CollectElement = container.create({ ...rest, type: ElementType.CVV }, options);
            element.setMethods(setErrorText, { setInputStyles: setInputStyles, setLabelStyles: setLabelStyles });
            element.setMethods(setErrorText);
            if (rest.onReady) {
                rest.onReady(element.getClientState());
            }
        } else {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.CONTAINER_OBJECT_IS_REQUIRED, [ElementType.CVV, 'useCollectContainer()'], true)
        }
    }, []);

    return (<View>
        {
            rest.label && (<Text style={labelStyles}>
                {rest.label}
                <Text style={{ ...REQUIRED_MARK_DEFAULT_STYLE, ...rest?.labelStyles?.requiredAsterick } }>
                    {options.required ? ELEMENT_REQUIRED_ASTERISK : ''}
                </Text>
            </Text>)
        }
        <TextInput
            placeholder={rest.placeholder}
            onChangeText={(text) => {
                element?.onChangeElement(text)
            }}
            onFocus={() => {
                element?.onFocusElement();
                setLabelStyles(element.updateLabelStyles());
                setInputStyles(element.updateInputStyles());
            }}
            onBlur={() => {
                element?.onBlurElement();
                setErrorText(element?.getErrorText() || '');
                setLabelStyles(element.updateLabelStyles());
                setInputStyles(element.updateInputStyles());
            }}
            maxLength={4}
            keyboardType='numeric'
            style={inputStyles}
        />
        <Text style={rest?.errorTextStyles?.base || {}}>{errorText}</Text>
    </View>);
}

export default CvvElement;
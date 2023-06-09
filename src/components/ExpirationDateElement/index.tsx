/*
 Copyright (c) 2022 Skyflow, Inc.
*/
import React, { useEffect } from "react";
import { Text, TextInput, View } from "react-native";
import type CollectElement from "../../core/CollectElement";
import { DEFAULT_EXPIRATION_DATE_FORMAT } from "../../core/constants";
import { CollectElementOptions, CollectElementProps, ElementType, ELEMENT_REQUIRED_ASTERISK, REQUIRED_MARK_DEFAULT_STYLE } from "../../utils/constants";
import { formatCollectElementOptions } from "../../utils/helpers";
import SkyflowError from "../../utils/skyflow-error";
import SKYFLOW_ERROR_CODE from "../../utils/skyflow-error-code";

/**
 *  sample documentation for ExpirationDateElement
 */
const ExpirationDateElement: React.FC<CollectElementProps> = ({ container, options, ...rest }) => {
    const [element, setElement] = React.useState<CollectElement>();
    const [elementValue, setElementValue] = React.useState<string>('');
    const [errorText, setErrorText] = React.useState<string>('');
    const [labelStyles, setLabelStyles] = React.useState(rest?.labelStyles?.base || {});
    const [inputStyles, setInputStyles] = React.useState(rest?.inputStyles?.base || {});
    const [maxLength, setMaxLength] = React.useState(DEFAULT_EXPIRATION_DATE_FORMAT.length);

    useEffect(() => {
        if (container) {
            const elementOptions: CollectElementOptions = formatCollectElementOptions(ElementType.EXPIRATION_DATE, options, container.getContext().logLevel);
            setMaxLength(elementOptions.format.length);
            const element: CollectElement = container.create({ ...rest, type: ElementType.EXPIRATION_DATE }, elementOptions);
            element.setMethods(setErrorText, { setInputStyles: setInputStyles, setLabelStyles: setLabelStyles });
            setElement(element);
            if (rest.onReady) {
                rest.onReady(element.getClientState());
            }
        } else {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.CONTAINER_OBJECT_IS_REQUIRED, [ElementType.EXPIRATION_DATE, 'useCollectContainer()'], true)
        }
    }, []);

    return (<View>
       {
            rest.label && ( <Text style={labelStyles}>
                {rest.label}
                <Text style={{ ...REQUIRED_MARK_DEFAULT_STYLE, ...rest?.labelStyles?.requiredAsterisk } }>
                    {options.required ? ELEMENT_REQUIRED_ASTERISK : ''}
                </Text>
            </Text>)
        }
        <TextInput
            value={elementValue}
            placeholder={rest.placeholder}
            onChangeText={(text) => {
                element?.onChangeElement(text);
                setElementValue(element.getInternalState().value)
            }}
            onFocus={() => {
                element?.onFocusElement();
                setLabelStyles(element.updateLabelStyles());
                setInputStyles(element.updateInputStyles());
            }}
            onBlur={() => {
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
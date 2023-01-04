/*
 Copyright (c) 2022 Skyflow, Inc.
*/
import React, { useEffect } from "react";
import { Text, TextInput, View } from "react-native";
import type CollectElement from "../../core/CollectElement";
import { DEFAULT_EXPIRATION_YEAR_FORMAT } from "../../core/constants";

import { CollectElementOptions, CollectElementProps, ElementType, ELEMENT_REQUIRED_ASTERISK, REQUIRED_MARK_DEFAULT_STYLE } from "../../utils/constants";
import { formatCollectElementOptions } from "../../utils/helpers";
import SkyflowError from "../../utils/skyflow-error";
import SKYFLOW_ERROR_CODE from "../../utils/skyflow-error-code";

const ExpirationYearElement: React.FC<CollectElementProps> = (props) => {
    const { container, options = { required: false }, ...rest } = props
    const [element, setElement] = React.useState<CollectElement>();
    const [errorText, setErrorText] = React.useState<string>('');
    const [labelStyles, setLabelStyles] = React.useState(rest?.labelStyles?.base || {});
    const [inputStyles, setInputStyles] = React.useState(rest?.inputStyles?.base || {});
    const [maxLength, setMaxLength] = React.useState(DEFAULT_EXPIRATION_YEAR_FORMAT.length);

    useEffect(() => {
        if (container) {
            const elementOptions: CollectElementOptions = formatCollectElementOptions(ElementType.EXPIRATION_YEAR, options, container.getContext().logLevel);
            setMaxLength(elementOptions.format.length);
            const element: CollectElement = container.create({ ...rest, type: ElementType.EXPIRATION_YEAR }, elementOptions);
            setElement(element);
            element.setMethods(setErrorText, { setInputStyles: setInputStyles, setLabelStyles: setLabelStyles });
            if (rest.onReady) {
                rest.onReady(element.getClientState());
            }
        } else {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.CONTAINER_OBJECT_IS_REQUIRED, [ElementType.EXPIRATION_YEAR, 'useCollectContainer()'], true)
        }
    }, [props]);

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
            placeholder={rest.placeholder}
            onChangeText={(text) => {
                element?.onChangeElement(text);
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
            maxLength={maxLength}
            keyboardType='numeric'
            style={inputStyles}
        />
        <Text style={rest?.errorTextStyles?.base || {}}>{errorText}</Text>
    </View>);
}

export default ExpirationYearElement;
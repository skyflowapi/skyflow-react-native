/*
 Copyright (c) 2022 Skyflow, Inc.
*/
import React, { useEffect } from "react";
import { Text, TextInput, View } from "react-native";
import type CollectElement from "../../core/CollectElement";
import { CARD_NUMBER_MASK, DEFAULT_CARD_INPUT_MAX_LENGTH } from "../../core/constants";
import { CollectElementProps, ElementType, ELEMENT_REQUIRED_ASTERISK, REQUIRED_MARK_DEFAULT_STYLE } from "../../utils/constants";
import SkyflowError from "../../utils/skyflow-error";
import SKYFLOW_ERROR_CODE from "../../utils/skyflow-error-code";

const CardNumberElement: React.FC<CollectElementProps> = ({ container, options = { required: false }, ...rest }) => {
    const [element, setElement] = React.useState<CollectElement>(undefined);
    const [elementValue, setElementValue] = React.useState<string>('');
    const [errorText, setErrorText] = React.useState<string>('');
    const [maxLength, setMaxLength] = React.useState<number>(DEFAULT_CARD_INPUT_MAX_LENGTH);
    const [labelStyles, setLabelStyles] = React.useState(rest?.labelStyles?.base || {});
    const [inputStyles, setInputStyles] = React.useState(rest?.inputStyles?.base || {});
    const [requiredStyles, setRequiredStyles] = React.useState(rest?.labelStyles?.requiredAsterick || {});

    useEffect(() => {
        if (container) {
            const element: CollectElement = container.create({ ...rest, type: ElementType.CARD_NUMBER }, options);
            setElement(element);
            element.setMethods(setErrorText, { setInputStyles: setInputStyles, setLabelStyles: setLabelStyles });
            if (rest.onReady) {
                rest.onReady(element.getClientState());
            }
        } else {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.CONTAINER_OBJECT_IS_REQUIRED, [ElementType.CARD_NUMBER, 'useCollectContainer()'], true)
        }
    }, []);
    return (<View>
        {
            rest.label && ( <Text style={labelStyles}>
                {rest.label}
                <Text style={{ ...REQUIRED_MARK_DEFAULT_STYLE, ...rest?.labelStyles?.requiredAsterick } }>
                    {options.required ? ELEMENT_REQUIRED_ASTERISK : ''}
                </Text>
            </Text>)
        }

        <TextInput
            value={elementValue}
            placeholder={rest.placeholder}
            onChangeText={(text) => {
                element?.onChangeElement(text)
                setElementValue(element.getInternalState().value)
                setMaxLength(CARD_NUMBER_MASK[element.getCardType()].length || DEFAULT_CARD_INPUT_MAX_LENGTH);
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
            keyboardType='numeric'
            maxLength={maxLength}
            style={inputStyles}
        />
        <Text style={rest?.errorTextStyles?.base || {}}>
            {errorText}
        </Text>
    </View>);
}

export default CardNumberElement;
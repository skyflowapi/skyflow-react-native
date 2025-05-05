/*
 Copyright (c) 2022 Skyflow, Inc.
*/
import React, { useEffect, useRef } from "react";
import { Text, TextInput, View } from "react-native";
import type CollectElement from "../../core/CollectElement";
import { DEFAULT_EXPIRATION_DATE_FORMAT } from "../../core/constants";
import { CollectElementOptions, CollectElementProps, ElementType, ELEMENT_REQUIRED_ASTERISK, REQUIRED_MARK_DEFAULT_STYLE, ContainerType } from "../../utils/constants";
import { formatCollectElementOptions } from "../../utils/helpers";
import SkyflowError from "../../utils/skyflow-error";
import SKYFLOW_ERROR_CODE from "../../utils/skyflow-error-code";
import uuid from 'react-native-uuid';

const ExpirationDateElement: React.FC<CollectElementProps> = ({ container, options, ...rest }) => {
    const [element, setElement] = React.useState<CollectElement>();
    const [elementValue, setElementValue] = React.useState<string>('');
    const [errorText, setErrorText] = React.useState<string>('');
    const [labelStyles, setLabelStyles] = React.useState(rest?.labelStyles?.base || {});
    const [inputStyles, setInputStyles] = React.useState(rest?.inputStyles?.base || {});
    const [maxLength, setMaxLength] = React.useState(DEFAULT_EXPIRATION_DATE_FORMAT.length);
    const textInputRef = useRef();
    const uniqueElementID = useRef(uuid.v4() as string);

    useEffect(() => {
        if (container) {
            const elementOptions: CollectElementOptions = formatCollectElementOptions(ElementType.EXPIRATION_DATE, options, container.getContext().logLevel);
            setMaxLength(elementOptions.format.length);
            const element: CollectElement = container.create({ ...rest, type: ElementType.EXPIRATION_DATE, containerType: container.type }, elementOptions);
            setElement(element);
            if (container.type === ContainerType.COLLECT)
                element.setMethods(setErrorText, { setInputStyles: setInputStyles, setLabelStyles: setLabelStyles });
            else if (container.type === ContainerType.COMPOSABLE) {
                element.setMethods(rest.containerMethods.setErrorText, { setInputStyles: setInputStyles, setLabelStyles: setLabelStyles })
                rest.containerMethods.setRef(textInputRef, uniqueElementID.current);
            }
            if (rest.onReady) {
                rest.onReady(element.getClientState());
            }
        } else {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.CONTAINER_OBJECT_IS_REQUIRED, [ElementType.EXPIRATION_DATE, 'useCollectContainer()'], true)
        }
    }, []);

    return (<View>
        {
            rest.label && (<Text style={labelStyles}>
                {rest.label}
                <Text style={{ ...REQUIRED_MARK_DEFAULT_STYLE, ...rest?.labelStyles?.requiredAsterisk }}>
                    {options.required ? ELEMENT_REQUIRED_ASTERISK : ''}
                </Text>
            </Text>)
        }
        <TextInput
            ref={textInputRef}
            value={elementValue}
            placeholder={rest.placeholder}
            testID={rest?.testID}
            onChangeText={(text) => {
                element?.onChangeElement(text);
                setElementValue(element.getInternalState().value)
                if (container.type === ContainerType.COMPOSABLE && (!element.getInternalState().isEmpty) && element.getInternalState().isValid) {
                    rest.containerMethods.shiftFocus(uniqueElementID);
                }
            }}
            onFocus={() => {
                element?.onFocusElement();
                setLabelStyles(element.updateLabelStyles());
                setInputStyles(element.updateInputStyles());
            }}
            onBlur={() => {
                element?.onBlurElement();
                if (container.type === ContainerType.COLLECT) {
                    setErrorText(element?.getErrorText() || '');
                } else if (container.type === ContainerType.COMPOSABLE) {
                    rest.containerMethods.setErrorText(element?.getErrorText() || '')
                }
                setElementValue(element.getInternalState().value);
                setLabelStyles(element.updateLabelStyles());
                setInputStyles(element.updateInputStyles());
            }}
            maxLength={maxLength}
            keyboardType='numeric'
            style={inputStyles}
        />
        {
            container && container?.type === ContainerType.COLLECT
            &&
            <Text style={rest?.errorTextStyles?.base || {}} testID="date-error">{errorText}</Text>
        }
    </View>);
}

export default ExpirationDateElement;
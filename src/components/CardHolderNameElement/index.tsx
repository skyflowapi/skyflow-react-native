/*
 Copyright (c) 2022 Skyflow, Inc.
*/
import React, { useEffect, useRef } from "react";
import { Text, TextInput, View } from "react-native";
import type CollectElement from "../../core/CollectElement";
import { CollectElementProps, ElementType, ELEMENT_REQUIRED_ASTERISK, REQUIRED_MARK_DEFAULT_STYLE, ContainerType } from "../../utils/constants";
import SkyflowError from "../../utils/skyflow-error";
import SKYFLOW_ERROR_CODE from "../../utils/skyflow-error-code";
import uuid from 'react-native-uuid';

const CardHolderNameElement: React.FC<CollectElementProps> = ({ container, options = { required: false }, ...rest }) => {
    const [element, setElement] = React.useState<CollectElement>();
    const [elementValue, setElementValue] = React.useState<string>('');
    const [errorText, setErrorText] = React.useState<string>('');
    const [labelStyles, setLabelStyles] = React.useState(rest?.labelStyles?.base || {});
    const [inputStyles, setInputStyles] = React.useState(rest?.inputStyles?.base || {});
    const textInputRef = useRef();
    const uniqueElementID = useRef(uuid.v4() as string);

    useEffect(() => {
        if (container) {
            const element: CollectElement = container.create({ ...rest, type: ElementType.CARDHOLDER_NAME, containerType: container.type }, options);
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
            throw new SkyflowError(SKYFLOW_ERROR_CODE.CONTAINER_OBJECT_IS_REQUIRED, [ElementType.CARDHOLDER_NAME, 'useCollectContainer()'], true)
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
                element?.onChangeElement(text)
                setElementValue(element.getInternalState().value)
            }}
            onFocus={() => {
                element?.onFocusElement()
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
            style={inputStyles}
        />

        {
            container && container?.type === ContainerType.COLLECT
            &&
            <Text style={rest?.errorTextStyles?.base || {}} testID="name-error">{errorText}</Text>
        }

    </View>);
}

export default CardHolderNameElement;
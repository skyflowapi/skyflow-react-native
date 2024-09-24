/*
 Copyright (c) 2022 Skyflow, Inc.
*/
import React, { useEffect, useRef } from "react";
import { Image, Text, TextInput, View } from "react-native";
import type CollectElement from "../../core/CollectElement";
import { CARD_ENCODED_ICONS, CARD_NUMBER_MASK, CardType, CardTypeValues, DEFAULT_CARD_INPUT_MAX_LENGTH } from "../../core/constants";
import { CollectElementProps, ElementType, ELEMENT_REQUIRED_ASTERISK, REQUIRED_MARK_DEFAULT_STYLE, ContainerType, CARD_NUMBER_ELEMENT_DEFAULT_STYLE, CARD_ICON_DEFAULT_STYLE, IListItem } from "../../utils/constants";
import SkyflowError from "../../utils/skyflow-error";
import SKYFLOW_ERROR_CODE from "../../utils/skyflow-error-code";
import uuid from 'react-native-uuid';
import Dropdown from "../../core/Dropdown";

const CardNumberElement: React.FC<CollectElementProps> = ({ container, options, ...rest }) => {

    const mergedOptions = {
        required: false,
        enableCardIcon: true,
        ...options
    }

    const [element, setElement] = React.useState<CollectElement>(undefined);
    const [elementValue, setElementValue] = React.useState<string>('');
    const [errorText, setErrorText] = React.useState<string>('');
    const [maxLength, setMaxLength] = React.useState<number>(DEFAULT_CARD_INPUT_MAX_LENGTH);
    const [labelStyles, setLabelStyles] = React.useState(rest?.labelStyles?.base || {});
    const [inputStyles, setInputStyles] = React.useState({});
    const textInputRef = useRef();
    const uniqueElementID = useRef(uuid.v4() as string);
    const [cardIcon, setCardIcon] = React.useState<CardType>(CardType.DEFAULT);
    const [cardBrandList, setCardBrandList] = React.useState<IListItem[]>([]);
    const [isDropdownVisible, setIsDropdownVisible] = React.useState<boolean>(false);

    useEffect(() => {
        if (container) {
            const element: CollectElement = container.create({ ...rest, type: ElementType.CARD_NUMBER, containerType: container.type }, mergedOptions);
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
            throw new SkyflowError(SKYFLOW_ERROR_CODE.CONTAINER_OBJECT_IS_REQUIRED, [ElementType.CARD_NUMBER, 'useCollectContainer()'], true)
        }
    }, []);

    React.useEffect(() => {
        if(element && container && (options?.cardMetadata?.scheme?.length>=2)) {
          setIsDropdownVisible(true);
          const cardBrandList: IListItem[] = options.cardMetadata.scheme.map((item: string) => ({
              label: CardTypeValues[item],
              value: item,
            }));
          setCardBrandList(cardBrandList);
          setCardIcon(element?.getCardType())
        } else {
          setIsDropdownVisible(false);
          setCardBrandList([]);
          element?.onDropdownSelect('');
          element?.onChangeElement('', true)
        }
      }, [options?.cardMetadata?.scheme])

    const getCardIconSource = () => {
        if(element && !isDropdownVisible) {
            return CARD_ENCODED_ICONS[element.getCardType()];
        } else if(element && options?.cardMetadata?.scheme) {
            return CARD_ENCODED_ICONS[cardIcon]
        }
    }

    return (<View>
        {
            rest.label && (<Text style={labelStyles}>
                {rest.label}
                <Text style={{ ...REQUIRED_MARK_DEFAULT_STYLE, ...rest?.labelStyles?.requiredAsterisk }}>
                    {mergedOptions.required ? ELEMENT_REQUIRED_ASTERISK : ''}
                </Text>
            </Text>)
        }
        <View style={{...CARD_NUMBER_ELEMENT_DEFAULT_STYLE, flexDirection: 'row', }}>
            {mergedOptions?.enableCardIcon && (
            <Image
              source={getCardIconSource() || CARD_ENCODED_ICONS[CardType.DEFAULT]}
              resizeMode="contain"
              style={{...CARD_ICON_DEFAULT_STYLE, ...rest?.inputStyles?.cardIcon}}
              key={element ? element.getCardType() : CardType.DEFAULT}
            />)}
            
            {mergedOptions?.enableCardIcon && isDropdownVisible && (
                <Dropdown
                 setSelectedValue={(item) => {
                    setCardIcon(item.value)
                    element.onDropdownSelect(item.value)
                    element.onChangeElement('', true)
                 }}
                 listData={cardBrandList}
                 dropdownIconStyles={rest?.inputStyles?.dropdownIcon}
                 dropdownStyles={rest?.inputStyles?.dropdown}
                />
            )}
        <TextInput
            ref={textInputRef}
            value={elementValue}
            placeholder={rest.placeholder}
            onChangeText={(text) => {
                element?.onChangeElement(text)
                setElementValue(element.getInternalState().value)
                setMaxLength(CARD_NUMBER_MASK[element.getCardType()].length || DEFAULT_CARD_INPUT_MAX_LENGTH);
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
            keyboardType='numeric'
            maxLength={maxLength}
            style={{...inputStyles, flex: rest?.inputStyles?.dropdownIcon ? 0 : 1 }}
        />
        </View>
        {
            container && container?.type === ContainerType.COLLECT
            &&
            <Text style={rest?.errorTextStyles?.base || {}}>{errorText}</Text>
        }
    </View>);
}

export default CardNumberElement;
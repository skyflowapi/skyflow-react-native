/*
    Copyright (c) 2022 Skyflow, Inc.
*/
import React from 'react';
import InputField from '../../src/components/InputField';
import PinElement from '../../src/components/PinElement';
import CvvElement from '../../src/components/CvvElement';
import CardHolderNameElement from '../../src/components/CardHolderNameElement';
import CardNumberElement from '../../src/components/CardNumberElement';
import ExpirationDateElement from '../../src/components/ExpirationDateElement';
import ExpirationYearElement from '../../src/components/ExpirationYearElement';
import ExpirationMonthElement from '../../src/components/ExpirationMonthElement';
import { render, screen, fireEvent } from '@testing-library/react-native';
import CollectContainer from '../../src/core/CollectContainer';
import RevealContainer from '../../src/core/RevealContainer';
import RevealElement from '../../src/components/RevealElement';
import Skyflow from '../../src/core/Skyflow';
import { CardType } from '../../src/core/constants';
import SkyflowProvider from '../../src/components/SkyflowProvider';
import { Text } from 'react-native';

const testSkyflowClient = new Skyflow({
  vaultID: '1234',
  vaultURL: 'https://url.com',
  getBearerToken: () => Promise.resolve('valid_token'),
});

const onReadyMock = jest.fn();
const onChangeMock = jest.fn();
const onBlurMock = jest.fn();
const onFocusMock = jest.fn();

const changeTrigger = jest.fn();
const foucsTrigger = jest.fn();
const blurTrigger = jest.fn();

describe('test InputField Component', () => {
  let collectContainer;
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    collectContainer = new CollectContainer(testSkyflowClient);
    jest.spyOn(collectContainer, 'create').mockImplementation(() => ({
      getClientState: () => ({}),
      onChangeElement: changeTrigger,
      onFocusElement: foucsTrigger,
      onBlurElement: blurTrigger,
      updateLabelStyles: jest.fn(),
      updateInputStyles: jest.fn(),
      getErrorText: () => '',
      getInternalState: () => ({}),
      getCardType: () => CardType.VISA,
    }));
  });

  it('test InputField component', () => {
    const inputElement = render(
      <InputField
        table={'table1'}
        column={'string'}
        container={collectContainer}
        onReady={onReadyMock}
        onBlur={onBlurMock}
        onChange={onChangeMock}
        onFocus={onFocusMock}
        label={'First Name'}
        placeholder={'first name'}
        validations={[]}
      />
    );
    expect(inputElement).toMatchSnapshot();
    const textField = screen.getAllByPlaceholderText('first name')[0];
    fireEvent.changeText(textField, 'hello');
    expect(onReadyMock).toBeCalledWith({});
    expect(changeTrigger).toBeCalledWith('hello');

    fireEvent(textField, 'focus');
    expect(foucsTrigger).toBeCalled();

    fireEvent(textField, 'blur');
    expect(blurTrigger).toBeCalled();
    // render without any listeners
    render(
      <InputField
        table={'table1'}
        column={'string'}
        container={collectContainer}
        label={'First Name'}
        placeholder={'first name'}
      />
    );
    expect(onReadyMock).toBeCalledTimes(1);
  });

  it('test PinElement component', () => {
    const pinElement = render(
      <PinElement
        table={'table1'}
        column={'string'}
        container={collectContainer}
        onReady={onReadyMock}
        onBlur={onBlurMock}
        onChange={onChangeMock}
        onFocus={onFocusMock}
        label={'Pin'}
        placeholder={'pin'}
        validations={[]}
      />
    );
    expect(pinElement).toMatchSnapshot();
    const textField = screen.getAllByPlaceholderText('pin')[0];
    fireEvent.changeText(textField, '1234');
    expect(onReadyMock).toBeCalledWith({});
    expect(changeTrigger).toBeCalledWith('1234');

    fireEvent(textField, 'focus');
    expect(foucsTrigger).toBeCalled();

    fireEvent(textField, 'blur');
    expect(blurTrigger).toBeCalled();
    // render without any listeners
    render(
      <PinElement
        table={'table1'}
        column={'string'}
        container={collectContainer}
        label={'Pin'}
        placeholder={'pin'}
      />
    );
    expect(onReadyMock).toHaveBeenCalledTimes(1);
  });

  it('test CvvElement component', () => {
    const cvvElement = render(
      <CvvElement
        table={'table1'}
        column={'string'}
        container={collectContainer}
        onReady={onReadyMock}
        onBlur={onBlurMock}
        onChange={onChangeMock}
        onFocus={onFocusMock}
        label={'Cvv'}
        placeholder={'cvv'}
        validations={[]}
      />
    );
    expect(cvvElement).toMatchSnapshot();
    const textField = screen.getAllByPlaceholderText('cvv')[0];
    fireEvent.changeText(textField, '123');
    expect(onReadyMock).toBeCalledWith({});
    expect(changeTrigger).toBeCalledWith('123');

    fireEvent(textField, 'focus');
    expect(foucsTrigger).toBeCalled();

    fireEvent(textField, 'blur');
    expect(blurTrigger).toBeCalled();
    // render without any listeners
    render(
      <CvvElement
        table={'table1'}
        column={'string'}
        container={collectContainer}
        label={'Cvv'}
        placeholder={'cvv'}
      />
    );
    expect(onReadyMock).toHaveBeenCalledTimes(1);
  });

  it('test CardHolderNameElement component', () => {
    const cardHolderElement = render(
      <CardHolderNameElement
        table={'table1'}
        column={'string'}
        container={collectContainer}
        onReady={onReadyMock}
        onBlur={onBlurMock}
        onChange={onChangeMock}
        onFocus={onFocusMock}
        label={'CardHolderName'}
        placeholder={'CardHolder Name'}
        validations={[]}
      />
    );
    expect(cardHolderElement).toMatchSnapshot();
    const textField = screen.getAllByPlaceholderText('CardHolder Name')[0];
    fireEvent.changeText(textField, 'test');
    expect(onReadyMock).toBeCalledWith({});
    expect(changeTrigger).toBeCalledWith('test');

    fireEvent(textField, 'focus');
    expect(foucsTrigger).toBeCalled();

    fireEvent(textField, 'blur');
    expect(blurTrigger).toBeCalled();
    // render without any listeners
    render(
      <CardHolderNameElement
        table={'table1'}
        column={'string'}
        container={collectContainer}
        label={'CardHolderName'}
        placeholder={'CardHolder Name'}
      />
    );
    expect(onReadyMock).toHaveBeenCalledTimes(1);
  });

  it('test CardNumberElement component', () => {
    const cardNumberElement = render(
      <CardNumberElement
        table={'table1'}
        column={'string'}
        container={collectContainer}
        onReady={onReadyMock}
        onBlur={onBlurMock}
        onChange={onChangeMock}
        onFocus={onFocusMock}
        label={'CardNumber'}
        placeholder={'card number'}
        validations={[]}
      />
    );
    expect(cardNumberElement).toMatchSnapshot();
    const textField = screen.getAllByPlaceholderText('card number')[0];
    fireEvent.changeText(textField, '4111111111111111');
    expect(onReadyMock).toBeCalledWith({});
    expect(changeTrigger).toBeCalledWith('4111111111111111');

    fireEvent(textField, 'focus');
    expect(foucsTrigger).toBeCalled();

    fireEvent(textField, 'blur');
    expect(blurTrigger).toBeCalled();

    const collectContainerTest = new CollectContainer(testSkyflowClient);
    jest.spyOn(collectContainerTest, 'create').mockImplementation(() => ({
      getInternalState: () => ({}),
      getCardType: () => null,
    }));
    // render without any listeners
    render(
      <CardNumberElement
        table={'table1'}
        column={'string'}
        container={collectContainerTest}
        label={'CardNumber'}
        placeholder={'card number'}
      />
    );
    expect(onReadyMock).toHaveBeenCalledTimes(1);
  });

  it('test ExpirationDateElement component', () => {
    const expirationDateElement = render(
      <ExpirationDateElement
        table={'table1'}
        column={'string'}
        container={collectContainer}
        onReady={onReadyMock}
        onBlur={onBlurMock}
        onChange={onChangeMock}
        onFocus={onFocusMock}
        label={'Expiration Date'}
        placeholder={'expiration date'}
        validations={[]}
      />
    );
    expect(expirationDateElement).toMatchSnapshot();
    const textField = screen.getAllByPlaceholderText('expiration date')[0];
    fireEvent.changeText(textField, '12/2032');
    expect(onReadyMock).toBeCalledWith({});
    expect(changeTrigger).toBeCalledWith('12/2032');

    fireEvent(textField, 'focus');
    expect(foucsTrigger).toBeCalled();

    fireEvent(textField, 'blur');
    expect(blurTrigger).toBeCalled();

    // render without any listeners
    render(
      <ExpirationDateElement
        table={'table1'}
        column={'string'}
        container={collectContainer}
        label={'Expiration Date'}
        placeholder={'expiration date'}
      />
    );
    expect(onReadyMock).toHaveBeenCalledTimes(1);
  });

  it('test ExpirationMonthElement component', () => {
    const expirationMonthElement = render(
      <ExpirationMonthElement
        table={'table1'}
        column={'string'}
        container={collectContainer}
        onReady={onReadyMock}
        onBlur={onBlurMock}
        onChange={onChangeMock}
        onFocus={onFocusMock}
        label={'Expiration Month'}
        placeholder={'expiration month'}
        validations={[]}
      />
    );
    expect(expirationMonthElement).toMatchSnapshot();
    const textField = screen.getAllByPlaceholderText('expiration month')[0];
    fireEvent.changeText(textField, '12');
    expect(onReadyMock).toBeCalledWith({});
    expect(changeTrigger).toBeCalledWith('12');

    fireEvent(textField, 'focus');
    expect(foucsTrigger).toBeCalled();

    fireEvent(textField, 'blur');
    expect(blurTrigger).toBeCalled();

    // render without any listeners
    render(
      <ExpirationMonthElement
        table={'table1'}
        column={'string'}
        container={collectContainer}
        label={'Expiration Date'}
        placeholder={'expiration date'}
      />
    );
    expect(onReadyMock).toHaveBeenCalledTimes(1);
  });

  it('test ExpirationYearElement component', () => {
    const expirationYearElement = render(
      <ExpirationYearElement
        table={'table1'}
        column={'string'}
        container={collectContainer}
        onReady={onReadyMock}
        onBlur={onBlurMock}
        onChange={onChangeMock}
        onFocus={onFocusMock}
        label={'Expiration Year'}
        placeholder={'expiration year'}
        validations={[]}
      />
    );
    expect(expirationYearElement).toMatchSnapshot();
    const textField = screen.getAllByPlaceholderText('expiration year')[0];
    fireEvent.changeText(textField, '2032');
    expect(onReadyMock).toBeCalledWith({});
    expect(changeTrigger).toBeCalledWith('2032');

    fireEvent(textField, 'focus');
    expect(foucsTrigger).toBeCalled();

    fireEvent(textField, 'blur');
    expect(blurTrigger).toBeCalled();

    // render without any listeners
    render(
      <ExpirationYearElement
        table={'table1'}
        column={'string'}
        container={collectContainer}
        label={'Expiration Date'}
        placeholder={'expiration date'}
      />
    );
    expect(onReadyMock).toHaveBeenCalledTimes(1);
  });

  it('test RevealElement component', () => {
    const revealSetMethodMock = jest.fn();
    const revealContainer = new RevealContainer(testSkyflowClient);
    jest.spyOn(revealContainer, 'create').mockImplementation(() => ({
      setMethods: revealSetMethodMock,
    }));

    const revealElement = render(
      <RevealElement
        token={'test_token'}
        container={revealContainer}
        label={'Card Number'}
        altText={'XXXX XXXX XXXX XXXX'}
      />
    );

    expect(revealElement).toMatchSnapshot();
    expect(revealSetMethodMock).toBeCalledTimes(1);

    // render without alttext
    const revealElement2 = render(
      <RevealElement
        token={'test_token'}
        container={revealContainer}
        label={'Card Number'}
      />
    );
  });

  it('test skyflow provider', () => {
    const testSkyflowConfig = {
      vaultID: '1234',
      vaultURL: 'https://vaulturl.com',
      getBearerToken: () => Promise.resolve('valid_token'),
    };

    const providerElement = render(
      <SkyflowProvider config={testSkyflowConfig}>
        <Text>Provider Childern</Text>
      </SkyflowProvider>
    );
    expect(providerElement).toMatchSnapshot();
  });
});

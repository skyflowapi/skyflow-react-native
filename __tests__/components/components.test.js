/*
    Copyright (c) 2022 Skyflow, Inc.
*/
import React from 'react';
import InputFieldElement from '../../src/components/InputFieldElement';
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
import SkyflowError from '../../src/utils/skyflow-error';
import SKYFLOW_ERROR_CODE from '../../src/utils/skyflow-error-code';
import { ElementType } from '../../src/utils/constants';

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

describe('test Collect And Reveal Elements Components', () => {
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
      setMethods: jest.fn(),
    }));
  });

  it('test InputFieldElement component', () => {
    const inputElement = render(
      <InputFieldElement
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
        options={{
          required: true,
        }}
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
      <InputFieldElement
        table={'table1'}
        column={'string'}
        container={collectContainer}
        label={'First Name'}
        placeholder={'first name'}
        options={{
          required: false,
        }}
      />
    );
    expect(onReadyMock).toBeCalledTimes(1);
    try {
      render(
        <InputFieldElement
          table={'table1'}
          column={'string'}
          placeholder={'first name'}
        />
      );
    } catch (err) {
      expect(err).toEqual(
        new SkyflowError(
          SKYFLOW_ERROR_CODE.CONTAINER_OBJECT_IS_REQUIRED,
          [ElementType.INPUT_FIELD, 'useCollectContainer()'],
          true
        )
      );
    }
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
        options={{
          required: true,
        }}
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
        options={{
          required: false,
        }}
      />
    );
    expect(onReadyMock).toHaveBeenCalledTimes(1);
    try {
      render(
        <PinElement table={'table1'} column={'string'} placeholder={'pin'} />
      );
    } catch (err) {
      expect(err).toEqual(
        new SkyflowError(
          SKYFLOW_ERROR_CODE.CONTAINER_OBJECT_IS_REQUIRED,
          [ElementType.PIN, 'useCollectContainer()'],
          true
        )
      );
    }
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
        options={{
          required: true,
        }}
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
        options={{
          required: false,
        }}
      />
    );
    expect(onReadyMock).toHaveBeenCalledTimes(1);
    try {
      render(
        <CvvElement table={'table1'} column={'string'} placeholder={'cvv'} />
      );
    } catch (err) {
      expect(err).toEqual(
        new SkyflowError(
          SKYFLOW_ERROR_CODE.CONTAINER_OBJECT_IS_REQUIRED,
          [ElementType.CVV, 'useCollectContainer()'],
          true
        )
      );
    }
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
        options={{
          required: true,
        }}
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
        label={'CardHolder Name'}
        container={collectContainer}
        placeholder={'CardHolder Name'}
        options={{
          required: false,
        }}
      />
    );
    expect(onReadyMock).toHaveBeenCalledTimes(1);
    try {
      render(
        <CardHolderNameElement
          table={'table1'}
          column={'string'}
          placeholder={'CardHolder Name'}
        />
      );
    } catch (err) {
      expect(err).toEqual(
        new SkyflowError(
          SKYFLOW_ERROR_CODE.CONTAINER_OBJECT_IS_REQUIRED,
          [ElementType.CARDHOLDER_NAME, 'useCollectContainer()'],
          true
        )
      );
    }
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
        options={{
          required: true,
        }}
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
      setMethods: jest.fn(),
    }));
    // render without any listeners
    render(
      <CardNumberElement
        table={'table1'}
        column={'string'}
        container={collectContainerTest}
        label={'Card Number'}
        placeholder={'card number'}
        options={{
          required: false,
        }}
      />
    );
    expect(onReadyMock).toHaveBeenCalledTimes(1);

    try {
      render(
        <CardNumberElement
          table={'table1'}
          column={'string'}
          placeholder={'card number'}
        />
      );
    } catch (err) {
      expect(err).toEqual(
        new SkyflowError(
          SKYFLOW_ERROR_CODE.CONTAINER_OBJECT_IS_REQUIRED,
          [ElementType.CARD_NUMBER, 'useCollectContainer()'],
          true
        )
      );
    }
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
        options={{
          required: true,
        }}
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
        options={{
          required: false,
        }}
      />
    );
    expect(onReadyMock).toHaveBeenCalledTimes(1);

    try {
      render(
        <ExpirationDateElement
          table={'table1'}
          column={'string'}
          placeholder={'expiration date'}
        />
      );
    } catch (err) {
      expect(err).toEqual(
        new SkyflowError(
          SKYFLOW_ERROR_CODE.CONTAINER_OBJECT_IS_REQUIRED,
          [ElementType.EXPIRATION_DATE, 'useCollectContainer()'],
          true
        )
      );
    }
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
        options={{
          required: true,
        }}
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
        label={'Expiration Month'}
        placeholder={'expiration month'}
        options={{
          required: false,
        }}
      />
    );
    expect(onReadyMock).toHaveBeenCalledTimes(1);
    try {
      render(
        <ExpirationMonthElement
          table={'table1'}
          column={'string'}
          placeholder={'expiration month'}
        />
      );
    } catch (err) {
      expect(err).toEqual(
        new SkyflowError(
          SKYFLOW_ERROR_CODE.CONTAINER_OBJECT_IS_REQUIRED,
          [ElementType.EXPIRATION_MONTH, 'useCollectContainer()'],
          true
        )
      );
    }
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
        options={{
          required: true,
        }}
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
        label={'Expiration Year'}
        placeholder={'expiration year'}
        options={{
          required: false,
        }}
      />
    );
    expect(onReadyMock).toHaveBeenCalledTimes(1);
    try {
      render(
        <ExpirationYearElement
          table={'table1'}
          column={'string'}
          placeholder={'expiration year'}
        />
      );
    } catch (err) {
      expect(err).toEqual(
        new SkyflowError(
          SKYFLOW_ERROR_CODE.CONTAINER_OBJECT_IS_REQUIRED,
          [ElementType.EXPIRATION_YEAR, 'useCollectContainer()'],
          true
        )
      );
    }
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
    try {
      render(<RevealElement token={'test_token'} label={'Card Number'} />);
    } catch (err) {
      expect(err).toEqual(
        new SkyflowError(
          SKYFLOW_ERROR_CODE.CONTAINER_OBJECT_IS_REQUIRED,
          ['Reveal', 'useRevealContainer()'],
          true
        )
      );
    }
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

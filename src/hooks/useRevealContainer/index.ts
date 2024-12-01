/*
 Copyright (c) 2022 Skyflow, Inc.
*/
import useSkyflowContext from '../../components/SkyflowProvider/hook';
import RevealContainer from '../../core/RevealContainer';

/**
 *  Container for Reveal Elements.
 * @returns Returns the RevealContainer instance.
 */
const useRevealContainer = () => {
  const skyflowClient = useSkyflowContext();
  return new RevealContainer(skyflowClient);
};

export default useRevealContainer;

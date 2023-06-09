/*
 Copyright (c) 2022 Skyflow, Inc.
*/
import useSkyflowContext from '../../components/SkyflowProvider/hook';
import CollectContainer from '../../core/CollectContainer';

/**
 *  sample documentation for useCollectContainer hook
 * @returns CollectContainer
 */
const useCollectContainer = () => {
  const skyflowClient = useSkyflowContext();
  return new CollectContainer(skyflowClient);
};

export default useCollectContainer;

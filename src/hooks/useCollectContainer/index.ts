/*
 Copyright (c) 2022 Skyflow, Inc.
*/
import useSkyflowContext from '../../components/SkyflowProvider/hook';
import CollectContainer from '../../core/CollectContainer';

/**
 *  Hook for Collect Elements Container.
 * @returns Returns the CollectContainer instance.
 */
const useCollectContainer = () => {
  const skyflowClient = useSkyflowContext();
  return new CollectContainer(skyflowClient);
};

export default useCollectContainer;

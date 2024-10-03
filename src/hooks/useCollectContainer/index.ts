/*
 Copyright (c) 2022 Skyflow, Inc.
*/
import React from 'react';
import useSkyflowContext from '../../components/SkyflowProvider/hook';
import CollectContainer from '../../core/CollectContainer';

const useCollectContainer = () => {
  const skyflowClient = useSkyflowContext();
  return React.useMemo(() => new CollectContainer(skyflowClient), []);
};

export default useCollectContainer;

/*
 Copyright (c) 2023 Skyflow, Inc.
*/
import useSkyflowContext from '../../components/SkyflowProvider/hook';
import { validateComposableContainerOptions } from '../../core-utils/element-validations';
import CoreComposableContainer from '../../core/ComposableContainer';

const useComposableContainer = (options: any) => {
  const skyflowClient = useSkyflowContext();
  validateComposableContainerOptions(options);
  return new CoreComposableContainer(skyflowClient, options);
};

export default useComposableContainer;

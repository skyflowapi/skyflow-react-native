import useSkyflowContext from '../../components/SkyflowProvider/hook';
import CollectContainer from '../../core/CollectContainer';
import Skyflow from '../../core/Skyflow';

const useCollectContainer = () => {
  const skyflowConfig = useSkyflowContext();
  const skyflowClient = new Skyflow(skyflowConfig);
  return new CollectContainer(skyflowClient);
};

export default useCollectContainer;

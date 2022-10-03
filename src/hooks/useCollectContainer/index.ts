import useSkyflowContext from '../../components/SkyflowProvider/hook';
import CollectContainer from '../../core/CollectContainer';

const useCollectContainer = () => {
  const skyflowClient = useSkyflowContext();
  return new CollectContainer(skyflowClient);
};

export default useCollectContainer;

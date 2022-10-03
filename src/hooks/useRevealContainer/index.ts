import useSkyflowContext from '../../components/SkyflowProvider/hook';
import RevealContainer from '../../core/RevealContainer';

const useRevealContainer = () => {
  const skyflowClient = useSkyflowContext();
  return new RevealContainer(skyflowClient);
};

export default useRevealContainer;

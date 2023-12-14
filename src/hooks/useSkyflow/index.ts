import SkyflowContainer from '../../core/SkyflowContainer';
import useSkyflowContext from '../../components/SkyflowProvider/hook';

const useSkyflow = () => {
  const skyflowClient = useSkyflowContext();
  return new SkyflowContainer(skyflowClient);
};

export default useSkyflow;

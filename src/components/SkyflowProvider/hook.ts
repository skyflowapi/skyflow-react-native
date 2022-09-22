import { useContext } from 'react';
import { skyflowContext } from '.';

const useSkyflowContext = () => {
  return useContext(skyflowContext);
};

export default useSkyflowContext;

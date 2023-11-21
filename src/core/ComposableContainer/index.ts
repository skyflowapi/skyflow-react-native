import { ContainerType } from '../../utils/constants';
import CollectContainer from '../CollectContainer';

class CoreComposableContainer extends CollectContainer {
  type: string = ContainerType.COMPOSABLE;
  options: Record<string, any>;

  constructor(client, options) {
    super(client);
    this.options = options;
  }
}

export default CoreComposableContainer;

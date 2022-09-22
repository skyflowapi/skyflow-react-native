import React from 'react';
import { IConfig, SkyflowConfigIntialState } from '../../utils/constants';

export interface ISkyflowProvider {
    config: IConfig,
}

export const skyflowContext = React.createContext<IConfig>(SkyflowConfigIntialState);

const SkyflowProvider: React.FC<React.PropsWithChildren<ISkyflowProvider>> = ({children,config}): JSX.Element => {
    return <skyflowContext.Provider value={config}>{children}</skyflowContext.Provider>
}

export default React.memo(SkyflowProvider)
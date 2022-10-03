import React from 'react';
import Skyflow from '../../core/Skyflow';
import { IConfig, SkyflowConfigIntialState } from '../../utils/constants';

export interface ISkyflowProvider {
    config: IConfig,
}

export const skyflowContext = React.createContext<Skyflow>(null);

const SkyflowProvider: React.FC<React.PropsWithChildren<ISkyflowProvider>> = ({children,config}): JSX.Element => {
    const skyflow = new Skyflow(config);
    return <skyflowContext.Provider value={skyflow}>{children}</skyflowContext.Provider>
}

export default React.memo(SkyflowProvider)
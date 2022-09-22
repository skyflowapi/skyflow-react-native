export interface IConfig {
    vaultID: string
    vaultURL: string
    getBearerToken:()=>Promise<string>
    options?: Record<string,any>
}

export const SkyflowConfigIntialState:IConfig = {
    vaultID: '',
    vaultURL: '',
    getBearerToken: ()=>{
        return Promise.resolve('');
    }
}

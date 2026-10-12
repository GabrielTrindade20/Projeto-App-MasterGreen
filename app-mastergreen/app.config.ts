import type { ExpoConfig, ConfigContext } from 'expo/config';

export default ({config}:ConfigContext):ExpoConfig=>{
  const production=process.env.APP_VARIANT==='production';
  const api=process.env.EXPO_PUBLIC_API_URL||'';
  if(process.env.EAS_BUILD==='true'){
    for(const address of [api,process.env.EXPO_PUBLIC_WEB_URL||api]){
      let url:URL;
      try{url=new URL(address);}catch{throw new Error('Configure as URLs da API e do web antes de gerar o APK.');}
      if(url.protocol!=='https:'||url.username||url.password||url.search||url.hash||['localhost','127.0.0.1','[::1]'].includes(url.hostname))
        throw new Error('O APK requer URLs HTTPS válidas, sem credenciais, parâmetros ou localhost.');
    }
  }
  return {...config,name:production?'MasterGreen':'MasterGreen Testes',slug:config.slug||'app-mastergreen',
    version:'2.2.0',android:{...config.android,package:production?'com.gab_roch.AppMasterGreen':'com.gab_roch.AppMasterGreen.develop'},
  };
};

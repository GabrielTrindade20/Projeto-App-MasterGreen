import type { ExpoConfig, ConfigContext } from 'expo/config';

export default ({config}:ConfigContext):ExpoConfig=>{
  const production=process.env.APP_VARIANT==='production';
  const api=process.env.EXPO_PUBLIC_API_URL||'';
  if(process.env.EAS_BUILD==='true'&&!api.startsWith('https://'))throw new Error('Configure EXPO_PUBLIC_API_URL com a API HTTPS do ambiente antes de gerar o APK.');
  return {...config,name:production?'MasterGreen':'MasterGreen Testes',slug:config.slug||'app-mastergreen',
    version:'2.2.0',android:{...config.android,package:production?'com.gab_roch.AppMasterGreen':'com.gab_roch.AppMasterGreen.develop'},
  };
};

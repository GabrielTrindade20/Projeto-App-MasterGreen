const {test}=require('node:test');
const assert=require('node:assert/strict');
const configure=require('../app.config.ts').default;
test('release requires HTTPS without credentials and isolates preview package',()=>{
  const keys=['EAS_BUILD','APP_VARIANT','EXPO_PUBLIC_API_URL','EXPO_PUBLIC_WEB_URL'];
  const previous=Object.fromEntries(keys.map(key=>[key,process.env[key]]));
  try{
    process.env.EAS_BUILD='true';process.env.APP_VARIANT='development';delete process.env.EXPO_PUBLIC_WEB_URL;
    for(const url of ['','http://example.com','https://localhost','https://user:pass@example.com','https://example.com?token=test','invalid']){
      process.env.EXPO_PUBLIC_API_URL=url;assert.throws(()=>configure({config:{slug:'app-mastergreen'}}));
    }
    process.env.EXPO_PUBLIC_API_URL='https://test.example.com';
    assert.equal(configure({config:{slug:'app-mastergreen'}}).android.package,'com.gab_roch.AppMasterGreen.develop');
    process.env.APP_VARIANT='production';
    assert.equal(configure({config:{slug:'app-mastergreen'}}).android.package,'com.gab_roch.AppMasterGreen');
    process.env.EXPO_PUBLIC_WEB_URL='http://example.com';assert.throws(()=>configure({config:{slug:'app-mastergreen'}}));
  }finally{for(const key of keys){if(previous[key]===undefined)delete process.env[key];else process.env[key]=previous[key];}}
});

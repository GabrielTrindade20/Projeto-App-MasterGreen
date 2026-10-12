const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const ts=require('typescript');

// Exercise the real native export orchestration with native adapters mocked.
// The phone is still needed to validate Android's share sheet and permissions.
function setup({available=true,base64='JVBERi0xLjQK',writeError=false}={}){
  const events=[];
  class Directory{constructor(root,name){this.uri=root+'/'+name;}create(){events.push('mkdir');}}
  class File{
    constructor(folder,name){assert.equal(typeof folder,'object','Do not read the unscoped Print URI');this.uri=folder.uri+'/'+name;}
    copy(){throw new Error('READ permission denied');}
    write(value,options){assert.equal(value,base64);assert.equal(options.encoding,'base64');if(writeError)throw new Error('Disco cheio');events.push('write');}
  }
  const adapters={
    'expo-asset':{},'expo-file-system':{Directory,File,Paths:{cache:'file:///scoped-cache'}},
    'expo-print':{printAsync:async()=>events.push('preview'),printToFileAsync:async options=>{assert.equal(options.base64,true);events.push('render');return {uri:'file:///outside-scoped-cache/print.pdf',base64};}},
    'expo-sharing':{isAvailableAsync:async()=>available,shareAsync:async(uri,options)=>{assert.match(uri,/^file:\/\/\/scoped-cache\/proposta-.*\/proposta.pdf$/);assert.equal(options.mimeType,'application/pdf');events.push('share');}},
  };
  const code=ts.transpileModule(fs.readFileSync(require.resolve('../src/lib/export-proposal.ts'),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
  const context={exports:{},require:name=>{assert.ok(name in adapters);return adapters[name];}};
  vm.runInNewContext(code,context);
  return {run:context.exports.exportProposal,events};
}
test('PDF nativo usa conteúdo base64 no cache, sem copiar URI restrita; salva antes de compartilhar',async()=>{
  const {run,events}=setup();await run('<p>Proposta</p>','proposta.pdf',false,async()=>events.push('saved'));
  assert.deepEqual(events,['render','mkdir','write','saved','share']);
});
test('compartilhar pelo histórico funciona sem callback de novo salvamento',async()=>{
  const {run,events}=setup();await run('<p>Histórico</p>','proposta.pdf',false);assert.deepEqual(events,['render','mkdir','write','share']);
});
test('visualização não grava nem compartilha',async()=>{const {run,events}=setup();await run('html','proposta.pdf',true);assert.deepEqual(events,['preview']);});
test('falhas de geração e gravação não salvam nem compartilham',async()=>{
  for(const options of [{available:false},{base64:''},{writeError:true}]){const {run,events}=setup(options);await assert.rejects(()=>run('html','proposta.pdf',false,async()=>events.push('saved')));assert.ok(!events.includes('saved')&&!events.includes('share'));}
});

const {test}=require('node:test');
const assert=require('node:assert/strict');
const {initialState,parseStoredState,addToQueue,historyWithLocal,sessionValid}=require('../src/lib/mobile-state.ts');
const payload={clientId:'one',customer:{name:'Cliente'},proposalDate:'2026-10-12',totalCents:10000};
test('fila persiste, reenvio mantém identificador e não duplica histórico',()=>{
  let state=addToQueue(initialState(),payload,'signature');
  state=addToQueue(state,payload,'signature');
  assert.equal(state.queue.length,1);
  state=parseStoredState(JSON.stringify(state));
  assert.equal(state.queue[0].payload.totalCents,10000);
  assert.equal(historyWithLocal(state)[0].status,'Aguardando envio');
  state.data={history:[{id:'server',clientId:'one',customer:{name:'Cliente'},date:'2026-10-12',totalCents:10000,source:'mobile',status:'Enviada'}]};
  assert.equal(historyWithLocal(state).length,1);
});
test('sessão vence no limite de 30 dias sem apagar dados',()=>{
  const expires=Date.now()+30*86400000; const session={expiresAt:new Date(expires).toISOString()};
  assert.equal(sessionValid(session,expires-1),true);
  assert.equal(sessionValid(session,expires),false);
  assert.equal(sessionValid(null),false);
});
test('dados locais inválidos não são silenciosamente substituídos',()=>{
  assert.throws(()=>parseStoredState('{invalid'));
  assert.throws(()=>parseStoredState('{"version":2}'));
  assert.equal(parseStoredState(null).queue.length,0);
});
test('preferências iniciais preservam Wi-Fi e leitura grande',()=>{
  const state=initialState();assert.equal(state.preferences.mobileData,false);assert.equal(state.preferences.fontScale,1);
});

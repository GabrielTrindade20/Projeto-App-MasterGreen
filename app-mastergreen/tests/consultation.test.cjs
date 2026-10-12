const {test}=require('node:test');
const assert=require('node:assert/strict');
const {normalize,filterCustomers,filterHistory,monthPeriod,presetPeriod,parseDateInput,applyCustomer}=require('../src/lib/consultation.ts');
const {initialState,parseStoredState}=require('../src/lib/mobile-state.ts');
test('busca de clientes normaliza acento e telefone sem pontuação',()=>{
  const rows=[{id:'1',name:'José Silva',phone:'(61) 99999-8888',city:'Brasília'},{id:'2',name:'Álvaro',phone:'11',city:'São Paulo'}];
  assert.equal(normalize('  JOSÉ '),'jose');assert.equal(filterCustomers(rows,'jose')[0].id,'1');assert.equal(filterCustomers(rows,'61999998888')[0].id,'1');assert.equal(filterCustomers(rows,'','São Paulo')[0].id,'2');assert.deepEqual(filterCustomers(rows,'').map(r=>r.id),['2','1']);
});
test('períodos reais, bissexto, virada de ano e data inválida',()=>{
  assert.equal(monthPeriod(2024,2).to,'2024-02-29');assert.equal(presetPeriod('previous',new Date(2026,0,10)).from,'2025-12-01');assert.equal(parseDateInput('31/02/2026'),null);assert.equal(parseDateInput('29/02/2024'),'2024-02-29');assert.equal(parseDateInput('01/01/1999'),null);
});
test('filtro de histórico inclusivo, origem, situação e valor',()=>{
  const base={customer:{name:'José'},source:'web',status:'approved'};
  const rows=[{...base,id:'1',date:'2026-10-01',totalCents:10},{...base,id:'2',date:'2026-10-31',totalCents:30},{...base,id:'3',date:'2026-11-01',totalCents:90},{...base,id:'4',date:'2026-10-20',totalCents:50,source:'mobile',status:'Enviada'}];
  assert.deepEqual(filterHistory(rows,'jose',monthPeriod(2026,10),'web','approved','value').map(r=>r.id),['2','1']);
});
test('selecionar cliente preserva itens e versões antigas do cache continuam legíveis',()=>{
  const state=initialState();state.proposal.items=[{id:1,descricao:'Grama',metragem:'2',valorPorMetro:'10'}];
  const next=applyCustomer(state.proposal,{id:'1',name:'Teste',phone:'61',city:'Brasília'});
  assert.equal(next.items,state.proposal.items);assert.equal(next.customer,'Teste');assert.equal(parseStoredState(JSON.stringify(state)).version,1);
});

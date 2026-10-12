const {test}=require('node:test');
const assert=require('node:assert/strict');
const {proposalWebUrl}=require('../src/lib/proposal-web-link.ts');
const id='aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa';
test('web link uses only origin and proposal ID, never credentials or other query parameters',()=>{
  assert.equal(proposalWebUrl('https://example.com/api?token=discard#fragment',id),`https://example.com/orcamentos?view=${id}`);
  assert.equal(proposalWebUrl('http://192.168.3.10:5001',id,true),`http://192.168.3.10:5001/orcamentos?view=${id}`);
  assert.equal(proposalWebUrl('https://example.com',id,false,'mobile'),`https://example.com/orcamentos?view=${id}&source=app`);
});
test('rejects missing config, unsafe protocols, credentials and invalid IDs',()=>{
  for(const base of ['', 'not a url','javascript:alert(1)','file:///test','http://example.com','https://user:password@example.com'])assert.throws(()=>proposalWebUrl(base,id));
  for(const value of ['', '../customers','id&token=secret'])assert.throws(()=>proposalWebUrl('https://example.com',value));
});

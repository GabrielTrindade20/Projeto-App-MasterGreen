const {test}=require('node:test');
const assert=require('node:assert/strict');
const {spawnSync}=require('node:child_process');
const query=require('query-string');

test('xcode build tooling keeps generating compatible unique identifiers with patched uuid',()=>{
  const project=require('xcode').project('not-written.pbxproj');
  project.hash={project:{objects:{}}};
  const ids=new Set(Array.from({length:100},()=>project.generateUuid()));
  assert.equal(ids.size,100);
  for(const id of ids)assert.match(id,/^[A-F0-9]{24}$/);
});

test('patched query-string keeps accents, arrays and safe malformed URL decoding',()=>{
  assert.equal(query.parse('cliente=Jo%C3%A3o+Silva').cliente,'João Silva');
  assert.deepEqual(query.parse('item=1&item=2').item,['1','2']);
  assert.equal(query.parse('view=uuid&source=app').source,'app');
  assert.equal(typeof query.parse('item=%E0%A4%A').item,'string');
});

test('malformed percent-encoded links cannot hang the parser',()=>{
  // Isolated process and hard timeout: a regression must not hang the test suite.
  const result=spawnSync(process.execPath,['-e',
    "const q=require('query-string');for(let i=0;i<10;i++)q.parse('q='+('%C2'.repeat(2000))+'%');"
  ],{cwd:require('node:path').resolve(__dirname,'..'),timeout:5000,encoding:'utf8'});
  assert.ifError(result.error);
  assert.equal(result.status,0,result.stderr);
});

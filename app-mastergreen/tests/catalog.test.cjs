const {test}=require('node:test');
const assert=require('node:assert/strict');
const {catalogCategories,filterCatalog,productCategoryLabel}=require('../src/lib/catalog.ts');
const {proposalTotal}=require('../src/lib/quotation.ts');
const products=[
  {name:'Grama sintética',category:'Grama',pricePerM2:'80.50',catalog:{kind:'product',category:'Gramas',unit:'un'}},
  {name:'Frete',category:'Grama',pricePerM2:'150.00',catalog:{kind:'service',category:'Frete e entrega',unit:'serviço'}},
  {name:'Lata de Cola',category:'Outro',pricePerM2:'450.00'},
  {name:'Capacho',category:'Carpete',pricePerM2:'55.00'},
  {name:'Instalação',category:'Serviço personalizado',pricePerM2:'20.00'},
];
test('categorias são as originais do web, sem inferência pelo nome ou pelo cache antigo',()=>{
  assert.deepEqual(catalogCategories(products),['Carpete','Grama','Outro','Serviço personalizado']);
  assert.deepEqual(filterCatalog(products,'','Grama').map(row=>row.name),['Grama sintética','Frete']);
  assert.deepEqual(filterCatalog(products,'','Gramas'),[]);
});
test('busca ignora acentos e combina nome, descrição e categoria com filtro exato',()=>{
  assert.equal(filterCatalog(products,'SINTETICA','Grama')[0],products[0]);
  assert.deepEqual(filterCatalog(products,'frete','Outro'),[]);
  assert.equal(filterCatalog(products,'frete',null)[0],products[1]);
  assert.equal(filterCatalog(products,'servico',null)[0],products[4]);
  assert.equal(filterCatalog([{name:'Produto',category:'Piso',description:'Instalação inclusa'}],'instalacao','Piso').length,1);
});
test('produto sem categoria tem filtro próprio, distinto de todas',()=>{
  const rows=[{name:'A',category:null},{name:'B',category:''},{name:'C',category:'Outro'}];
  assert.deepEqual(catalogCategories(rows),['','Outro']);
  assert.equal(productCategoryLabel(rows[0]),'Sem categoria');
  assert.equal(filterCatalog(rows,'','').length,2);
  assert.equal(filterCatalog(rows,'',null).length,3);
  assert.deepEqual(catalogCategories([]),[]);
  assert.deepEqual(filterCatalog([],'',null),[]);
});
test('filtrar não altera preços, categorias, unidades nem objetos em cache',()=>{
  const before=structuredClone(products);
  catalogCategories(products);filterCatalog(products,'','Grama');
  assert.deepEqual(products,before);
  assert.equal(filterCatalog(products,'',null)[0],products[0]);
});
test('unidades novas preservam fórmula e rascunhos antigos sem unidade',()=>{
  const item={id:1,metragem:'2,5',valorPorMetro:'80,50',descricao:'Item'};
  assert.equal(proposalTotal([item],'10'),181.13);
  assert.equal(proposalTotal([{...item,unit:'un',costReference:'R$ 20,00'}],'10'),181.13);
});

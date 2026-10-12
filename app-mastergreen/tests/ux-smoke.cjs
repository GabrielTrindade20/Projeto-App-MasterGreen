// Browser preview only; native sharing / keyboard / TalkBack need the Android device.
const {chromium}=require(process.argv[2]||'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const now=new Date(),year=now.getFullYear(),month=String(now.getMonth()+1).padStart(2,'0'),date=`${year}-${month}-11`;
const customers=[{id:'jose',name:'José da Silva',phone:'(61) 99999-8888',city:'Brasília',document:'123.456.789-01',address:'Rua de teste'},...Array.from({length:80},(_,i)=>({id:'c'+i,name:'Cliente teste '+String(i).padStart(2,'0'),phone:'11988887777',city:'São Paulo'}))];
const data={customers,products:[{id:'p1',name:'Grama sintética',category:'Grama',description:'Produto de teste',pricePerM2:'80.50'}],history:[{id:'old',customer:{name:'Cliente antigo'},date:'2024-02-20',totalCents:10000,source:'web',status:'approved'},{id:'current',customer:{name:'Venda de teste'},date,totalCents:20000,source:'web',status:'approved'}],summary:{month:`${year}-${month}`},updatedAt:now.toISOString()};
(async()=>{const browser=await chromium.launch({headless:true,channel:'msedge'});const page=await browser.newPage({viewport:{width:390,height:844}});const errors=[],saved=new Map();let disconnected=false;
  page.on('pageerror',error=>errors.push(error.message));
  fs.mkdirSync('dist',{recursive:true});
  await page.addInitScript(()=>{window.print=()=>{window.__printed=true;};});
  await page.route('**/api/mobile/**',async route=>{
    if(disconnected)return route.abort('internetdisconnected');
    const url=new URL(route.request().url()),path=url.pathname;
    const headers={'Access-Control-Allow-Origin':'http://127.0.0.1:8081','Access-Control-Allow-Headers':'Content-Type,Authorization','Access-Control-Allow-Methods':'GET,POST,OPTIONS'};
    if(route.request().method()==='OPTIONS')return route.fulfill({status:204,headers});
    let body=data;
    if(path.endsWith('/auth/login'))body={token:'a'.repeat(64),expiresAt:new Date(Date.now()+86400000).toISOString(),user:{id:'ux-test',name:'Proprietário teste',email:'test@example.com'}};
    if(path.endsWith('/proposals')){const input=route.request().postDataJSON();saved.set(input.clientId,input);body={id:input.clientId};}
    if(path.endsWith('/summary')){const from=url.searchParams.get('from'),to=url.searchParams.get('to');body={from,to,approvedCount:2,approvedCents:30000,averageCents:15000,quick:{count:1,totalCents:15000},previous:{from:'2026-09-01',to:'2026-09-30',approvedCents:0,changePercent:null},financial:{covered:1,total:2,costsCents:5000,profitCents:3000},months:[{month:from.slice(0,7),totalCents:30000}],team:[{id:'a',name:'Responsável teste',count:2,totalCents:30000,commissionCents:1500}],updatedAt:now.toISOString()};}
    await route.fulfill({status:200,headers,contentType:'application/json',body:JSON.stringify(body)});
  });
  const button=name=>page.getByRole('button',{name,exact:true}),field=name=>page.getByRole(name==='Alto contraste'?'switch':'textbox',{name,exact:true});
  async function snapshot(name,top=false){
    await page.evaluate(async()=>{await Promise.all(document.getAnimations().filter(a=>a.effect?.getTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{})));});
    if(top)await page.evaluate(()=>{document.querySelectorAll('*').forEach(el=>{if(el.scrollHeight>el.clientHeight)el.scrollTop=0;});});
    await page.screenshot({path:`dist/ux-${name}.png`});
  }
  try{
    await page.goto('http://127.0.0.1:8081',{waitUntil:'networkidle'});
    await field('E-mail').fill('test@example.com');await field('Senha').fill('test');await button('Entrar').click();
    await field('Preço por m² (R$)').waitFor();
    if(process.env.UX_PROBE){console.log(await page.locator('body').innerText());await page.screenshot({path:'dist/ux-budget.png'});return;}
    await field('Preço por m² (R$)').fill('80');await field('Metragem (m²)').fill('10');await field('Custo por m² (R$)').fill('10');await field('Desconto (%)').fill('10');
    await page.getByText(/R\$\s*720,00/).waitFor();await button('Detalhes do cálculo').click();await page.getByText(/R\$\s*584,00/).waitFor();await snapshot('budget',true);
    await page.getByRole('tab',{name:/Clientes/}).click();await field('Buscar cliente').fill('61999998888');await button('Ver cliente José da Silva').click();await button('Usar na proposta').click();
    assert.equal(await field('Cliente').inputValue(),'José da Silva');await button('Adicionar item').click();await button('Escolher produto do sistema').click();await field('Pesquisar produto').fill('sintetica');await page.getByRole('button',{name:/Selecionar Grama sintética/}).click();
    await field('Pesquisar produto').waitFor({state:'hidden'});
    assert.equal(await field('Valor por metro do item 1').inputValue(),'80.50');await field('Metragem do item 1 (m²)').fill('2,5');
    await page.getByText(/Subtotal: R\$\s*201,25/).waitFor();await button('Concluir item').click();
    await button('3. Condições').click();await field('Desconto da proposta (%)').fill('10');await field('Entrada %').fill('50');await button('Salvar proposta').click();await page.getByText(/Proposta salva no celular/).waitFor();await button('Salvar proposta').click();
    await page.waitForFunction(()=>Object.keys(localStorage).some(key=>key.startsWith('@mastergreen/v1/')));
    assert.equal(saved.size,1);assert.equal([...saved.values()][0].totalCents,18113);
    await button('Visualizar PDF').click();await page.frameLocator('iframe[title="Proposta MasterGreen"]').getByText(/R\$\s*181,13/).waitFor({state:'attached'});await snapshot('proposal',true);
    await button('Buscar cliente cadastrado').click();await field('Buscar cliente').fill('Cliente teste 01');await button('Ver cliente Cliente teste 01').click();await button('Usar na proposta').click();await page.getByText(/Substituir os dados de José/).waitFor();await button('Cancelar').click();await button('Fechar').click();await button('Voltar à proposta').click();
    await page.getByRole('tab',{name:/Histórico/}).click();await button('Período: Este mês').click();await button('Todo o histórico').click();await button('Aplicar mês').waitFor({state:'hidden'});await field('Buscar no histórico').fill('antigo');await button('Ver proposta de Cliente antigo').waitFor();await snapshot('history',true);
    await page.getByRole('tab',{name:/Clientes/}).click();await field('Buscar cliente').fill('jose');await snapshot('customers',true);
    await page.getByRole('tab',{name:/Histórico/}).click();assert.equal(await field('Buscar no histórico').inputValue(),'antigo');
    await page.getByRole('tab',{name:/Resumo/}).click();await button('Ver vendas aprovadas no histórico').waitFor();await page.getByText('Sem comparação anterior',{exact:true}).waitFor();await snapshot('summary',true);await button('Ver desempenho da equipe').click();await page.getByText('Responsável teste',{exact:true}).waitFor();await button('Fechar').click();
    disconnected=true;await button('Atualizar resumo').click();await page.getByText(/Sistema indisponível/).waitFor();await button('Ver vendas aprovadas no histórico').waitFor();
    await button('Período: Este mês').click();await button('Mês passado').click();await page.getByText('Este período ainda não foi baixado.',{exact:true}).waitFor();assert.equal(await button('Ver vendas aprovadas no histórico').count(),0);
    await button('Configurações').click();await button('Extragrande').click();await field('Alto contraste').click();
    await page.getByRole('tab',{name:/Orçar/}).click();await page.setViewportSize({width:320,height:720});await snapshot('large',true);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    await button('Fazer proposta').click();assert.equal(await field('Cliente').inputValue(),'José da Silva');await snapshot('proposal-large',true);
    assert.deepEqual(errors,[]);console.log('PASS: cálculo legado, cliente, catálogo, PDF, salvar idempotente, filtros, abas, cache de resumo, offline e fonte extragrande; sem erros JS.');
  }catch(error){await page.screenshot({path:'dist/ux-failure.png'});console.error((await page.locator('body').innerText()).slice(0,5000));throw error;}
  finally{await browser.close();}
})().catch(error=>{console.error(error);process.exit(1);});

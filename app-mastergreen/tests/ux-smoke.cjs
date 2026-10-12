// Browser preview only; native sharing / keyboard / TalkBack need the Android device.
const {chromium}=require(process.argv[2]||'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const now=new Date(),year=now.getFullYear(),month=String(now.getMonth()+1).padStart(2,'0'),date=`${year}-${month}-11`;
const customers=[{id:'jose',name:'José da Silva',phone:'(61) 99999-8888',city:'Brasília',document:'123.456.789-01',address:'Rua de teste'},...Array.from({length:80},(_,i)=>({id:'c'+i,name:'Cliente teste '+String(i).padStart(2,'0'),phone:'11988887777',city:'São Paulo'}))];
const data={customers,products:[{id:'p1',name:'Grama sintética',category:'Grama',description:'Produto de teste',pricePerM2:'80.50'}],history:[{id:'old',customer:{name:'Cliente antigo'},date:'2024-02-20',totalCents:10000,source:'web',status:'approved'},{id:'current',customer:{name:'Venda de teste'},date,totalCents:20000,source:'web',status:'approved'}],summary:{month:`${year}-${month}`},updatedAt:now.toISOString()};
data.products.push({id:'p2',name:'Frete',category:'Grama',description:'Serviço de teste',pricePerM2:'150.00'},{id:'p3',name:'Lata de Cola',category:'Grama',description:'Material de teste',pricePerM2:'450.00'});
data.products[0].catalog={kind:'material',category:'Insumos e acabamentos',unit:'un'}; // Ignore obsolete cache suggestions.
data.products[2].category='Outro';
data.products.push({id:'p4',name:'Capacho Vinil',category:'Carpete',description:'Produto de teste',pricePerM2:'55.00'});
data.costs=[{id:'c1',name:'Cola interna',description:'Custo de teste',value:'50.00'}];
data.history[0].id='aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa';
(async()=>{const browser=await chromium.launch({headless:true,channel:'msedge'});const page=await browser.newPage({viewport:{width:390,height:844}});const errors=[],saved=new Map();let disconnected=false,summaryReads=0,approvedCents=30000;
  page.on('pageerror',error=>errors.push(error.message));
  page.on('console',message=>{if(/Blocked aria-hidden|descendant retained focus/.test(message.text()))errors.push(message.text());});
  fs.mkdirSync('dist',{recursive:true});
  await page.addInitScript(()=>{
    window.print=()=>{window.__printed=true;};window.__navigationLoads=0;
    let active=false;
    new MutationObserver(()=>{
      const visible=!!document.querySelector('[data-testid="navigation-loading"][aria-label="Carregando…"]');
      if(visible&&!active)window.__navigationLoads++;
      active=visible;
    }).observe(document,{childList:true,subtree:true});
  });
  await page.route('**/api/mobile/**',async route=>{
    if(disconnected)return route.abort('internetdisconnected');
    const url=new URL(route.request().url()),path=url.pathname;
    const headers={'Access-Control-Allow-Origin':'http://127.0.0.1:8081','Access-Control-Allow-Headers':'Content-Type,Authorization','Access-Control-Allow-Methods':'GET,POST,OPTIONS'};
    if(route.request().method()==='OPTIONS')return route.fulfill({status:204,headers});
    let body=data;
    if(path.endsWith('/auth/login'))body={token:'a'.repeat(64),expiresAt:new Date(Date.now()+86400000).toISOString(),user:{id:'ux-test',name:'Proprietário teste',email:'test@example.com'}};
    if(path.endsWith('/proposals')){const input=route.request().postDataJSON();saved.set(input.clientId,input);body={id:input.clientId};}
    if(path.endsWith('/summary')){summaryReads++;const from=url.searchParams.get('from'),to=url.searchParams.get('to');body={from,to,approvedCount:2,approvedCents,averageCents:15000,quick:{count:1,totalCents:15000},previous:{from:'2026-09-01',to:'2026-09-30',approvedCents:0,changePercent:null},financial:{covered:1,total:2,costsCents:5000,profitCents:3000},months:[{month:from.slice(0,7),totalCents:approvedCents}],team:[{id:'a',name:'Responsável teste',count:2,totalCents:approvedCents,commissionCents:1500}],updatedAt:now.toISOString()};}
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
    // The current tab doesn't show a fake loader. On navigation, feedback paints
    // before the next screen, then disappears on focus (not the timeout).
    await page.getByRole('tab',{name:/Orçar/}).click();
    assert.equal(await page.evaluate(()=>window.__navigationLoads),0);
    await page.evaluate(()=>{
      window.__originalFrame=window.requestAnimationFrame;window.__heldFrames=[];
      window.requestAnimationFrame=callback=>{window.__heldFrames.push(callback);return -window.__heldFrames.length;};
    });
    await page.getByRole('tab',{name:/Clientes/}).click();
    await page.getByTestId('navigation-loading').waitFor();
    await page.screenshot({path:'dist/navigation-loading.png'});
    await page.evaluate(()=>{window.requestAnimationFrame=window.__originalFrame;window.__heldFrames.forEach(callback=>window.requestAnimationFrame(callback));});
    await page.getByTestId('navigation-loading').waitFor({state:'hidden',timeout:4000});
    await field('Buscar cliente').waitFor();
    await page.getByRole('tab',{name:/Orçar/}).click();await field('Preço por m² (R$)').waitFor();
    if(process.env.UX_PROBE){console.log(await page.locator('body').innerText());await page.screenshot({path:'dist/ux-budget.png'});return;}
    await field('Preço por m² (R$)').fill('80');await field('Metragem (m²)').fill('10');await field('Custo por m² (R$)').fill('10');await field('Desconto (%)').fill('10');
    await page.getByText(/R\$\s*720,00/).waitFor();await button('Detalhes do cálculo').click();await page.getByText(/R\$\s*584,00/).waitFor();await snapshot('budget',true);
    await page.getByRole('tab',{name:/Clientes/}).click();await field('Buscar cliente').fill('61999998888');await button('Ver cliente José da Silva').click();await button('Usar na proposta').click();
    assert.equal(await field('Cliente').inputValue(),'José da Silva');await button('Adicionar item').click();await button('Escolher produto do sistema').click();
    await field('Pesquisar no catálogo').waitFor();
    const category=page.getByRole('combobox',{name:'Categoria do produto'});
    assert.deepEqual(await category.locator('option').allTextContents(),['Todas as categorias','Carpete','Grama','Outro']);
    await category.selectOption('category:Grama');
    await page.getByRole('button',{name:/Selecionar Grama sintética/}).waitFor();
    await page.getByRole('button',{name:/Selecionar Frete/}).waitFor(); // Frete is registered under Grama in this web fixture.
    assert.equal(await page.getByRole('button',{name:/Selecionar Lata de Cola/}).count(),0);
    await field('Pesquisar no catálogo').fill('cola');
    await page.getByText(/Nenhum produto encontrado/).waitFor();
    await category.selectOption('category:Outro');
    await page.getByRole('button',{name:/Selecionar Lata de Cola/}).waitFor();
    assert.equal(await button('Serviços').count(),0);assert.equal(await button('Materiais').count(),0);
    await field('Pesquisar no catálogo').fill('');await category.selectOption('category:Grama');await snapshot('catalog',true);
    await button('Custos internos').click();await button('Usar descrição de Cola interna').click();
    assert.equal(await field('Valor de venda por un do item 1').inputValue(),'');
    await button('Escolher produto do sistema').click();await field('Pesquisar no catálogo').fill('sintetica');await page.getByRole('button',{name:/Selecionar Grama sintética/}).click();
    await field('Pesquisar no catálogo').waitFor({state:'hidden'});
    assert.equal(await field('Valor de venda por m² do item 1').inputValue(),'80.50');await field('Metragem do item 1 (m²)').fill('2,5');
    await page.getByText(/Subtotal: R\$\s*201,25/).waitFor();await button('Concluir item').click();
    await button('3. Condições').click();await field('Desconto da proposta (%)').fill('10');await field('Entrada %').fill('50');await button('Salvar proposta').click();await page.getByText(/Proposta salva no celular/).waitFor();await button('Salvar proposta').click();
    await page.waitForFunction(()=>Object.keys(localStorage).some(key=>key.startsWith('@mastergreen/v1/')));
    assert.equal(saved.size,1);assert.equal([...saved.values()][0].totalCents,18113);
    assert.equal([...saved.values()][0].customerId,'jose');
    assert.deepEqual([...saved.values()][0].items,[{productId:'p1',name:'Grama sintética',quantity:2.5,unitPrice:80.5,unit:'m²'}]);
    await button('Visualizar PDF').click();await page.frameLocator('iframe[title="Proposta MasterGreen"]').getByText(/R\$\s*181,13/).waitFor({state:'attached'});await snapshot('proposal',true);
    await button('Buscar cliente cadastrado').click();await field('Buscar cliente').fill('Cliente teste 01');await button('Ver cliente Cliente teste 01').click();await button('Usar na proposta').click();await page.getByText(/Substituir os dados de José/).waitFor();await button('Cancelar').click();await button('Fechar').click();await button('Voltar à proposta').click();
    await page.getByRole('tab',{name:/Histórico/}).click();await button('Período: Este mês').click();await button('Todo o histórico').click();await button('Aplicar mês').waitFor({state:'hidden'});await field('Buscar no histórico').fill('antigo');await button('Ver proposta de Cliente antigo').waitFor();await snapshot('history',true);
    await button('Ver proposta de Cliente antigo').click();
    await page.context().route('**/orcamentos?view=*',route=>route.fulfill({contentType:'text/html',body:'<h1>Sistema web de teste</h1>'}));
    const popupEvent=page.waitForEvent('popup');await button('Abrir no sistema web').click();
    const popup=await popupEvent;await popup.waitForLoadState();
    const webLink=new URL(popup.url());assert.equal(webLink.pathname,'/orcamentos');
    assert.deepEqual([...webLink.searchParams],[['view',data.history[0].id]]);
    await popup.close();await snapshot('history-web-link');await button('Fechar').click();
    await field('Buscar no histórico').fill('José');await button('Ver proposta de José da Silva').click();
    await button('Compartilhar cópia original').waitFor();
    await page.getByText('Cópia original criada neste celular. Não inclui alterações feitas depois no web.',{exact:true}).waitFor();
    const currentEvent=page.waitForEvent('popup');await button('Ver versão atual no web').click();
    const currentPopup=await currentEvent;await currentPopup.waitForLoadState();
    const currentUrl=new URL(currentPopup.url());assert.equal(currentUrl.searchParams.get('source'),'app');assert.equal(currentUrl.searchParams.get('view'),[...saved.keys()][0]);
    await currentPopup.close();await button('Compartilhar cópia original').click();
    await page.frameLocator('iframe[title="Proposta MasterGreen"]').last().getByText(/R\$\s*181,13/).waitFor({state:'attached'});
    await button('Fechar').click();await field('Buscar no histórico').fill('antigo');
    await page.getByRole('tab',{name:/Clientes/}).click();await field('Buscar cliente').fill('jose');await snapshot('customers',true);
    await page.getByRole('tab',{name:/Histórico/}).click();assert.equal(await field('Buscar no histórico').inputValue(),'antigo');
    await page.getByRole('tab',{name:/Resumo/}).click();await button('Ver vendas aprovadas no histórico').waitFor();await page.getByText('Sem comparação anterior',{exact:true}).waitFor();await snapshot('summary',true);await button('Ver desempenho da equipe').click();await page.getByText('Responsável teste',{exact:true}).waitFor();await button('Fechar').click();
    const previousReads=summaryReads;approvedCents=40000;
    await page.getByRole('tab',{name:/Clientes/}).click();await field('Buscar cliente').waitFor();
    await page.getByRole('tab',{name:/Resumo/}).click();
    await button('Ver vendas aprovadas no histórico').getByText(/R\$\s*400,00/).waitFor();assert.ok(summaryReads>previousReads);
    disconnected=true;await button('Atualizar resumo').click();await page.getByText(/Sistema indisponível/).waitFor();await button('Ver vendas aprovadas no histórico').waitFor();
    await button('Período: Este mês').click();await button('Mês passado').click();await page.getByText('Este período ainda não foi baixado.',{exact:true}).waitFor();assert.equal(await button('Ver vendas aprovadas no histórico').count(),0);
    await button('Configurações').click();await button('Extragrande').click();await field('Alto contraste').click();
    await page.getByRole('tab',{name:/Orçar/}).click();await page.setViewportSize({width:320,height:720});await snapshot('large',true);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    await button('Fazer proposta').click();assert.equal(await field('Cliente').inputValue(),'José da Silva');await snapshot('proposal-large',true);
    // Offline and extralarge text: cached categories remain usable, including the last item.
    await button('Item 1').click();await button('Escolher produto do sistema').click();
    await category.selectOption('category:Carpete');await page.getByRole('button',{name:/Selecionar Capacho Vinil/}).scrollIntoViewIfNeeded();
    await snapshot('catalog-large');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    await page.getByRole('button',{name:/Selecionar Capacho Vinil/}).click();
    assert.equal(await field('Valor de venda por m² do item 1').inputValue(),'55.00');
    // The reset action stays on screen even when the long form is scrolled.
    await button('Salvar proposta').scrollIntoViewIfNeeded();
    const resetBox=await button('Nova proposta').boundingBox();assert.ok(resetBox.y>=0&&resetBox.y+resetBox.height<720);
    await button('Nova proposta').click();await button('Continuar preenchendo').click();
    assert.equal(await field('Cliente').inputValue(),'José da Silva');
    await button('Nova proposta').click();await button('Sim, iniciar nova proposta').click();
    await page.waitForFunction(()=>{const key=Object.keys(localStorage).find(key=>key.startsWith('@mastergreen/v1/'));return key&&JSON.parse(localStorage.getItem(key)).proposal.customer==='';});
    assert.equal(await field('Cliente').inputValue(),'');
    const kept=await page.evaluate(()=>JSON.parse(localStorage.getItem(Object.keys(localStorage).find(key=>key.startsWith('@mastergreen/v1/')))));
    assert.equal(kept.queue.length,1);assert.equal(kept.proposal.items.length,0);assert.equal(kept.lastFinalized,null);
    // Simulate an already-sent legacy summary with its original document still on-device.
    await page.evaluate(()=>{
      const key=Object.keys(localStorage).find(key=>key.startsWith('@mastergreen/v1/')),state=JSON.parse(localStorage.getItem(key));
      const old=structuredClone(state.queue[0]);delete old.payload.items;delete old.itemsSynced;
      old.payload.clientId='aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa';old.payload.customer.name='Cliente legado';old.document.customer='Cliente legado';
      state.queue.push(old);state.proposal=old.document;
      const {clientId,...summary}=old.payload;state.lastFinalized={clientId,signature:JSON.stringify(summary)};
      localStorage.setItem(key,JSON.stringify(state));
    });
    disconnected=false;await page.reload({waitUntil:'networkidle'});
    await page.waitForFunction(()=>{const key=Object.keys(localStorage).find(key=>key.startsWith('@mastergreen/v1/'));return key&&JSON.parse(localStorage.getItem(key)).queue.every(row=>row.itemsSynced);});
    assert.equal(saved.size,2);assert.equal(saved.get('aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa').items[0].name,'Grama sintética');
    await button('Salvar proposta').click();await page.getByText(/Proposta salva no celular/).waitFor();
    const finalCount=await page.evaluate(()=>JSON.parse(localStorage.getItem(Object.keys(localStorage).find(key=>key.startsWith('@mastergreen/v1/')))).queue.length);
    assert.equal(finalCount,2);assert.equal(saved.size,2);
    assert.deepEqual(errors,[]);console.log('PASS: cálculo legado, cliente, catálogo, PDF, salvar idempotente, filtros, abas, cache de resumo, offline e fonte extragrande; sem erros JS.');
  }catch(error){console.error(error);await page.screenshot({path:'dist/ux-failure.png'}).catch(()=>{});console.error((await page.locator('body').innerText()).slice(0,5000));throw error;}
  finally{await browser.close();}
})().catch(error=>{console.error(error);process.exit(1);});

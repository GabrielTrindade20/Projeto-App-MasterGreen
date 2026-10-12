import { Picker } from '@react-native-picker/picker';
import { useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, Pressable, ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Action, Card, Choice, Field, Screen, Section, Sheet, Text, colors, ui } from '@/components/mastergreen-ui';
import { CustomerPicker } from '@/components/customer-browser';
import { normalize } from '@/lib/consultation';
import { catalogCategories, filterCatalog, productCategoryLabel } from '@/lib/catalog';
import { useConnection } from '@/context/connection';
import { emptyProposal, localDate, type ProposalDraft } from '@/lib/mobile-state';
import ProposalDate from '@/components/proposal-date';
import { exportProposal, getBannerUri } from '@/lib/export-proposal';
import { gerarHTML } from '@/lib/proposal-html';
import { currency, formatDate, numberFromInput, percentFromInput, proposalTotal, safePdfName, type ProposalItem } from '@/lib/quotation';

function phoneMask(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  return digits.length <= 10 ? digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3') : digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
}

function documentMask(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 14);
  return digits.length <= 11 ? digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') : digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

function ProposalForm() {
  const {local,change,finalize,sync,syncing,error:connectionError}=useConnection();
  const {customer,contact,phone,address,document,freight,warranty,unit,entry,discount,items}=local.proposal;
  const date=new Date(local.proposal.date+'T12:00:00');
  const set=(field:keyof Omit<ProposalDraft,'items'>)=>(value:string)=>void change(state=>({...state,proposal:{...state.proposal,[field]:value}})).catch(()=>{});
  const setCustomer=set('customer'),setContact=set('contact'),setPhone=set('phone'),setAddress=set('address'),setDocument=set('document');
  const setFreight=set('freight'),setWarranty=set('warranty'),setUnit=set('unit'),setEntry=set('entry'),setDiscount=set('discount');
  const setDate=(value:Date)=>set('date')(localDate(value));
  const setItems=(update:(items:ProposalItem[])=>ProposalItem[])=>void change(state=>({...state,proposal:{...state.proposal,items:update(state.proposal.items)}})).catch(()=>{});
  const exporting = useRef(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice,setNotice]=useState('');
  const [catalogItem,setCatalogItem]=useState<number|null>(null);
  const [catalogSearch,setCatalogSearch]=useState('');
  const [category,setCategory]=useState<string|null>(null);
  const [catalogKind,setCatalogKind]=useState<'product'|'cost'>('product');
  const [customerPicker,setCustomerPicker]=useState(false),[customerOpen,setCustomerOpen]=useState(true),[conditionsOpen,setConditionsOpen]=useState(false);
  const [activeItem,setActiveItem]=useState<number|null>(null);
  const scrollRef=useRef<ScrollView>(null),customerRef=useRef<TextInput>(null);
  const positions=useRef<Record<string,number>>({});
  const inputs=useRef<Record<string,TextInput|null>>({});
  const [errorArea,setErrorArea]=useState('');
  const total = proposalTotal(items, discount);
  const savedDraft=local.queue.find(row=>row.payload.clientId===local.lastFinalized?.clientId&&JSON.stringify(row.document)===JSON.stringify(local.proposal));
  const products=local.data?.products || [];
  const categories=catalogCategories(products);
  const matchingProducts=filterCatalog(products,catalogSearch,category);
  const costs=(local.data?.costs||[]).filter(cost=>normalize(`${cost.name} ${cost.description||''}`).includes(normalize(catalogSearch)));
  const fail=(message:string,area:string,itemId?:number)=>{
    setError(message);setErrorArea(area);
    if(area==='customer')setCustomerOpen(true);
    if(area==='items')setActiveItem(itemId??null);
    if(area==='conditions')setConditionsOpen(true);
    requestAnimationFrame(()=>{
      const item=items.find(row=>row.id===itemId),key=area==='items'?`item-${itemId}`:area;
      scrollRef.current?.scrollTo({y:Math.max(0,(positions.current[key]||0)-12),animated:false});
      const target=area==='customer'?customerRef.current:area==='items'&&item?inputs.current[`${itemId}-${!item.descricao.trim()?'description':numberFromInput(item.metragem)<=0?'area':'price'}`]:inputs.current.entry;
      target?.focus();
    });
  };

  const updateItem = (id: number, field: keyof Omit<ProposalItem, 'id'>, value: string) => {
    setItems((current) => current.map((item) => item.id === id ? { ...item, [field]: value } : item));
  };

  async function generate(mode: 'save' | 'preview' | 'share') {
    if (exporting.current) return;
    setError('');
    setNotice('');
    if (!customer.trim()) { fail('Preencha o nome do cliente.','customer'); return; }
    if (!items.length || items.some((item) => !item.descricao.trim() || numberFromInput(item.metragem) <= 0 || numberFromInput(item.valorPorMetro) <= 0)) {
      fail('Adicione ao menos um item com descrição, quantidade e valor de venda maiores que zero.','items',items.find(item=>!item.descricao.trim()||numberFromInput(item.metragem)<=0||numberFromInput(item.valorPorMetro)<=0)?.id); return;
    }
    if ([entry, discount].some((value) => value.trim() !== '' && (numberFromInput(value) < 0 || numberFromInput(value) > 100 || !/^\d+([.,]\d+)?$/.test(value.trim())))) {
      fail('Entrada e desconto devem ser percentuais de 0 a 100.','conditions'); return;
    }
    if (!Number.isFinite(total) || total<=0 || total>10_000_000) {setError('O valor final deve ser maior que zero e até R$ 10 milhões.');return;}
    if ([customer,contact,freight,warranty].some(value=>value.length>200)||address.length>1000) {setError('Reduza os textos muito longos antes de gerar.');return;}
    exporting.current = true;
    setBusy(true);
    try {
      const formattedDate = formatDate(date);
      const payment = `${percentFromInput(entry)}% de entrada + ${100 - percentFromInput(entry)}% na entrega`;
      const save = async () => {
        await finalize({...(local.proposal.customerId?{customerId:local.proposal.customerId}:{}),customer:{name:customer.trim(),contact:contact.trim(),phone,document,address},proposalDate:local.proposal.date,
          freight:freight||'Não informado',warranty:warranty?`${warranty} ${unit}`:'Não informado',payment,
          discountPercent:percentFromInput(discount),totalCents:Math.round(total*100)},local.proposal);
        setNotice('Proposta salva no celular. O envio ao sistema é automático quando houver conexão permitida.');
      };
      if (mode === 'save') { await save(); return; }
      const html = gerarHTML(customer, contact, phone, address, document, formattedDate, freight || 'Não informado', items, total,
        warranty ? `${warranty} ${unit}` : 'Não informado', payment, await getBannerUri(), String(percentFromInput(discount)),local.data?.company);
      await exportProposal(html, safePdfName(contact || customer, formattedDate), mode === 'preview', mode === 'share' ? save : undefined);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível gerar o PDF. Tente novamente.');
    } finally {
      exporting.current = false;
      setBusy(false);
    }
  }

  const catalogFilters=<View style={{padding:16,gap:14}}>
    <View style={ui.wrap}>
      <Choice title="Produtos do web" selected={catalogKind==='product'} onPress={()=>{setCatalogKind('product');setCatalogSearch('');}} />
      <Choice title="Custos internos" selected={catalogKind==='cost'} onPress={()=>{setCatalogKind('cost');setCatalogSearch('');}} />
    </View>
    <Field label="Pesquisar no catálogo" placeholder={catalogKind==='product'?'Nome ou categoria':'Nome do custo'} value={catalogSearch} onChangeText={setCatalogSearch} />
    {catalogKind==='product'?<View style={{gap:8}}>
      <Text style={ui.label}>Categoria do produto</Text>
      <View style={{borderWidth:1.5,borderColor:'#819B89',borderRadius:12,overflow:'hidden',backgroundColor:colors.surface}}>
        <Picker
          accessibilityLabel="Categoria do produto"
          selectedValue={category===null?'all':`category:${category}`}
          onValueChange={(value:string)=>setCategory(value==='all'?null:value.slice(9))}
          style={{color:colors.ink,minHeight:58,fontSize:22*local.preferences.fontScale}}
        >
          <Picker.Item label="Todas as categorias" value="all" style={{fontSize:22}} />
          {categories.map(value=><Picker.Item key={value} label={productCategoryLabel({name:'',category:value})} value={`category:${value}`} style={{fontSize:22}} />)}
        </Picker>
      </View>
      <Text accessibilityLiveRegion="polite" style={ui.muted}>{matchingProducts.length} {matchingProducts.length===1?'produto encontrado':'produtos encontrados'}</Text>
    </View>:<>
      <Text style={ui.muted}>Custos são referências internas. Ao selecionar, você define o preço de venda.</Text>
      <Text accessibilityLiveRegion="polite" style={ui.muted}>{costs.length} {costs.length===1?'custo encontrado':'custos encontrados'}</Text>
    </>}
  </View>;

  return <Screen title="Proposta" back scrollRef={scrollRef} topAction={<NewProposal disabled={busy} onReset={()=>{setError('');setNotice('');setErrorArea('');setCustomerOpen(true);setConditionsOpen(false);setActiveItem(null);scrollRef.current?.scrollTo({y:0,animated:false});}}/>} footer={<><Text style={ui.label}>Total · {currency(total)}</Text><Action title={busy?'Preparando…':'Gerar e compartilhar PDF'} disabled={busy} onPress={()=>void generate('share')}/></>}>
    <Text style={ui.muted}>{savedDraft?(savedDraft.sentAt?'✓ Proposta salva e enviada ao sistema.':'Proposta salva · aguardando envio ao sistema.'):'Rascunho guardado neste aparelho a cada alteração.'}</Text>
    {connectionError.startsWith('Não foi possível salvar')&&<Text accessibilityRole="alert" style={ui.message}>{connectionError}</Text>}
    <Section title="1. Cliente" onLayout={event=>{positions.current.customer=event.nativeEvent.layout.y;}} summary={customer||'Escolha ou informe um nome'} open={customerOpen} onToggle={()=>setCustomerOpen(value=>!value)}>
      <Action secondary title="Buscar cliente cadastrado" onPress={()=>setCustomerPicker(true)}/>
      <Field inputRef={customerRef} label="Cliente" placeholder="Nome do cliente" value={customer} onChangeText={setCustomer} />
      {errorArea==='customer'&&!!error&&<Text accessibilityRole="alert" style={ui.message}>{error}</Text>}
      <Field label="Telefone" keyboardType="phone-pad" value={phone} onChangeText={(value) => setPhone(phoneMask(value))} />
      <Section title="Dados adicionais" summary="Contato, endereço e documento">
      <Field label="A/C" placeholder="Pessoa de contato" value={contact} onChangeText={setContact} />
      <Field label="Endereço" multiline value={address} onChangeText={setAddress} />
      <Field label="CPF ou CNPJ" keyboardType="number-pad" value={document} onChangeText={(value) => setDocument(documentMask(value))} />
      </Section>
      <ProposalDate value={date} onChange={setDate} />
    </Section>
    <Text accessibilityRole="header" style={ui.heading}>2. Itens · {items.length}</Text>
    {errorArea==='items'&&!!error&&<Text accessibilityRole="alert" style={ui.message}>{error}</Text>}
    {items.map((item,index)=><Section key={item.id} title={`Item ${index+1}`} onLayout={event=>{positions.current[`item-${item.id}`]=event.nativeEvent.layout.y;}} summary={`${item.descricao||'Sem descrição'} · ${item.metragem||'0'} ${item.unit||'m²'} · ${currency(numberFromInput(item.metragem)*numberFromInput(item.valorPorMetro))}`} open={activeItem===item.id} onToggle={()=>setActiveItem(value=>value===item.id?null:item.id)}>
      <Action secondary title="Escolher produto do sistema" onPress={()=>{setCatalogSearch('');setCategory(null);setCatalogKind('product');setCatalogItem(item.id);}}/>
      <Field inputRef={ref=>{inputs.current[`${item.id}-description`]=ref;}} label={`Descrição do produto ${index+1}`} placeholder="Ou escreva um item livre" multiline value={item.descricao} onChangeText={value=>updateItem(item.id,'descricao',value)}/>
      <Text style={ui.label}>Unidade do item</Text><View style={ui.wrap}>{['m²','un','m','serviço'].map(value=><Choice key={value} title={value} selected={(item.unit||'m²')===value} onPress={()=>updateItem(item.id,'unit',value)}/>)}</View>
      {!!item.costReference&&<Text style={ui.muted}>Referência de custo interno: {item.costReference}. Informe abaixo seu preço de venda; o custo não aparece no PDF.</Text>}
      <Field inputRef={ref=>{inputs.current[`${item.id}-area`]=ref;}} label={`${(item.unit||'m²')==='m²'?'Metragem':'Quantidade'} do item ${index+1} (${item.unit||'m²'})`} placeholder="Ex: 10" keyboardType="decimal-pad" value={item.metragem} onChangeText={value=>updateItem(item.id,'metragem',value)}/>
      <Field inputRef={ref=>{inputs.current[`${item.id}-price`]=ref;}} label={`Valor de venda por ${item.unit||'m²'} do item ${index+1}`} placeholder="Ex: 80" keyboardType="decimal-pad" value={item.valorPorMetro} onChangeText={value=>updateItem(item.id,'valorPorMetro',value)}/>
      <Text style={ui.label}>Subtotal: {currency(numberFromInput(item.metragem)*numberFromInput(item.valorPorMetro))}</Text>
      <Action secondary title="Concluir item" onPress={()=>setActiveItem(null)}/>
      <Action title={`Remover item ${index+1}`} danger onPress={()=>setItems(current=>current.filter(row=>row.id!==item.id))}/>
    </Section>)}
    <Action secondary title="Adicionar item" onPress={()=>{const id=Math.max(0,...items.map(row=>row.id))+1;setItems(current=>[...current,{id,metragem:'',valorPorMetro:'',descricao:''}]);setActiveItem(id);}}/>
    <Section title="3. Condições" onLayout={event=>{positions.current.conditions=event.nativeEvent.layout.y;}} summary={`${freight||'Frete não informado'} · entrada ${percentFromInput(entry)}% · desconto ${percentFromInput(discount)}%`} open={conditionsOpen} onToggle={()=>setConditionsOpen(value=>!value)}>
      <Text style={ui.label}>Frete incluso?</Text>
      <Picker accessibilityLabel="Frete incluso?" selectedValue={freight} onValueChange={setFreight} style={{ color: '#101A13', minHeight: 52 }}>
        <Picker.Item label="Selecione" value="" style={{ fontSize: 22 }} />
        <Picker.Item label="Incluso" value="Incluso" style={{ fontSize: 22 }} />
        <Picker.Item label="Não incluso" value="Não incluso" style={{ fontSize: 22 }} />
      </Picker>
      <Field label="Prazo de garantia" placeholder="Ex: 25" keyboardType="number-pad" value={warranty} onChangeText={(value) => setWarranty(value.replace(/\D/g, ''))} />
      <Picker accessibilityLabel="Unidade da garantia" selectedValue={unit} onValueChange={setUnit} style={{ color: '#101A13', minHeight: 52 }}>
        <Picker.Item label="meses" value="meses" style={{ fontSize: 22 }} />
        <Picker.Item label="anos" value="anos" style={{ fontSize: 22 }} />
      </Picker>
      <Field inputRef={ref=>{inputs.current.entry=ref;}} label="Entrada %" placeholder="Ex: 50" keyboardType="decimal-pad" value={entry} onChangeText={setEntry} />
      {entry !== '' && <Text style={ui.muted}>{percentFromInput(entry)}% de entrada + {100 - percentFromInput(entry)}% na entrega</Text>}
      <Field label="Desconto da proposta (%)" placeholder="Ex: 10" keyboardType="decimal-pad" value={discount} onChangeText={setDiscount}/>
      {errorArea==='conditions'&&!!error&&<Text accessibilityRole="alert" style={ui.message}>{error}</Text>}
    </Section>
    <Card title="4. Revisão"><Text style={ui.label}>{customer||'Cliente não informado'}</Text><Text style={ui.muted}>{items.length} itens · desconto {percentFromInput(discount)}%</Text>
      <Text style={ui.value}>{currency(total)}</Text>
      <Text style={ui.muted}>Salvar mantém uma cópia para compartilhar depois. Gerar e compartilhar também salva automaticamente.</Text>
    </Card>
    <View style={{ gap: 12 }}>
      {!!error && <Card><Text accessibilityRole="alert" accessibilityLiveRegion="assertive" style={ui.message}>{error}</Text></Card>}
      {!!notice&&<Card><Text accessibilityLiveRegion="polite" style={ui.label}>{notice}</Text></Card>}
      {busy && <ActivityIndicator accessibilityLabel="Preparando PDF" size="large" color="#167341" />}
      <Action secondary title="Salvar proposta" disabled={busy} onPress={() => void generate('save')} />
      <Action secondary title="Visualizar PDF" disabled={busy} onPress={() => void generate('preview')} />
    </View>
    <CustomerPicker visible={customerPicker} onClose={()=>setCustomerPicker(false)}/>
    <Modal visible={catalogItem !== null} animationType="slide" onRequestClose={() => setCatalogItem(null)}>
      <SafeAreaView style={{flex:1,backgroundColor:colors.background}}>
        <Screen title="Escolher item" scroll={false} settings={false} footer={<Action secondary title="Voltar ao item" onPress={() => setCatalogItem(null)} />}>
          {catalogKind==='cost'?<FlatList
            data={costs}
            keyExtractor={cost=>cost.id}
            keyboardShouldPersistTaps="handled"
            ListHeaderComponent={catalogFilters}
            renderItem={({item:cost})=><Pressable accessibilityRole="button" accessibilityLabel={'Usar descrição de '+cost.name} style={ui.listRow} onPress={()=>{
              if(catalogItem!==null)setItems(current=>current.map(item=>item.id===catalogItem?{...item,productId:undefined,descricao:cost.name,valorPorMetro:'',unit:'un',costReference:currency(numberFromInput(cost.value))}:item));
              setCatalogItem(null);
            }}>
              <Text style={ui.label}>{cost.name}</Text>
              <Text style={ui.muted}>Custo de referência: {currency(numberFromInput(cost.value))} · confirme a unidade</Text>
              {!!cost.description&&<Text style={ui.muted}>{cost.description}</Text>}
            </Pressable>}
            ListEmptyComponent={<Text style={[ui.muted,{padding:20}]}>Nenhum custo encontrado. Sincronize ou preencha o item manualmente.</Text>}
          />:<FlatList
            data={matchingProducts}
            keyExtractor={product=>product.id}
            keyboardShouldPersistTaps="handled"
            ListHeaderComponent={catalogFilters}
            renderItem={({item:product})=><Pressable style={ui.listRow} accessibilityRole="button" accessibilityLabel={`Selecionar ${product.name}, ${currency(numberFromInput(product.pricePerM2))} por m²`} onPress={()=>{
              if(catalogItem!==null)setItems(current=>current.map(item=>item.id===catalogItem?{...item,productId:product.id,descricao:product.name,valorPorMetro:product.pricePerM2,unit:'m²',costReference:undefined}:item));
              setCatalogItem(null);
            }}>
              <Text style={ui.label}>{product.name}</Text>
              <Text style={ui.muted}>{productCategoryLabel(product)}</Text>
              <Text style={[ui.value,{fontSize:26}]}>{currency(numberFromInput(product.pricePerM2))}/m²</Text>
              {!!product.description&&<Text style={ui.muted}>{product.description}</Text>}
            </Pressable>}
            ListEmptyComponent={products.length?
              <Text style={[ui.muted,{padding:20}]}>Nenhum produto encontrado. Altere a busca ou a categoria, ou volte ao item para preencher manualmente.</Text>:
              <Card><Text style={ui.label}>Nenhum produto salvo neste aparelho. Sincronize para carregar o cadastro do web ou volte ao item para preencher manualmente.</Text><Action title={syncing?'Sincronizando…':'Sincronizar agora'} disabled={syncing} onPress={()=>void sync()} /></Card>}
          />}
        </Screen>
      </SafeAreaView>
    </Modal>
  </Screen>;
}

export default function ProposalScreen() {
  return <ProposalForm />;
}
function NewProposal({disabled,onReset}:{disabled:boolean;onReset:()=>void}){
  const {local,change}=useConnection();const [confirm,setConfirm]=useState(false),[saving,setSaving]=useState(false),[error,setError]=useState('');
  async function reset(){
    if(disabled||saving)return;
    const previous=local.proposal,finalized=local.lastFinalized;
    setSaving(true);setError('');
    try{await change(state=>({...state,proposal:emptyProposal(),lastFinalized:null}));setConfirm(false);onReset();}
    catch{await change(state=>({...state,proposal:previous,lastFinalized:finalized})).catch(()=>{});setError('Não foi possível salvar a limpeza. Seus campos foram restaurados. Tente novamente.');}
    finally{setSaving(false);}
  }
  return <><Action secondary title="Nova proposta" disabled={disabled||saving} onPress={()=>{setError('');setConfirm(true);}}/>
    <Sheet title="Iniciar nova proposta?" visible={confirm} onClose={()=>{if(!saving)setConfirm(false);}}>
      <Text style={ui.label}>Os campos atuais serão limpos. As propostas já salvas continuarão no histórico, inclusive as que aguardam envio.</Text>
      <Text style={ui.muted}>Se ainda não salvou esta proposta, volte e salve antes de continuar.</Text>
      <Action danger title={saving?'Limpando…':'Sim, iniciar nova proposta'} disabled={disabled||saving} onPress={()=>void reset()}/>
      <Action secondary title="Continuar preenchendo" disabled={saving} onPress={()=>setConfirm(false)}/>
      {!!error&&<Text style={ui.message}>{error}</Text>}
    </Sheet></>;
}

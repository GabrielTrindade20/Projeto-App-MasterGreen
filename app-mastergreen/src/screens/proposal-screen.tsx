import { Picker } from '@react-native-picker/picker';
import { useRef, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, View } from 'react-native';
import { Action, Card, Field, Screen, Text, ui } from '@/components/mastergreen-ui';
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
  const {local,change,finalize,sync,syncing}=useConnection();
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
  const total = proposalTotal(items, discount);
  const products=local.data?.products || [];
  const matchingProducts=products.filter(product=>`${product.name} ${product.category || ''} ${product.description || ''}`.toLocaleLowerCase('pt-BR').includes(catalogSearch.trim().toLocaleLowerCase('pt-BR')));

  const updateItem = (id: number, field: keyof Omit<ProposalItem, 'id'>, value: string) => {
    setItems((current) => current.map((item) => item.id === id ? { ...item, [field]: value } : item));
  };

  async function generate(mode: 'save' | 'preview' | 'share') {
    if (exporting.current) return;
    setError('');
    setNotice('');
    if (!customer.trim()) { setError('Preencha o nome do cliente.'); return; }
    if (!items.length || items.some((item) => !item.descricao.trim() || numberFromInput(item.metragem) <= 0 || numberFromInput(item.valorPorMetro) <= 0)) {
      setError('Adicione ao menos um item com descrição, metragem e valor por metro maiores que zero.'); return;
    }
    if ([entry, discount].some((value) => value.trim() !== '' && (numberFromInput(value) < 0 || numberFromInput(value) > 100 || !/^\d+([.,]\d+)?$/.test(value.trim())))) {
      setError('Entrada e desconto devem ser percentuais de 0 a 100.'); return;
    }
    if (!Number.isFinite(total) || total<=0 || total>10_000_000) {setError('O valor final deve ser maior que zero e até R$ 10 milhões.');return;}
    if ([customer,contact,freight,warranty].some(value=>value.length>200)||address.length>1000) {setError('Reduza os textos muito longos antes de gerar.');return;}
    exporting.current = true;
    setBusy(true);
    try {
      const formattedDate = formatDate(date);
      const payment = `${percentFromInput(entry)}% de entrada + ${100 - percentFromInput(entry)}% na entrega`;
      const save = async () => {
        await finalize({customer:{name:customer.trim(),contact:contact.trim(),phone,document,address},proposalDate:local.proposal.date,
          freight:freight||'Não informado',warranty:warranty?`${warranty} ${unit}`:'Não informado',payment,
          discountPercent:percentFromInput(discount),totalCents:Math.round(total*100)},local.proposal);
        setNotice('Proposta salva no celular. O envio ao sistema é automático quando houver conexão permitida.');
      };
      if (mode === 'save') { await save(); return; }
      const html = gerarHTML(customer, contact, phone, address, document, formattedDate, freight || 'Não informado', items, total,
        warranty ? `${warranty} ${unit}` : 'Não informado', payment, await getBannerUri(), String(percentFromInput(discount)));
      await exportProposal(html, safePdfName(contact || customer, formattedDate), mode === 'preview', mode === 'share' ? save : undefined);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível gerar o PDF. Tente novamente.');
    } finally {
      exporting.current = false;
      setBusy(false);
    }
  }

  return <>
    <Card title="Informações do Cliente">
      <Field label="Cliente" placeholder="Nome do cliente" value={customer} onChangeText={setCustomer} />
      <Field label="A/C" placeholder="Pessoa de contato" value={contact} onChangeText={setContact} />
      <Field label="Telefone" keyboardType="phone-pad" value={phone} onChangeText={(value) => setPhone(phoneMask(value))} />
      <Field label="Endereço" multiline value={address} onChangeText={setAddress} />
      <Field label="CPF ou CNPJ" keyboardType="number-pad" value={document} onChangeText={(value) => setDocument(documentMask(value))} />
      <ProposalDate value={date} onChange={setDate} />
    </Card>
    <Card title="Frete Incluso?">
      <Picker accessibilityLabel="Frete incluso?" selectedValue={freight} onValueChange={setFreight} style={{ color: '#101A13', minHeight: 52 }}>
        <Picker.Item label="Selecione" value="" style={{ fontSize: 22 }} />
        <Picker.Item label="Incluso" value="Incluso" style={{ fontSize: 22 }} />
        <Picker.Item label="Não incluso" value="Não incluso" style={{ fontSize: 22 }} />
      </Picker>
    </Card>
    <Card title="Prazo de Garantia">
      <Field label="Quantidade" placeholder="Ex: 25" keyboardType="number-pad" value={warranty} onChangeText={(value) => setWarranty(value.replace(/\D/g, ''))} />
      <Picker accessibilityLabel="Unidade da garantia" selectedValue={unit} onValueChange={setUnit} style={{ color: '#101A13', minHeight: 52 }}>
        <Picker.Item label="meses" value="meses" style={{ fontSize: 22 }} />
        <Picker.Item label="anos" value="anos" style={{ fontSize: 22 }} />
      </Picker>
    </Card>
    <Card title="Forma de Pagamento">
      <Field label="Entrada %" placeholder="Ex: 50" keyboardType="decimal-pad" value={entry} onChangeText={setEntry} />
      {entry !== '' && <Text style={ui.label}>{percentFromInput(entry)}% de entrada + {100 - percentFromInput(entry)}% na entrega</Text>}
    </Card>
    {items.map((item, index) => <Card key={item.id} title={`Item ${index + 1}`}>
      <Action title="Escolher produto do sistema" onPress={() => {setCatalogSearch('');setCatalogItem(item.id);}} />
      <Field label={`Metragem do item ${index + 1} (m²)`} placeholder="Ex: 10" keyboardType="decimal-pad" value={item.metragem} onChangeText={(value) => updateItem(item.id, 'metragem', value)} />
      <Field label={`Valor por metro do item ${index + 1}`} placeholder="Ex: 80" keyboardType="decimal-pad" value={item.valorPorMetro} onChangeText={(value) => updateItem(item.id, 'valorPorMetro', value)} />
      <Field label={`Descrição do produto ${index + 1}`} placeholder="Ex: grama sintética" multiline value={item.descricao} onChangeText={(value) => updateItem(item.id, 'descricao', value)} />
      <Action title={`Remover item ${index + 1}`} danger onPress={() => setItems((current) => current.filter((row) => row.id !== item.id))} />
    </Card>)}
    <Action title="Adicionar item do sistema" onPress={() => {setCatalogSearch('');setCatalogItem(-1);}} />
    <Action title="Adicionar item manualmente" onPress={() => {
      const id = Math.max(0,...items.map(row=>row.id))+1;
      setItems((current) => [...current, { id, metragem: '', valorPorMetro: '', descricao: '' }]);
    }} />
    <Card>
      <Field label="DESCONTO %" placeholder="Ex: 10" keyboardType="decimal-pad" value={discount} onChangeText={setDiscount} />
      <Text style={ui.label}>VALOR FINAL DO CLIENTE</Text><Text style={ui.value}>{currency(total)}</Text>
    </Card>
    <View style={{ gap: 12 }}>
      {!!error && <Card><Text accessibilityRole="alert" accessibilityLiveRegion="assertive" style={ui.message}>{error}</Text></Card>}
      {!!notice&&<Card><Text accessibilityLiveRegion="polite" style={ui.label}>{notice}</Text></Card>}
      {busy && <ActivityIndicator accessibilityLabel="Preparando PDF" size="large" color="#fff" />}
      <Action title="Salvar proposta" disabled={busy} onPress={() => void generate('save')} />
      <Action title={busy ? 'Preparando PDF…' : 'Gerar e compartilhar PDF' } disabled={busy} onPress={() => void generate('share')} />
      <Action title="Visualizar PDF" disabled={busy} onPress={() => void generate('preview')} />
    </View>
    <Modal visible={catalogItem !== null} animationType="slide" onRequestClose={() => setCatalogItem(null)}>
      <Screen title="Produtos do sistema">
        <Field label="Pesquisar produto" placeholder="Nome ou categoria" value={catalogSearch} onChangeText={setCatalogSearch} />
        <Action title="Fechar lista" onPress={() => setCatalogItem(null)} />
        {!products.length && <Card><Text style={ui.label}>Nenhum produto em cache. Conecte-se ao Wi-Fi e sincronize; você pode continuar preenchendo o item manualmente.</Text><Action title={syncing?'Sincronizando…':'Sincronizar agora'} disabled={syncing} onPress={() => void sync()} /></Card>}
        <View style={{gap:12}}>
          {matchingProducts.map(product => <Pressable key={product.id} accessibilityRole="button" accessibilityLabel={`Selecionar ${product.name}, ${currency(numberFromInput(product.pricePerM2))} por metro quadrado`} onPress={() => {
            if(catalogItem === -1) setItems(current=>[...current,{id:Math.max(0,...current.map(row=>row.id))+1,descricao:product.name,valorPorMetro:product.pricePerM2,metragem:''}]);
            else if(catalogItem !== null) setItems(current=>current.map(item=>item.id===catalogItem?{...item,descricao:product.name,valorPorMetro:product.pricePerM2}:item));
            setCatalogItem(null);
          }}><Card><Text style={ui.label}>{product.name}</Text><Text style={ui.value}>{currency(numberFromInput(product.pricePerM2))}/m²</Text>{!!product.description&&<Text style={ui.label}>{product.description}</Text>}</Card></Pressable>)}
          {!!products.length&&!matchingProducts.length&&<Text style={ui.label}>Nenhum produto encontrado. Feche a lista para escrever o item manualmente.</Text>}
        </View>
      </Screen>
    </Modal>
  </>;
}

export default function ProposalScreen() {
  return <Screen title="Proposta" back><ProposalForm /><NewProposal /></Screen>;
}
function NewProposal(){
  const {change}=useConnection();const [confirm,setConfirm]=useState(false);
  return confirm?<Card title="Limpar apenas o formulário?"><Text style={ui.label}>As propostas já salvas continuarão no histórico.</Text><Action title="Sim, iniciar nova proposta" onPress={()=>{void change(state=>({...state,proposal:emptyProposal(),lastFinalized:null})).catch(()=>{});setConfirm(false);}} /><Action title="Continuar preenchendo" onPress={()=>setConfirm(false)} /></Card>:<Action title="Iniciar nova proposta" onPress={()=>setConfirm(true)} />;
}

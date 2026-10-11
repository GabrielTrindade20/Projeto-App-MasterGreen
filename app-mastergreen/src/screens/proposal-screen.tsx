import { Picker } from '@react-native-picker/picker';
import { useRef, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { Action, Card, Field, Screen, ui } from '@/components/mastergreen-ui';
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
  const [customer, setCustomer] = useState('');
  const [contact, setContact] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [document, setDocument] = useState('');
  const [date, setDate] = useState(new Date());
  const [freight, setFreight] = useState('');
  const [warranty, setWarranty] = useState('');
  const [unit, setUnit] = useState('meses');
  const [entry, setEntry] = useState('');
  const [discount, setDiscount] = useState('');
  const [items, setItems] = useState<ProposalItem[]>([]);
  const counter = useRef(0);
  const exporting = useRef(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const total = proposalTotal(items, discount);

  const updateItem = (id: number, field: keyof Omit<ProposalItem, 'id'>, value: string) => {
    setItems((current) => current.map((item) => item.id === id ? { ...item, [field]: value } : item));
  };

  async function generate(preview: boolean) {
    if (exporting.current) return;
    setError('');
    if (!customer.trim()) { setError('Preencha o nome do cliente.'); return; }
    if (!items.length || items.some((item) => !item.descricao.trim() || numberFromInput(item.metragem) <= 0 || numberFromInput(item.valorPorMetro) <= 0)) {
      setError('Adicione ao menos um item com descrição, metragem e valor por metro maiores que zero.'); return;
    }
    if ([entry, discount].some((value) => value.trim() !== '' && (numberFromInput(value) < 0 || numberFromInput(value) > 100 || !/^\d+([.,]\d+)?$/.test(value.trim())))) {
      setError('Entrada e desconto devem ser percentuais de 0 a 100.'); return;
    }
    exporting.current = true;
    setBusy(true);
    try {
      const formattedDate = formatDate(date);
      const payment = `${percentFromInput(entry)}% de entrada + ${100 - percentFromInput(entry)}% na entrega`;
      const html = gerarHTML(customer, contact, phone, address, document, formattedDate, freight || 'Não informado', items, total,
        warranty ? `${warranty} ${unit}` : 'Não informado', payment, await getBannerUri(), String(percentFromInput(discount)));
      await exportProposal(html, safePdfName(contact || customer, formattedDate), preview);
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
      <Field label={`Metragem do item ${index + 1} (m²)`} placeholder="Ex: 10" keyboardType="decimal-pad" value={item.metragem} onChangeText={(value) => updateItem(item.id, 'metragem', value)} />
      <Field label={`Valor por metro do item ${index + 1}`} placeholder="Ex: 80" keyboardType="decimal-pad" value={item.valorPorMetro} onChangeText={(value) => updateItem(item.id, 'valorPorMetro', value)} />
      <Field label={`Descrição do produto ${index + 1}`} placeholder="Ex: grama sintética" multiline value={item.descricao} onChangeText={(value) => updateItem(item.id, 'descricao', value)} />
      <Action title={`Remover item ${index + 1}`} danger onPress={() => setItems((current) => current.filter((row) => row.id !== item.id))} />
    </Card>)}
    <Action title="Adicionar Item" onPress={() => {
      const id = counter.current++;
      setItems((current) => [...current, { id, metragem: '', valorPorMetro: '', descricao: '' }]);
    }} />
    <Card>
      <Field label="DESCONTO %" placeholder="Ex: 10" keyboardType="decimal-pad" value={discount} onChangeText={setDiscount} />
      <Text style={ui.label}>VALOR FINAL DO CLIENTE</Text><Text style={ui.value}>{currency(total)}</Text>
    </Card>
    <View style={{ gap: 12 }}>
      {!!error && <Card><Text accessibilityRole="alert" accessibilityLiveRegion="assertive" style={ui.message}>{error}</Text></Card>}
      {busy && <ActivityIndicator accessibilityLabel="Preparando PDF" size="large" color="#fff" />}
      <Action title={busy ? 'Preparando PDF…' : 'Gerar PDF'} danger disabled={busy} onPress={() => void generate(false)} />
      <Action title="Visualizar PDF" danger disabled={busy} onPress={() => void generate(true)} />
    </View>
  </>;
}

export default function ProposalScreen() {
  return <Screen title="Proposta"><ProposalForm /></Screen>;
}

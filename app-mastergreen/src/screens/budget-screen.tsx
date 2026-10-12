import { router } from 'expo-router';
import { View } from 'react-native';
import { Action, Card, Field, Screen, Text, ui } from '@/components/mastergreen-ui';
import { calculateBudget, currency } from '@/lib/quotation';
import { useConnection } from '@/context/connection';
import { emptyBudget, type BudgetDraft } from '@/lib/mobile-state';
import { SyncStatus } from './consultation-screens';

function BudgetForm() {
  const { local,change } = useConnection();
  const invoicePercent=4.5;
  const {cost,price,area,discount}=local.budget;
  const set=(field:keyof BudgetDraft)=>(value:string)=>void change(state=>({...state,budget:{...state.budget,[field]:value}})).catch(()=>{});
  const setCost=set('cost'),setPrice=set('price'),setArea=set('area'),setDiscount=set('discount');
  const result = calculateBudget(cost, price, area, discount, invoicePercent);
  const rows = [
    ['CUSTOS', result.costs, '#BE1701'],
    ['VALOR FINAL DO CLIENTE', result.total, '#0002B8'],
    [`VALOR DA NOTA FISCAL (${invoicePercent}%)`, result.tax, '#905000'],
    ['TOTAL DO DESCONTO', result.reduction, '#905000'],
    ['VALOR DO LUCRO DA EMPRESA', result.profit, '#138600'],
  ] as const;
  return <>
    <Card><Field label="CUSTOS POR m²" placeholder="Ex: 10" keyboardType="decimal-pad" value={cost} onChangeText={setCost} /></Card>
    <Card><Field label="VALOR POR METRO" placeholder="Ex: 80" keyboardType="decimal-pad" value={price} onChangeText={setPrice} /></Card>
    <Card><Field label="METRAGEM (m²)" placeholder="Ex: 10" keyboardType="decimal-pad" value={area} onChangeText={setArea} /></Card>
    <Card>{rows.map(([label, value, color]) => <View key={label} style={ui.result}>
      <Text style={ui.label}>{label}</Text><Text style={[ui.value, { color }]}>{currency(value)}</Text>
    </View>)}</Card>
    <Card><Field label="DESCONTO %" placeholder="Ex: 10" keyboardType="decimal-pad" value={discount} onChangeText={setDiscount} /></Card>
    <Action title="Fazer Proposta" onPress={() => router.navigate('/proposta')} />
  </>;
}

export default function BudgetScreen() {
  const {change}=useConnection();
  return <Screen title="Orçamento" onReset={()=>void change(state=>({...state,budget:emptyBudget()})).catch(()=>{})}><BudgetForm /><SyncStatus /></Screen>;
}

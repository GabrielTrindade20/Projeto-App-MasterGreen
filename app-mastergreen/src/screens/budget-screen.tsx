import { router } from 'expo-router';
import { View } from 'react-native';
import { Action, Card, Field, Screen, Section, Text, ui } from '@/components/mastergreen-ui';
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
    [`VALOR DA NOTA FISCAL (${invoicePercent}%)`, result.tax, '#905000'],
    ['TOTAL DO DESCONTO', result.reduction, '#905000'],
    ['LUCRO ESTIMADO', result.profit, '#167341'],
  ] as const;
  return <>
    <View style={ui.hero}><Text style={ui.heroLabel}>Valor final do cliente</Text><Text style={ui.heroValue}>{currency(result.total)}</Text></View>
    <Card title="Cálculo rápido"><Field label="Preço por m² (R$)" placeholder="Ex: 80" keyboardType="decimal-pad" value={price} onChangeText={setPrice}/><Field label="Metragem (m²)" placeholder="Ex: 10" keyboardType="decimal-pad" value={area} onChangeText={setArea}/><Field label="Custo por m² (R$)" placeholder="Ex: 10" keyboardType="decimal-pad" value={cost} onChangeText={setCost}/><Field label="Desconto (%)" placeholder="Ex: 10" keyboardType="decimal-pad" value={discount} onChangeText={setDiscount}/></Card>
    <Section title="Detalhes do cálculo" summary="Custos, nota fiscal e lucro">{rows.map(([label, value, color]) => <View key={label} style={ui.result}><Text style={ui.muted}>{label}</Text><Text style={[ui.value,{color,fontSize:26}]}>{currency(value)}</Text></View>)}</Section>
  </>;
}

export default function BudgetScreen() {
  const {change}=useConnection();
  return <Screen title="Orçar" footer={<Action title="Fazer proposta" onPress={()=>router.navigate('/proposta')}/>} onReset={()=>void change(state=>({...state,budget:emptyBudget()})).catch(()=>{})}><SyncStatus/><BudgetForm /></Screen>;
}

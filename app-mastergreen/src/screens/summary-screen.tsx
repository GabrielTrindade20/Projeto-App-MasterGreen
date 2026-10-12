import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import { Action, Card, Screen, Section, Sheet, Text, colors, ui } from '@/components/mastergreen-ui';
import { PeriodPicker } from '@/components/period-picker';
import { useConnection } from '@/context/connection';
import { displayDate, presetPeriod } from '@/lib/consultation';
import { currency } from '@/lib/quotation';

export default function SummaryScreen(){
  const {local,refreshReport}=useConnection();const [period,setPeriod]=useState(()=>presetPeriod('month'));
  const [result,setResult]=useState({key:'',error:''}),[team,setTeam]=useState(false),[revision,setRevision]=useState(0);
  const key=`${period.from}/${period.to}/${revision}`,loading=result.key!==key,error=result.key===key?result.error:'';
  const report=local.reports?.[`${period.from}/${period.to}`];
  useEffect(()=>{let active=true;void refreshReport(period.from,period.to).then(()=>{if(active)setResult({key,error:''});},cause=>{if(active)setResult({key,error:cause.message});});return ()=>{active=false;};},[period.from,period.to,refreshReport,key]);
  const history=(source:string,status='')=>router.navigate({pathname:'/historico',params:{from:period.from,to:period.to,source,status,request:String(Date.now())}});
  const pending=local.queue.filter(row=>!row.sentAt&&row.payload.proposalDate>=period.from&&row.payload.proposalDate<=period.to);
  const chartMonths=report?.months.slice(-12)||[];
  const max=Math.max(1,...chartMonths.map(row=>row.totalCents));
  return <Screen title="Resumo"><PeriodPicker value={period} onChange={setPeriod} allowAll={false}/>
    <Text style={ui.muted}>{displayDate(period.from)} a {displayDate(period.to)}</Text>
    {!!error&&<Text accessibilityRole="alert" style={ui.message}>{error}</Text>}
    {!report?<Card><Text style={ui.label}>{loading?'Buscando os indicadores…':'Este período ainda não foi baixado.'}</Text><Text style={ui.muted}>Conecte-se para consultar. Nunca substituímos estes valores pelos de outro período.</Text></Card>:<>
      <Pressable accessibilityRole="button" accessibilityLabel="Ver vendas aprovadas no histórico" onPress={()=>history('web','approved')} style={ui.hero}><Text style={ui.heroLabel}>Vendas aprovadas · Web</Text><Text style={ui.heroValue}>{currency(report.approvedCents/100)}</Text><Text style={ui.heroLabel}>{report.approvedCount} propostas aprovadas ›</Text><Text style={ui.heroLabel}>{report.previous.changePercent===null?'Sem comparação anterior':`${report.previous.changePercent>0?'+':''}${report.previous.changePercent}% em relação ao período anterior`}</Text></Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel="Ver propostas do app no histórico" onPress={()=>history('mobile')} style={ui.card}><Text style={ui.heading}>Propostas do app</Text><Text style={ui.value}>{currency(report.quick.totalCents/100)}</Text><Text style={ui.muted}>{report.quick.count} enviadas ao sistema · não são vendas aprovadas ›</Text>{pending.length>0&&<Text style={ui.label}>Mais {pending.length} no celular aguardando envio: {currency(pending.reduce((sum,row)=>sum+row.payload.totalCents,0)/100)}</Text>}</Pressable>
      <Card><Text style={ui.label}>Valor médio por venda aprovada</Text><Text style={ui.value}>{currency(report.averageCents/100)}</Text></Card>
      <Section title="Evolução mensal" summary={`${report.months.length} meses no período`} initiallyOpen={report.months.length<=12}>
        {report.months.length>12&&<Text style={ui.muted}>Últimos 12 meses do intervalo. Os totais acima consideram todo o período selecionado.</Text>}
        {chartMonths.map(row=><View key={row.month} style={{gap:8}}><Text style={ui.label}>{row.month.split('-').reverse().join('/')} · {currency(row.totalCents/100)}</Text><View accessible={false} style={{height:14,backgroundColor:colors.tint,borderRadius:7}}><View style={{height:14,width:`${row.totalCents/max*100}%`,backgroundColor:'#167341',borderRadius:7}}/></View></View>)}
      </Section>
      <Action secondary title="Ver desempenho da equipe" onPress={()=>setTeam(true)}/>
      <Section title="Custos e lucro registrados" summary={`${report.financial.covered} de ${report.financial.total} aprovadas com custos`}>
        <Text style={ui.muted}>Somente propostas com custos registrados. Não representa o lucro total da empresa nem confirma que todos os custos foram lançados.</Text>
        <Text style={ui.label}>Custos: {report.financial.costsCents===null?'Não disponíveis':currency(report.financial.costsCents/100)}</Text><Text style={ui.label}>Lucro líquido registrado: {report.financial.profitCents===null?'Não disponível':currency(report.financial.profitCents/100)}</Text>
      </Section>
      <Section title="Como ler estes números" summary="Fontes, datas e comparação"><Text style={ui.muted}>Vendas aprovadas não são caixa recebido. A data é a criação da proposta original no horário de Brasília. Os valores usam a versão calculada pelo administrador quando existente, contando cada proposta uma só vez.</Text><Text style={ui.muted}>Comparação: {displayDate(report.previous.from)} a {displayDate(report.previous.to)}, com a mesma quantidade de dias. Propostas do app usam a data preenchida no documento e não incluem custos.</Text></Section>
      <Text style={ui.muted}>Resumo salvo em {new Date(report.updatedAt).toLocaleString('pt-BR')}</Text>
    </>}
    <Action secondary title={loading?'Atualizando resumo…':'Atualizar resumo'} disabled={loading} onPress={()=>setRevision(value=>value+1)}/>
    <Sheet title="Desempenho da equipe" visible={team} onClose={()=>setTeam(false)}><Text style={ui.muted}>Vendas aprovadas por responsável. Comissões estimadas pela taxa atual do cadastro; não são pagamentos nem registros históricos de comissão.</Text>{!report?.team.length&&<Text style={ui.label}>Nenhuma venda aprovada neste período.</Text>}{report?.team.map(row=><View key={row.id} style={ui.listRow}><Text style={ui.heading}>{row.name}</Text><Text style={ui.value}>{currency(row.totalCents/100)}</Text><Text style={ui.muted}>{row.count} aprovadas</Text><Text style={ui.label}>Comissão estimada: {row.commissionCents===null?'Não disponível':currency(row.commissionCents/100)}</Text></View>)}</Sheet>
  </Screen>;
}

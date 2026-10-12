import { useState } from 'react';
import { router } from 'expo-router';
import { Action, Card, Field, Screen, Text, ui } from '@/components/mastergreen-ui';
import { useConnection } from '@/context/connection';
import { historyWithLocal, localDate } from '@/lib/mobile-state';
import { currency } from '@/lib/quotation';

export function SyncStatus() {
  const {local,needsLogin,syncing,error}=useConnection();
  const pending=local.queue.filter(row=>!row.sentAt).length;
  return <Card><Text style={ui.label}>{syncing?'Sincronizando…':pending?pending+' proposta(s) aguardando envio':'Nenhuma proposta pendente'}</Text>
    <Text style={ui.label}>{local.lastSync?'Última atualização: '+new Date(local.lastSync).toLocaleString('pt-BR'):'Dados do sistema ainda não atualizados.'}</Text>
    {!!error&&<Text style={ui.message}>{error}</Text>}
    {needsLogin&&<Action title="Renovar login" onPress={()=>router.navigate('/configuracoes')} />}
  </Card>;
}
export function CustomersScreen(){
  const {local}=useConnection();const [search,setSearch]=useState('');const [limit,setLimit]=useState(30);
  const rows=(local.data?.customers||[]).filter(row=>(row.name+' '+row.phone+' '+(row.document||'')).toLocaleLowerCase().includes(search.toLocaleLowerCase()));
  return <Screen title="Clientes"><SyncStatus /><Card><Field label="Buscar cliente" placeholder="Nome, telefone ou documento" value={search} onChangeText={value=>{setSearch(value);setLimit(30);}} /></Card>
    {!rows.length&&<Card><Text style={ui.label}>Nenhum cliente encontrado nos dados salvos.</Text></Card>}
    {rows.slice(0,limit).map(row=><Card key={row.id} title={row.name}><Text style={ui.label}>{row.phone||'Telefone não informado'}</Text>
      {!!row.document&&<Text style={ui.label}>{row.document}</Text>}
      {!!(row.address||row.city)&&<Text style={ui.label}>{[row.address,row.city,row.state].filter(Boolean).join(' · ')}</Text>}
    </Card>)}
    {rows.length>limit&&<Action title="Mostrar mais clientes" onPress={()=>setLimit(value=>value+30)} />}
  </Screen>;
}
export function HistoryScreen(){
  const {local}=useConnection();const [search,setSearch]=useState('');const [limit,setLimit]=useState(30);
  const rows=historyWithLocal(local).filter(row=>row.customer.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()));
  const status:Record<string,string>={pending:'Pendente',approved:'Aprovada',rejected:'Rejeitada',cancelled:'Cancelada'};
  return <Screen title="Histórico"><SyncStatus /><Card><Field label="Buscar no histórico" value={search} onChangeText={value=>{setSearch(value);setLimit(30);}} /><Text style={ui.label}>Consulta de valores e informações gerais. Sem edição ou exclusão.</Text></Card>
    {!rows.length&&<Card><Text style={ui.label}>Ainda não há propostas salvas.</Text></Card>}
    {rows.slice(0,limit).map(row=><Card key={row.source+row.id} title={row.customer.name}><Text style={ui.value}>{currency(row.totalCents/100)}</Text>
      <Text style={ui.label}>{row.date.split('-').reverse().join('/')+' · '+(row.source==='mobile'?'Aplicativo':'Web')}</Text><Text style={ui.label}>{status[row.status]||row.status}</Text></Card>)}
    {rows.length>limit&&<Action title="Mostrar mais propostas" onPress={()=>setLimit(value=>value+30)} />}
  </Screen>;
}
export function SummaryScreen(){
  const {local}=useConnection();const month=localDate().slice(0,7);const summary=local.data?.summary;
  const rows=historyWithLocal(local).filter(row=>row.source==='mobile'&&row.date.startsWith(month));
  const pending=local.queue.filter(row=>!row.sentAt&&row.payload.proposalDate.startsWith(month)).length;
  return <Screen title="Resumo"><SyncStatus /><Card title={'Este mês · '+month.split('-').reverse().join('/')}>
    <Text style={ui.label}>Propostas rápidas do app</Text><Text style={ui.value}>{currency(rows.reduce((sum,row)=>sum+row.totalCents,0)/100)}</Text>
    <Text style={ui.label}>{rows.length} proposta(s), incluindo {pending} pendente(s) de envio.</Text><Text style={ui.label}>Valores propostos, não vendas aprovadas.</Text>
  </Card><Card title="Sistema web">
    {summary?.month===month?<><Text style={ui.label}>Propostas detalhadas aprovadas no mês</Text><Text style={ui.value}>{currency(summary.approvedRevenue)}</Text><Text style={ui.label}>{summary.approvedCount} proposta(s) aprovada(s)</Text></>:<Text style={ui.label}>Conecte-se para atualizar o resumo deste mês.</Text>}
    <Text style={ui.label}>Custos e lucro das propostas do app não são informados. Os relatórios completos continuam no sistema web.</Text>
  </Card></Screen>;
}

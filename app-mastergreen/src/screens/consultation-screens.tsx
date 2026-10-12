import { useMemo, useState } from 'react';
import { Linking, Pressable, SectionList, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useAppNavigation } from '@/context/navigation-feedback';
import { Action, Choice, Field, Screen, Sheet, Text, colors, ui } from '@/components/mastergreen-ui';
import { CustomerBrowser } from '@/components/customer-browser';
import { PeriodPicker } from '@/components/period-picker';
import { displayDate, filterHistory, historyStatus, presetPeriod } from '@/lib/consultation';
import { API_URL, useConnection } from '@/context/connection';
import { proposalWebUrl } from '@/lib/proposal-web-link';
import { historyWithLocal, type HistoryRow } from '@/lib/mobile-state';
import { currency, formatDate, safePdfName } from '@/lib/quotation';
import { exportProposal, getBannerUri } from '@/lib/export-proposal';
import { gerarHTML } from '@/lib/proposal-html';

export function SyncStatus() {
  const router=useAppNavigation();
  const {local,needsLogin,syncing,error,sync}=useConnection();const [open,setOpen]=useState(false);
  const pending=local.queue.filter(row=>!row.sentAt).length;
  return <><Pressable accessibilityRole="button" accessibilityLabel="Ver sincronização" onPress={()=>setOpen(true)} style={{padding:12,minHeight:48,backgroundColor:colors.tint,borderRadius:12}}><Text style={ui.muted}>{syncing?'↻ Sincronizando…':pending?`${pending} aguardando envio ›`:error?'Sincronização indisponível ›':local.lastSync?'✓ Atualizado · ver detalhes':'Aguardando primeira atualização ›'}</Text></Pressable>
    {needsLogin&&<Text accessibilityRole="alert" style={ui.message}>Renove o login em Configurações para sincronizar.</Text>}
    <Sheet title="Sincronização" visible={open} onClose={()=>setOpen(false)}><Text style={ui.label}>{pending} proposta(s) aguardando envio</Text><Text style={ui.muted}>{local.lastSync?'Última atualização: '+new Date(local.lastSync).toLocaleString('pt-BR'):'Dados do sistema ainda não baixados.'}</Text>{!!error&&<Text style={ui.message}>{error}</Text>}<Text style={ui.muted}>Seus rascunhos e propostas salvas ficam neste aparelho. Não desinstale antes de enviar as pendências.</Text><Action title={syncing?'Atualizando…':'Atualizar agora'} disabled={syncing||needsLogin} onPress={()=>void sync()}/><Action secondary title="Abrir configurações" onPress={()=>{setOpen(false);router.navigate('/configuracoes');}}/></Sheet></>;
}
export function CustomersScreen(){
  const router=useAppNavigation();
  return <Screen title="Clientes" scroll={false}><CustomerBrowser onSelected={()=>router.navigate('/proposta')}/></Screen>;
}
export function HistoryScreen(){
  const {local}=useConnection();const [search,setSearch]=useState(''),[period,setPeriod]=useState(()=>presetPeriod('month'));
  const [source,setSource]=useState(''),[status,setStatus]=useState(''),[sort,setSort]=useState('recent'),[filters,setFilters]=useState(false),[selected,setSelected]=useState<HistoryRow|null>(null);
  const params=useLocalSearchParams<{from?:string;to?:string;source?:string;status?:string;request?:string}>();
  const [appliedRequest,setAppliedRequest]=useState<string>();
  if(params.request&&params.request!==appliedRequest){setAppliedRequest(params.request);setPeriod({from:params.from||'',to:params.to||'',label:'Período do resumo'});setSource(params.source||'');setStatus(params.status||'');setSearch('');}
  const [sharing,setSharing]=useState<string|null>(null);const [shareError,setShareError]=useState('');
  const [openingWeb,setOpeningWeb]=useState(false);
  const webId=selected&&(selected.source==='web'||selected.id!==selected.clientId?selected.id:selected.serverId);
  async function openWeb(id:string){
    setShareError('');setOpeningWeb(true);
    try {
      await Linking.openURL(proposalWebUrl(process.env.EXPO_PUBLIC_WEB_URL || API_URL,id,__DEV__,selected?.source==='mobile'?'mobile':'web'));
    } catch(cause) {
      setShareError(cause instanceof Error?cause.message:'Não foi possível abrir o navegador.');
    } finally { setOpeningWeb(false); }
  }
  const rows=useMemo(()=>filterHistory(historyWithLocal(local),search,period,source,status,sort),[local,search,period,source,status,sort]);
  const sections=useMemo(()=>{const groups:{title:string;data:HistoryRow[]}[]=[];for(const row of rows){const title=sort==='value'?'Maior valor':row.date.slice(0,7).split('-').reverse().join('/');if(groups.at(-1)?.title!==title)groups.push({title,data:[]});groups.at(-1)!.data.push(row);}return groups;},[rows,sort]);
  async function shareSaved(clientId:string){
    const saved=local.queue.find(entry=>entry.payload.clientId===clientId);
    if(!saved?.document)return;
    setSharing(clientId);setShareError('');
    try{
      const draft=saved.document;
      const date=formatDate(new Date(draft.date+'T12:00:00'));
      const html=gerarHTML(draft.customer,draft.contact,draft.phone,draft.address,draft.document,date,
        saved.payload.freight,draft.items,saved.payload.totalCents/100,saved.payload.warranty,saved.payload.payment,
        await getBannerUri(),String(saved.payload.discountPercent),local.data?.company);
      await exportProposal(html,safePdfName(draft.contact||draft.customer,date),false);
    }catch(cause){setShareError(cause instanceof Error?cause.message:'Não foi possível compartilhar o PDF.');}
    finally{setSharing(null);}
  }
  return <Screen title="Histórico" scroll={false}><View style={{padding:16,gap:10}}>
    <Field label="Buscar no histórico" placeholder="Nome do cliente" value={search} onChangeText={setSearch}/><PeriodPicker value={period} onChange={setPeriod}/>
    <View style={ui.wrap}><Choice title={`Filtros${source||status?' ativos':''}`} selected={!!(source||status)} onPress={()=>setFilters(true)}/><Text style={[ui.muted,{alignSelf:'center'}]}>{rows.length} propostas{source?' · '+(source==='mobile'?'App':'Web'):''}{status?' · '+(historyStatus[status]||status):''}</Text></View>
  </View><SectionList sections={sections} initialNumToRender={12} keyExtractor={row=>row.source+row.id} keyboardShouldPersistTaps="handled" stickySectionHeadersEnabled
    renderSectionHeader={({section})=><Text style={[ui.label,{padding:12,backgroundColor:colors.tint}]}>{section.title}</Text>}
    renderItem={({item})=><Pressable accessibilityRole="button" accessibilityLabel={'Ver proposta de '+item.customer.name} style={ui.listRow} onPress={()=>{setSelected(item);setShareError('');}}><Text style={ui.label}>{item.customer.name}</Text><Text style={[ui.value,{fontSize:26}]}>{currency(item.totalCents/100)}</Text><Text style={ui.muted}>{displayDate(item.date)} · {item.source==='mobile'?'App':'Web'} · {historyStatus[item.status]||item.status}</Text></Pressable>}
    ListEmptyComponent={<Text style={[ui.muted,{padding:20}]}>Nenhuma proposta neste período. Experimente “Todo o histórico” ou limpe os filtros.</Text>} contentContainerStyle={{paddingBottom:24}}/>
    <Sheet title="Filtros do histórico" visible={filters} onClose={()=>setFilters(false)}><Text style={ui.heading}>Origem</Text><View style={ui.wrap}>{[['','Todas'],['mobile','App'],['web','Web']].map(([value,label])=><Choice key={value} title={label} selected={source===value} onPress={()=>{setSource(value);setStatus('');}}/>)}</View><Text style={ui.heading}>Situação</Text><View style={ui.wrap}>{[['','Todas'],...(source!=='mobile'?[['approved','Aprovada'],['pending','Pendente'],['rejected','Rejeitada'],['cancelled','Cancelada']]:[]),...(source!=='web'?[['Enviada','Enviada ao sistema'],['Aguardando envio','Aguardando envio'],['Requer atenção','Requer atenção']]:[])].map(([value,label])=><Choice key={value} title={label} selected={status===value} onPress={()=>setStatus(value)}/>)}</View><Text style={ui.muted}>Enviada ao sistema não significa venda aprovada.</Text><Text style={ui.heading}>Ordenação</Text>{[['recent','Mais recentes'],['old','Mais antigas'],['value','Maior valor']].map(([value,label])=><Choice key={value} title={label} selected={sort===value} onPress={()=>setSort(value)}/>)}<Action title="Ver resultados" onPress={()=>setFilters(false)}/><Action secondary title="Limpar todos os filtros" onPress={()=>{setSource('');setStatus('');setSearch('');setSort('recent');setPeriod(presetPeriod('all'));setFilters(false);}}/></Sheet>
    <Sheet title="Proposta" visible={!!selected} onClose={()=>setSelected(null)}>{selected&&<>
      <Text style={ui.heading}>{selected.customer.name}</Text>
      <Text style={ui.value}>{currency(selected.totalCents/100)}</Text>
      <Text style={ui.muted}>{displayDate(selected.date)} · {selected.source==='mobile'?'Aplicativo':'Web'}</Text>
      <Text style={ui.label}>{historyStatus[selected.status]||selected.status}</Text>
      {selected.clientId&&local.queue.some(entry=>entry.payload.clientId===selected.clientId&&entry.document)?
        <><Action title={sharing?'Preparando PDF…':'Compartilhar cópia original'} secondary={!!webId} disabled={!!sharing} onPress={()=>void shareSaved(selected.clientId!)}/>
        <Text style={ui.muted}>Cópia original criada neste celular. Não inclui alterações feitas depois no web.</Text></>:
        selected.source!=='web'&&<Text style={ui.muted}>O documento PDF desta proposta não está salvo neste aparelho.</Text>}
      {!!webId&&<>
        <Action title={openingWeb?'Abrindo…':selected.source==='mobile'?'Ver versão atual no web':'Abrir no sistema web'} disabled={openingWeb} onPress={()=>void openWeb(webId)}/>
        <Text style={ui.muted}>Veja a versão atual e gere o PDF no navegador. Requer conexão com o sistema e pode pedir seu login.</Text>
      </>}
      <Text style={ui.muted}>Histórico somente para consulta, sem edição ou exclusão.</Text>
      {!!shareError&&<Text accessibilityRole="alert" style={ui.message}>{shareError}</Text>}
    </>}</Sheet>
  </Screen>;
}
export { default as SummaryScreen } from './summary-screen';

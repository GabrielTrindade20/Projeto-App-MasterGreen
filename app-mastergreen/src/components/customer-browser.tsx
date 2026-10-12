import { useMemo, useState } from 'react';
import { Modal, Pressable, SectionList, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Action, Choice, Field, Sheet, Text, colors, ui } from './mastergreen-ui';
import { useConnection } from '@/context/connection';
import { applyCustomer, filterCustomers, normalize, type Customer } from '@/lib/consultation';

export function CustomerBrowser({onSelected}:{onSelected:()=>void}) {
  const {local,change}=useConnection();
  const [search,setSearch]=useState(''),[city,setCity]=useState(''),[descending,setDescending]=useState(false),[filters,setFilters]=useState(false);
  const [selected,setSelected]=useState<Customer|null>(null),[confirm,setConfirm]=useState(false),[error,setError]=useState('');
  const customers=useMemo(()=>local.data?.customers||[],[local.data?.customers]);
  const rows=useMemo(()=>filterCustomers(customers,search,city,descending),[customers,search,city,descending]);
  const sections=useMemo(()=>{const result:{title:string;data:Customer[]}[]=[];for(const row of rows){const title=normalize(row.name)[0]?.toUpperCase()||'#';if(result.at(-1)?.title!==title)result.push({title,data:[]});result.at(-1)!.data.push(row);}return result;},[rows]);
  async function selectCustomer(force=false) {
    if(!selected)return;
    const replacement=applyCustomer(local.proposal,selected);
    const fields=['customer','contact','phone','document','address'] as const;
    if(!force&&fields.some(key=>local.proposal[key].trim()&&local.proposal[key]!==replacement[key])){setConfirm(true);return;}
    try{await change(state=>({...state,proposal:applyCustomer(state.proposal,selected)}));setSelected(null);setConfirm(false);onSelected();}catch{setError('Não foi possível guardar. Tente novamente antes de sair.');}
  }
  return <View style={{flex:1}}><View style={{padding:16,gap:10}}>
    <Field label="Buscar cliente" placeholder="Nome, telefone ou documento" value={search} onChangeText={setSearch}/>
    <View style={ui.wrap}><Choice title={city||'Todas as cidades'} selected={!!city} onPress={()=>setFilters(true)}/><Choice title={descending?'Z–A':'A–Z'} selected={descending} onPress={()=>setDescending(value=>!value)}/></View>
    <Text style={ui.muted}>{rows.length} clientes encontrados</Text>
  </View><SectionList sections={sections} keyExtractor={row=>row.id} keyboardShouldPersistTaps="handled" initialNumToRender={15} stickySectionHeadersEnabled
    renderSectionHeader={({section})=><Text accessibilityRole="header" style={[ui.label,{backgroundColor:colors.tint,paddingHorizontal:18,paddingVertical:8}]}>{section.title}</Text>}
    renderItem={({item})=><Pressable accessibilityRole="button" accessibilityLabel={'Ver cliente '+item.name} style={ui.listRow} onPress={()=>{setSelected(item);setConfirm(false);setError('');}}><Text style={ui.label}>{item.name}</Text><Text style={ui.muted}>{[item.phone,item.city].filter(Boolean).join(' · ')||'Ver informações'}</Text></Pressable>}
    ListEmptyComponent={<Text style={[ui.muted,{padding:20}]}>{local.data?'Nenhum cliente com estes filtros.':'Conecte-se para baixar os clientes. O cadastro manual continua disponível na proposta.'}</Text>} contentContainerStyle={{paddingBottom:24}}/>
    <Sheet title="Filtrar por cidade" visible={filters} onClose={()=>setFilters(false)}><Choice title="Todas as cidades" selected={!city} onPress={()=>{setCity('');setFilters(false);}}/>{Array.from(new Set(customers.map(row=>row.city).filter(Boolean))).sort().map(value=><Choice key={value} title={value!} selected={city===value} onPress={()=>{setCity(value!);setFilters(false);}}/>)}</Sheet>
    <Sheet title="Cliente" visible={!!selected} onClose={()=>setSelected(null)}>{selected&&<><Text style={ui.heading}>{selected.name}</Text><Text style={ui.label}>{selected.phone||'Sem telefone'}</Text>{[selected.document,selected.email,selected.address,[selected.city,selected.state].filter(Boolean).join(' / ')].filter(Boolean).map((value,index)=><Text key={index} style={ui.muted}>{value}</Text>)}
      {!!error&&<Text style={ui.message}>{error}</Text>}{confirm?<><Text style={ui.label}>Substituir os dados de {local.proposal.customer}? Seus itens serão mantidos.</Text><Action title="Sim, usar este cliente" onPress={()=>void selectCustomer(true)}/><Action secondary title="Cancelar" onPress={()=>setConfirm(false)}/></>:<Action title="Usar na proposta" onPress={()=>void selectCustomer()}/>}</>}
    </Sheet></View>;
}
export function CustomerPicker({visible,onClose}:{visible:boolean;onClose:()=>void}) {
  return <Modal visible={visible} onRequestClose={onClose} animationType="fade"><SafeAreaView style={{flex:1,backgroundColor:colors.background}}><View style={{padding:16}}><Action secondary title="Voltar à proposta" onPress={onClose}/></View><CustomerBrowser onSelected={onClose}/></SafeAreaView></Modal>;
}

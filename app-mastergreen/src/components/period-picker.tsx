import { useState } from 'react';
import { View } from 'react-native';
import { Action, Choice, Field, Sheet, Text, ui } from './mastergreen-ui';
import { displayDate, monthPeriod, parseDateInput, presetPeriod, type Period } from '@/lib/consultation';

export function PeriodPicker({value,onChange,allowAll=true}:{value:Period;onChange:(value:Period)=>void;allowAll?:boolean}) {
  const [open,setOpen]=useState(false),[year,setYear]=useState(String(new Date().getFullYear())),[month,setMonth]=useState(String(new Date().getMonth()+1));
  const [from,setFrom]=useState(''),[to,setTo]=useState(''),[error,setError]=useState('');
  const select=(period:Period)=>{onChange(period);setOpen(false);setError('');};
  return <><Action secondary title={'Período: '+value.label} onPress={()=>{setFrom(displayDate(value.from));setTo(displayDate(value.to));setError('');setOpen(true);}}/>
    <Sheet title="Escolher período" visible={open} onClose={()=>setOpen(false)}>
      <View style={ui.wrap}>{(['month','previous','year',...(allowAll?['all']:[])] as ('month'|'previous'|'year'|'all')[]).map(key=><Choice key={key} title={presetPeriod(key).label} selected={value.label===presetPeriod(key).label} onPress={()=>select(presetPeriod(key))}/>)}</View>
      <Text style={ui.heading}>Mês e ano</Text>
      <Field label="Mês (1 a 12)" keyboardType="number-pad" value={month} onChangeText={setMonth}/><Field label="Ano" keyboardType="number-pad" value={year} onChangeText={setYear}/>
      <Action secondary title="Aplicar mês" onPress={()=>{if(!/^\d{1,2}$/.test(month)||+month<1||+month>12||!/^\d{4}$/.test(year)||+year<2000||+year>2100){setError('Informe mês de 1 a 12 e ano de 2000 a 2100.');return;}select(monthPeriod(+year,+month));}}/>
      <Text style={ui.heading}>Intervalo de datas</Text><Field label="De (DD/MM/AAAA)" placeholder="01/10/2026" value={from} onChangeText={setFrom} keyboardType="numbers-and-punctuation"/><Field label="Até (DD/MM/AAAA)" placeholder="31/10/2026" value={to} onChangeText={setTo} keyboardType="numbers-and-punctuation"/>
      {!!error&&<Text accessibilityRole="alert" style={ui.message}>{error}</Text>}
      <Action title="Aplicar intervalo" onPress={()=>{const start=parseDateInput(from),end=parseDateInput(to);if(!start||!end||start>end){setError('Confira as datas. O início deve ser anterior ou igual ao fim.');return;}select({from:start,to:end,label:`${from} a ${to}`});}}/>
    </Sheet></>;
}

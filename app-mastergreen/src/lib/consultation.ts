import type { HistoryRow, MobileData, ProposalDraft } from './mobile-state';

export type Period = { from: string; to: string; label: string };
export type Customer = MobileData['customers'][number];
export const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR').trim();
export const displayDate = (value: string) => value.split('-').reverse().join('/');
const iso = (date: Date) => date.toISOString().slice(0,10);
export function monthPeriod(year: number, month: number): Period {
  return {from:iso(new Date(Date.UTC(year,month-1,1))),to:iso(new Date(Date.UTC(year,month,0))),label:`${String(month).padStart(2,'0')}/${year}`};
}
export function presetPeriod(name: 'month'|'previous'|'year'|'all', now = new Date()): Period {
  const year=now.getFullYear(),month=now.getMonth()+1;
  if(name==='all')return {from:'',to:'',label:'Todo o histórico'};
  if(name==='year')return {from:`${year}-01-01`,to:`${year}-12-31`,label:'Este ano'};
  const result=name==='month'?monthPeriod(year,month):monthPeriod(month===1?year-1:year,month===1?12:month-1);
  return {...result,label:name==='month'?'Este mês':'Mês passado'};
}
export function parseDateInput(value:string) {
  const parts=value.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if(!parts)return null;
  const result=`${parts[3]}-${parts[2]}-${parts[1]}`;
  const time=new Date(result+'T12:00:00Z');
  return Number.isFinite(time.getTime())&&iso(time)===result&&+parts[3]>=2000&&+parts[3]<=2100?result:null;
}
export function filterCustomers(rows: Customer[], query: string, city='', descending=false) {
  const term=normalize(query),digits=query.replace(/\D/g,'');
  return rows.filter(row=>(!city||row.city===city)&&(!term||normalize(row.name).includes(term)||(digits.length>0&&[row.phone,row.document||''].some(value=>value.replace(/\D/g,'').includes(digits)))))
    .sort((a,b)=>(descending?-1:1)*a.name.localeCompare(b.name,'pt-BR'));
}
export function applyCustomer(draft:ProposalDraft, customer:Customer):ProposalDraft {
  return {...draft,customerId:customer.id,customer:customer.name,contact:'',phone:customer.phone||'',document:customer.document||'',address:[[customer.address,customer.number].filter(Boolean).join(', '),customer.neighborhood,customer.city,customer.state,customer.zipCode].filter(Boolean).join(' · ')};
}
export const historyStatus:Record<string,string>={pending:'Pendente',approved:'Aprovada',rejected:'Rejeitada',cancelled:'Cancelada',Enviada:'Enviada ao sistema'};
export function filterHistory(rows:HistoryRow[], query:string, period:Period, source='',status='',sort='recent') {
  return rows.filter(row=>normalize(row.customer.name).includes(normalize(query))&&(!period.from||row.date>=period.from)&&(!period.to||row.date<=period.to)&&(!source||row.source===source)&&(!status||row.status===status))
    .sort((a,b)=>sort==='value'?b.totalCents-a.totalCents:sort==='old'?a.date.localeCompare(b.date):b.date.localeCompare(a.date));
}

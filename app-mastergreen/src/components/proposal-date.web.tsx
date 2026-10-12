import { Field } from './mastergreen-ui';
import { formatDate } from '@/lib/quotation';
import { useState } from 'react';

export default function ProposalDate({ value, onChange }: { value: Date; onChange: (date: Date) => void }) {
  const formatted=formatDate(value);
  const [edit,setEdit]=useState<{source:string;text:string}|null>(null);
  const text=edit?.source===formatted?edit.text:formatted;
  const setText=(text:string)=>setEdit({source:formatted,text});
  return <Field label="Data da proposta (DD/MM/AAAA)" value={text} onChangeText={setText} onBlur={() => {
    const [day, month, year] = text.split('/').map(Number);
    const parsed = new Date(year, month - 1, day);
    if (year >= 1900 && parsed.getFullYear() === year && parsed.getMonth() === month - 1 && parsed.getDate() === day) {
      onChange(parsed);
    } else setText(formatDate(value));
  }} />;
}

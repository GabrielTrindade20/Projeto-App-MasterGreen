import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform } from 'react-native';
import { Action } from './mastergreen-ui';
import { formatDate } from '@/lib/quotation';

export default function ProposalDate({ value, onChange }: { value: Date; onChange: (date: Date) => void }) {
  const [open, setOpen] = useState(false);
  return <>
    <Action title={`Data: ${formatDate(value)}`} onPress={() => setOpen(!open)} />
    {open && <DateTimePicker value={value} mode="date" display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
      onChange={(event, date) => {
        setOpen(Platform.OS === 'ios');
        if (event.type === 'set' && date) onChange(date);
      }} />}
  </>;
}

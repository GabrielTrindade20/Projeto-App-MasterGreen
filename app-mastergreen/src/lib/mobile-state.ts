import type { ProposalItem } from './quotation';

export type Session = { token: string; expiresAt: string; user: { id: string; name: string; email: string } };
export type QuickProposal = {
  clientId: string;
  customer: { name: string; contact: string; phone: string; document: string; address: string };
  proposalDate: string; freight: string; warranty: string; payment: string; discountPercent: number; totalCents: number;
};
export type QueueEntry = { payload: QuickProposal; savedAt: string; document?: ProposalDraft; sentAt?: string; serverId?: string; error?: string };
export type ProposalDraft = { customer: string; contact: string; phone: string; address: string; document: string; date: string; freight: string; warranty: string; unit: string; entry: string; discount: string; items: ProposalItem[] };
export type BudgetDraft = { cost: string; price: string; area: string; discount: string };
export type HistoryRow = { id: string; clientId?: string; customer: { name: string }; date: string; totalCents: number; source: string; status: string };
export type MobileData = {
  customers: { id: string; name: string; phone: string; email?: string; document?: string; address?: string; city?: string; state?: string }[];
  products?: { id: string; name: string; category: string | null; description: string | null; pricePerM2: string }[];
  history: HistoryRow[];
  summary: { month: string; quickCount: number; quickTotalCents: number; approvedCount: number; approvedRevenue: number };
  updatedAt: string;
};
export type LocalState = {
  version: 1; budget: BudgetDraft; proposal: ProposalDraft; queue: QueueEntry[]; data: MobileData | null;
  preferences: { mobileData: boolean; fontScale: number; highContrast: boolean };
  lastSync: string | null; lastFinalized: { signature: string; clientId: string } | null;
  reports?: Record<string, MobileReport>;
};
export type MobileReport = {
  from:string;to:string;approvedCount:number;approvedCents:number;averageCents:number;
  quick:{count:number;totalCents:number};
  previous:{from:string;to:string;approvedCents:number;changePercent:number|null};
  financial:{covered:number;total:number;costsCents:number|null;profitCents:number|null};
  months:{month:string;totalCents:number}[];
  team:{id:string;name:string;count:number;totalCents:number;commissionCents:number|null}[];
  updatedAt:string;
};
export const localDate = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
export const emptyProposal = (): ProposalDraft => ({ customer:'',contact:'',phone:'',address:'',document:'',date:localDate(),freight:'',warranty:'',unit:'meses',entry:'',discount:'',items:[] });
export const emptyBudget = (): BudgetDraft => ({ cost:'',price:'',area:'',discount:'' });
export const initialState = (): LocalState => ({ version:1,budget:emptyBudget(),proposal:emptyProposal(),queue:[],data:null,preferences:{mobileData:false,fontScale:1,highContrast:false},lastSync:null,lastFinalized:null });
export function parseStoredState(raw: string | null): LocalState {
  if (!raw) return initialState();
  const state = JSON.parse(raw);
  if (state.version !== 1 || !state.budget || !Array.isArray(state.proposal?.items) || !Array.isArray(state.queue) || !state.preferences) throw new Error('Não foi possível ler os dados locais. Não reinstale o app; procure suporte.');
  return state;
}
export function sessionValid(session: Session | null, now = Date.now()) { return !!session && new Date(session.expiresAt).getTime() > now; }
export function addToQueue(state: LocalState, payload: QuickProposal, signature: string, document?: ProposalDraft): LocalState {
  if (state.queue.some(item => item.payload.clientId === payload.clientId)) {
    return {...state,queue:state.queue.map(item=>item.payload.clientId===payload.clientId&&document&&!item.document?{...item,document}:item),lastFinalized:{signature,clientId:payload.clientId}};
  }
  return { ...state, queue:[...state.queue,{payload,savedAt:new Date().toISOString(),document}],lastFinalized:{signature,clientId:payload.clientId} };
}
export function historyWithLocal(state: LocalState): HistoryRow[] {
  const remote = state.data?.history || [];
  const ids = new Set(remote.map(row => row.clientId));
  return [...remote,...state.queue.filter(row => !ids.has(row.payload.clientId)).map(row => ({
    id:row.payload.clientId,clientId:row.payload.clientId,customer:row.payload.customer,date:row.payload.proposalDate,
    totalCents:row.payload.totalCents,source:'mobile',status:row.sentAt?'Enviada':row.error?'Requer atenção':'Aguardando envio',
  }))].sort((a,b)=>b.date.localeCompare(a.date));
}

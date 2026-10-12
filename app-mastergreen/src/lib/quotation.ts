export type ProposalItem = { id: number; productId?: string; metragem: string; valorPorMetro: string; descricao: string; unit?: string; costReference?: string };
export type MobileProposalItem = {productId:string|null;name:string;quantity:number;unitPrice:number;unit:'m²'|'un'|'m'|'serviço'};
export function proposalItems(document?: {items:ProposalItem[]}): MobileProposalItem[]|undefined {
  if(!document?.items.length || document.items.length>100) return undefined;
  const items=document.items.map(item=>({productId:item.productId||null,name:item.descricao.trim(),quantity:numberFromInput(item.metragem),unitPrice:numberFromInput(item.valorPorMetro),unit:(item.unit||'m²') as MobileProposalItem['unit']}));
  return items.every(item=>item.name.length>0&&item.name.length<=500&&item.quantity>0&&item.quantity<=10_000_000&&item.unitPrice>0&&item.unitPrice<=10_000_000&&['m²','un','m','serviço'].includes(item.unit))?items:undefined;
}

export function numberFromInput(value: string | number): number {
  const normalized = String(value).trim().replace(/\s/g, '');
  if (!normalized) return 0;
  const number = Number(normalized.includes(',') ? normalized.replace(/\./g, '').replace(',', '.') : normalized);
  return Number.isFinite(number) ? number : 0;
}

export function percentFromInput(value: string) {
  return Math.min(100, Math.max(0, numberFromInput(value)));
}

const cents = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;
export const currency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export function calculateBudget(cost: string, price: string, area: string, discount: string, invoicePercent = 4.5) {
  const gross = Math.max(0, numberFromInput(price)) * Math.max(0, numberFromInput(area));
  const costs = cents(Math.max(0, numberFromInput(cost)) * Math.max(0, numberFromInput(area)));
  // Regra do aplicativo original: estimativa de 4,5% sobre o bruto, antes do desconto.
  const tax = cents(gross * Math.max(0, invoicePercent) / 100);
  const reduction = cents(gross * percentFromInput(discount) / 100);
  const total = cents(gross - reduction);
  return { costs, tax, reduction, total, profit: cents(total - costs - tax) };
}

export function proposalTotal(items: ProposalItem[], discount: string) {
  const gross = items.reduce((sum, item) => sum + cents(numberFromInput(item.metragem) * numberFromInput(item.valorPorMetro)), 0);
  return cents(gross * (1 - percentFromInput(discount) / 100));
}

export function escapeHtml(value: string | number) {
  return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!);
}

export function formatDate(date: Date) {
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
}

export function safePdfName(name: string, date: string) {
  const clean = name.replace(/[<>:"/\\|?*\u0000-\u001f]/g, '').trim().slice(0, 70) || 'Cliente';
  return `Proposta - ${clean} ${date.replace(/\//g, '-')}.pdf`;
}

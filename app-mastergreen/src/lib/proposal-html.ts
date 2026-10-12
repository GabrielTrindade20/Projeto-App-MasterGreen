import { currency, escapeHtml, numberFromInput, type ProposalItem } from './quotation';
import { defaultCompany, type CompanyProfile } from './company-profile';

export const gerarHTML = (cliente:string,ac:string,telefone:string,endereco:string,tipoPessoa:string,dataProposta:string,frete:string,items:ProposalItem[],total:number,garantia:string,pagamento:string,logoUri:string,desconto:string,company:CompanyProfile=defaultCompany) => {
  const e=escapeHtml;
  const detail=(label:string,value:string)=>value?`<p><span class="label">${e(label)}</span>${e(value)}</p>`:'';
  const rows=items.map((item,index)=>`<tr><td><small>${String(index+1).padStart(2,'0')}</small> ${e(item.descricao)}</td><td>${e(item.metragem)} ${e(item.unit||'m²')}</td><td>${currency(numberFromInput(item.valorPorMetro))}</td><td>${currency(Math.round(numberFromInput(item.metragem)*numberFromInput(item.valorPorMetro)*100)/100)}</td></tr>`).join('');
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Proposta · ${e(company.name)}</title>
  <style>
  @page{size:A4;margin:16mm 17mm}*{box-sizing:border-box}
  :root{--forest:#0f4e2f;--green:#217c47;--pale:#f1f7f3;--ink:#1d2f26}
  @supports(color:oklch(31% .065 158)){:root{--forest:oklch(31% .065 158);--green:oklch(46% .10 154);--pale:oklch(97% .01 155)}}
  body{font-family:Arial,Helvetica,sans-serif;color:var(--ink);font-size:12px;line-height:1.5;margin:0;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  header{border-top:5px solid var(--forest);padding-top:20px;margin-bottom:28px}
  .brand{display:flex;justify-content:space-between;gap:24px;align-items:center}
  .identity{display:flex;align-items:center;gap:12px;min-width:0;flex:1}.identity img{width:62px;height:62px;object-fit:contain}
  h1{font-size:30px;line-height:1.1;color:var(--forest);margin:0;overflow-wrap:anywhere}
  .meta{text-align:right;font-size:11px;flex:0 0 145px}.eyebrow{font-size:10px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase}
  .company{font-size:11px;margin-top:18px;overflow-wrap:anywhere}.company p{margin:3px 0}
  .customer{margin:0 0 26px;border-top:1px solid #d9e4dd;padding-top:18px}h2{font-size:22px;margin:4px 0 10px;overflow-wrap:anywhere}
  p{margin:5px 0;white-space:pre-wrap;overflow-wrap:anywhere}.label{font-weight:bold;margin-right:8px}
  table{border-collapse:collapse;width:100%;table-layout:fixed;margin:12px 0}
  th{background:var(--forest);color:white;padding:11px 9px;font-size:10px;text-align:left}
  td{padding:12px 9px;vertical-align:top;border-bottom:1px solid #d9e4dd;overflow-wrap:anywhere}
  th:first-child,td:first-child{width:47%}th:nth-child(2),td:nth-child(2){width:14%}th:nth-child(n+3),td:nth-child(n+3){width:19.5%;text-align:right}
  tbody tr:nth-child(odd){background:var(--pale)}small{color:#496855;font-size:10px;margin-right:5px}
  thead{display:table-header-group}tr{break-inside:avoid;page-break-inside:avoid}
  .total-wrap{display:flex;justify-content:space-between;align-items:center;gap:20px;margin:22px 0 28px;break-inside:avoid}
  .total{background:var(--forest);color:white;border-radius:6px;padding:15px 22px;min-width:260px}.total strong{display:block;font-size:29px;line-height:1.3}
  h3{font-size:11px;letter-spacing:1.3px;color:var(--forest);margin:20px 0 10px}section{margin-bottom:18px}
  .signature{margin-top:30px;padding-top:12px;border-top:1px solid #aec6b7;width:55%;break-inside:avoid}
  footer{border-top:3px solid var(--green);margin-top:32px;padding-top:12px;font-size:10px;color:#3d5949;break-inside:avoid}
  </style></head><body><header><div class="brand"><div class="identity">${logoUri?`<img src="${e(logoUri)}" alt="">`:''}<h1>${e(company.name)}</h1></div><div class="meta"><p class="eyebrow">Proposta comercial</p><p>${e(dataProposta)}</p></div></div><div class="company"><p><strong>${e(company.socialName)}</strong></p><p>${e([company.cnpj?'CNPJ '+company.cnpj:'',company.phone,company.email].filter(Boolean).join(' · '))}</p><p>${e(company.address)}</p></div></header>
  <section class="customer"><div class="eyebrow">Preparada para</div><h2>${e(cliente)}</h2>${detail('A/C',ac)}${detail('Telefone',telefone)}${detail('CPF / CNPJ',tipoPessoa)}${detail('Endereço',endereco)}</section>
  <table><thead><tr><th>DESCRIÇÃO</th><th>QTD.</th><th>UNITÁRIO</th><th>TOTAL</th></tr></thead><tbody>${rows}</tbody></table>
  <div class="total-wrap"><p>Desconto aplicado: <strong>${e(desconto)}%</strong></p><div class="total"><div class="eyebrow">Valor total</div><strong>${currency(total)}</strong></div></div>
  <section><h3>CONDIÇÕES DA PROPOSTA</h3>${detail('Garantia',garantia)}${detail('Pagamento',pagamento)}${detail('Frete',frete)}${detail('Tributos','Inclusos no preço')}${detail('Validade',company.validityDays+' dias a partir da data da proposta')}</section>
  <section><h3>DADOS PARA PAGAMENTO</h3>${detail('PIX',company.pixKey)}${detail('Beneficiário',company.pixBeneficiary)}</section>
  <div class="signature"><strong>${e(company.responsibleName)}</strong><p>${e(company.responsibleRole)}</p></div>
  <footer>${e([company.name,company.phone,company.email].filter(Boolean).join(' · '))}</footer></body></html>`;
};
export default {gerarHTML};

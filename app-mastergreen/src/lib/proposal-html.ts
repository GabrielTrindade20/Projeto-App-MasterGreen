import { currency, escapeHtml, numberFromInput, type ProposalItem } from './quotation';
import { defaultCompany, type CompanyProfile } from './company-profile';

export const gerarHTML = (cliente:string,ac:string,telefone:string,endereco:string,tipoPessoa:string,dataProposta:string,frete:string,items:ProposalItem[],total:number,garantia:string,pagamento:string,logoUri:string,desconto:string,company:CompanyProfile=defaultCompany) => {
  const e=escapeHtml;
  const detail=(label:string,value:string)=>value?`<p><span class="label">${e(label)}</span>${e(value)}</p>`:'';
  const companyLine=[company.cnpj?'CNPJ '+company.cnpj:'',company.phone,company.email,company.address].filter(Boolean).map(part=>`<span>${e(part)}</span>`).join('<span class="sep">·</span>');
  const rows=items.map((item,index)=>`<tr><td><small>${String(index+1).padStart(2,'0')}</small> ${e(item.descricao)}</td><td>${e(item.metragem)} ${e(item.unit||'m²')}</td><td>${currency(numberFromInput(item.valorPorMetro))}</td><td>${currency(Math.round(numberFromInput(item.metragem)*numberFromInput(item.valorPorMetro)*100)/100)}</td></tr>`).join('');
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Proposta · ${e(company.name)}</title>
  <style>
  @page{size:A4;margin:14mm 15mm}*{box-sizing:border-box}
  :root{--forest:#0f4e2f;--green:#217c47;--pale:#f1f7f3;--ink:#0f1a14;--strong:#1d2f26;--muted:#2d4538;--rule:#c7d6cd}
  body{font-family:Arial,Helvetica,sans-serif;color:var(--ink);font-size:15.5px;line-height:1.5;margin:0;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  header{border-top:6px solid var(--forest);padding-top:16px;margin-bottom:18px}
  .brand{display:flex;justify-content:space-between;gap:20px;align-items:center}
  .identity{display:flex;align-items:center;gap:14px;min-width:0;flex:1}.identity img{width:60px;height:60px;object-fit:contain}
  h1{font-size:30px;line-height:1.1;color:var(--forest);margin:0;overflow-wrap:anywhere;font-weight:800}
  .meta{text-align:right;font-size:14px;flex:0 0 auto}
  .meta .date{font-size:15px;margin-top:2px;color:var(--ink);font-weight:500}
  .eyebrow{font-size:12px;font-weight:800;letter-spacing:1.4px;text-transform:uppercase;color:var(--forest)}
  .company-line{font-size:13.5px;margin-top:10px;color:var(--strong);font-weight:500;display:flex;flex-wrap:wrap;gap:4px 10px}
  .company-line .sep{color:var(--muted);opacity:.55}
  .company-line .social{color:var(--ink);font-weight:700;width:100%;margin-bottom:2px;font-size:14px}
  .customer{margin:0 0 16px;border-top:1px solid var(--rule);padding-top:14px}
  .customer .eyebrow{margin-bottom:4px}
  h2{font-size:24px;margin:0 0 10px;overflow-wrap:anywhere;font-weight:700}
  .customer-grid{display:grid;grid-template-columns:1fr 1fr;column-gap:24px;row-gap:4px;font-size:15px;color:var(--ink);font-weight:500}
  .customer-grid p{margin:0;overflow-wrap:anywhere}
  .customer-grid .full{grid-column:1 / -1}
  p{margin:4px 0;white-space:pre-wrap;overflow-wrap:anywhere}
  .label{font-weight:700;color:var(--forest);margin-right:6px}
  table{border-collapse:collapse;width:100%;table-layout:fixed;margin:0 0 14px}
  th{background:var(--forest);color:#fff;padding:11px 10px;font-size:12.5px;letter-spacing:1px;text-align:left}
  td{padding:12px 10px;vertical-align:top;border-bottom:1px solid var(--rule);overflow-wrap:anywhere;font-size:15px;color:var(--ink);font-weight:500}
  th:first-child,td:first-child{width:48%}th:nth-child(2),td:nth-child(2){width:14%}th:nth-child(n+3),td:nth-child(n+3){width:19%;text-align:right}
  tbody tr:nth-child(odd){background:var(--pale)}
  td small{color:var(--forest);font-size:13px;margin-right:6px;font-weight:700}
  thead{display:table-header-group}tr{break-inside:avoid;page-break-inside:avoid}
  .total-wrap{display:flex;justify-content:space-between;align-items:center;gap:20px;margin:0 0 18px;break-inside:avoid}
  .total-wrap .discount{font-size:15px;color:var(--ink);font-weight:500}
  .total-wrap .discount strong{font-size:16px}
  .total{background:var(--forest);color:#fff;border-radius:8px;padding:14px 24px;min-width:240px;text-align:right}
  .total .eyebrow{color:#a8d4ba;font-size:11.5px}
  .total strong{display:block;font-size:30px;line-height:1.2;margin-top:2px}
  .two-cols{display:grid;grid-template-columns:1.2fr 1fr;gap:26px;margin-bottom:14px;break-inside:avoid}
  .two-cols h3{font-size:13px;letter-spacing:1.3px;color:var(--forest);margin:0 0 8px;font-weight:800}
  .two-cols p{margin:3px 0;font-size:15px;color:var(--ink);font-weight:500}
  .signature{margin-top:18px;padding-top:12px;border-top:1px solid #aec6b7;width:55%;break-inside:avoid}
  .signature strong{font-size:16px;color:var(--ink)}
  .signature p{margin:2px 0 0;font-size:14px;color:var(--strong);font-weight:500}
  footer{border-top:3px solid var(--green);margin-top:16px;padding-top:10px;font-size:13px;color:var(--strong);font-weight:500;text-align:center;break-inside:avoid}
  </style></head><body>
  <header>
    <div class="brand">
      <div class="identity">${logoUri?`<img src="${e(logoUri)}" alt="">`:''}<h1>${e(company.name)}</h1></div>
      <div class="meta"><div class="eyebrow">Proposta comercial</div><div class="date">${e(dataProposta)}</div></div>
    </div>
    <div class="company-line"><span class="social">${e(company.socialName)}</span>${companyLine}</div>
  </header>
  <section class="customer">
    <div class="eyebrow">Preparada para</div>
    <h2>${e(cliente)}</h2>
    <div class="customer-grid">
      ${ac?`<p><span class="label">A/C</span>${e(ac)}</p>`:''}
      ${telefone?`<p><span class="label">Telefone</span>${e(telefone)}</p>`:''}
      ${tipoPessoa?`<p><span class="label">CPF / CNPJ</span>${e(tipoPessoa)}</p>`:''}
      ${endereco?`<p class="full"><span class="label">Endereço</span>${e(endereco)}</p>`:''}
    </div>
  </section>
  <table><thead><tr><th>DESCRIÇÃO</th><th>QTD.</th><th>UNITÁRIO</th><th>TOTAL</th></tr></thead><tbody>${rows}</tbody></table>
  <div class="total-wrap">
    <div class="discount">Desconto aplicado: <strong>${e(desconto)}%</strong></div>
    <div class="total"><div class="eyebrow">Valor total</div><strong>${currency(total)}</strong></div>
  </div>
  <div class="two-cols">
    <div>
      <h3>CONDIÇÕES DA PROPOSTA</h3>
      ${detail('Garantia',garantia)}
      ${detail('Pagamento',pagamento)}
      ${detail('Frete',frete)}
      ${detail('Tributos','Inclusos no preço')}
      ${detail('Validade',company.validityDays+' dias a partir da data')}
    </div>
    <div>
      <h3>DADOS PARA PAGAMENTO</h3>
      ${detail('PIX',company.pixKey)}
      ${detail('Beneficiário',company.pixBeneficiary)}
    </div>
  </div>
  <div class="signature"><strong>${e(company.responsibleName)}</strong><p>${e(company.responsibleRole)}</p></div>
  <footer>${e([company.name,company.phone,company.email].filter(Boolean).join(' · '))}</footer>
  </body></html>`;
};
export default {gerarHTML};

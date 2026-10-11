const { test } = require('node:test');
const assert = require('node:assert/strict');
const { calculateBudget, numberFromInput, percentFromInput, proposalTotal, escapeHtml, safePdfName, formatDate } = require('../src/lib/quotation.ts');

test('aceita valores brasileiros, decimais e campo vazio', () => {
  assert.equal(numberFromInput('1.234,56'), 1234.56);
  assert.equal(numberFromInput('80,50'), 80.5);
  assert.equal(numberFromInput('80.50'), 80.5);
  assert.equal(numberFromInput(''), 0);
  assert.equal(numberFromInput('abc'), 0);
});
test('preserva a regra do legado: imposto sobre bruto, desconto e custo por m²', () => {
  assert.deepEqual(calculateBudget('10', '80', '10', '10'), { costs: 100, tax: 36, reduction: 80, total: 720, profit: 584 });
  assert.deepEqual(calculateBudget('10', '80', '', ''), { costs: 0, tax: 0, reduction: 0, total: 0, profit: 0 });
  assert.equal(calculateBudget('10,50', '80,50', '2,5', '5').total, 191.19);
  assert.equal(calculateBudget('10', '80', '10', '10', 5).tax, 40);
});
test('limita percentuais e não gera valores negativos para entradas inválidas', () => {
  assert.equal(percentFromInput('150'), 100);
  assert.equal(percentFromInput('-10'), 0);
  assert.equal(calculateBudget('10', '80', '-1', '0').total, 0);
});
test('soma vários itens e aplica desconto ao total; remoção recalcula', () => {
  const items = [{ id: 0, metragem: '2,5', valorPorMetro: '80,50', descricao: 'Grama' }, { id: 1, metragem: '2', valorPorMetro: '30', descricao: 'Piso' }];
  assert.equal(proposalTotal(items, '10'), 235.13);
  assert.equal(proposalTotal(items.slice(0, 1), '0'), 201.25);
  assert.equal(proposalTotal([], ''), 0);
});
test('texto do cliente é escapado no PDF e nome de arquivo não contém caminhos', () => {
  assert.equal(escapeHtml('<script>"A&B"</script>'), '&lt;script&gt;&quot;A&amp;B&quot;&lt;/script&gt;');
  assert.equal(safePdfName('AC/Empresa: Norte', '11/10/2026'), 'Proposta - ACEmpresa Norte 11-10-2026.pdf');
  assert.equal(formatDate(new Date(2026, 9, 11)), '11/10/2026');
});


export const gerarHTML = (cliente, ac, telefone, endereco, cnpj, dataProposta, frete, dadosInputs) => {
  // ... Restante do código HTML

  const tabelaItens = dadosInputs.map((item, index) => `
    <tr>
        <td>${index + 1}</td>
        <td>${item.qtd}</td>
        <td>${item.descricao}</td>
        <td>R$ ${item.valorUnitario}</td>
        <td>R$ ${item.valorTotal}</td>
    </tr>
  `).join('');

  //criação das tabelas
  return `
  <!DOCTYPE html>
  <html lang="en">
  
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Proposta para Venda e Instalação de Grama Sintética</title>
  
    <style>
      body {
        margin: 0 0 0 30px;
      }
  
      #banner-logo {
        margin-top: 30px;
      }
  
      .central {
        text-align: center;
        margin-bottom: 50px;
      }
  
      .newton {
        margin-top: 30px;
        text-align: center;
      }
  
      span {
        font-weight: bold;
      }
  
      .texto-empresa p,
      .texto-cliente p,
      .dados-proposta p {
        margin-bottom: -10px;
      }
  
      h2 {
        font-size: 20px;
        text-align: center;
      }
  
      #titulo-principal{
        margin-bottom: 0px;
      }

      .texto-cliente {
        margin-bottom: 20px;
      }
  
      #dados-pagamento {
        padding-top: "2%";
        font-style: italic;
      }
  
      h1 {
        text-align: center;
      }
  
      table {
        max-width: 90%;
        width: 90%;
        margin: auto;
      }
    
      th,
      td {
        padding: 8px; /* Adjust the padding for better spacing */
        text-align: center;
      }
    
      th {
        font-weight: bold;
        font-size: 15px;
      }
    
      tr:nth-child(even) {
        background-color: #DCEBE6;
      }
    
      tr:hover:nth-child(1n + 2) {
        background-color: #085F63;
        color: #fff;
      }
  
    </style>
  </head>
  
  <body>
  
    <header class="central">
      <div id="banner-logo">
      <img src="https://github.com/GabrielTrindade20/Projeto-App-MasterGreen/blob/mastergreen/app/src/imagens/banner.jpeg?raw=true" alt="Banner MasterGreen" width="400" height="100" />
      </div>


  
      <div class="texto-empresa">
      <p>Razão Social: MasterGreen Grama Sintética</p>
      <p>CNPJ: 36.347.491/0001-99</p>
      <p> Endereço: QNN 24 Conjunto E Lote 14, Ceilândia Sul - DF</p>
      <p> Telefone: (61) 98412-4179 </p>
      <p>E-mail: mastergreendf@gmail.com</p>
    </div>
  </header>

  <h2 id="titulo-principal">PROPOSTA PARA VENDA E INSTALAÇÃO DE GRAMA SINTÉTICA</h2>

  <div class="texto-cliente">
    <p><span>Ao</span> ${cliente}</p>
    <p><span>A/C:</span> ${ac}</p>
    <p><span>Telefone:</span> ${telefone}</p>
    <p><span>Endereço:</span> ${endereco}</p>
    <p><span>CNPJ:</span> ${cnpj}</p>
    <p><span>Data da Proposta:</span> ${dataProposta}</p>
  </div>


  <table border="1">
  <thead>
      <tr>
          <th>ITEM</th>
          <th>QTD. (m²)</th>
          <th>DESCRIÇÃO DO PRODUTO</th>
          <th>VALOR UNIT.</th>
          <th>VALOR TOTAL</th>
      </tr>
  </thead>
  <tbody>
            ${tabelaItens}
        </tbody>
  <tfoot>
      <tr>
          <td colspan="4">TOTAL</td>
          <td>R$ 0,00</td>
      </tr>
  </tfoot>
</table>


  <h3>
    <span> Dados da Proposta: </span>
  </h3>
  <div class="dados-proposta">
    <p><span>Descrição do produto:</span> </p>
    <p><span>Prazo de garantia:</span> 1 ano (garantia da fábrica).</p>
    <p><span>Forma de pagamento:</span> 50% de entrada + 50% na entrega.</p>
    <p><span>Frete:</span> ${frete}.</p>
    <p><span>Tributos:</span> incluso no preço.</p>
    <p><span>Validade desta proposta:</span> 30 dias.</p>
  </div>

  <h3 id="dados-pagamento">Dados para pagamento:</h3>
  <p><span>PIX:</span> 36.347.491/0001-99 - CNPJ em nome da Rocha Comércio e Instalação de Grama Sintética</p>

  <div class="newton">
    <p>JOSÉ NEWTON DE ALMEIDA ROCHA</p>
    <p>Administrador</p>
  </div>

</body>

</html>
  
    `;
};


export default { gerarHTML };
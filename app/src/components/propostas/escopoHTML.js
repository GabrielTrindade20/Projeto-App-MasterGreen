
export const gerarHTML = (cliente, ac, telefone, endereco, tipoPessoa, dataProposta, frete, dadosInputs, valorFinalCliente) => {
  // ... Restante do código HTML

  const tabelaItens = dadosInputs.map((item, index) => `
    <tr>
        <td>${index + 1}</td>
        <td>${item.metragem}</td>
        <td>${item.descricao}</td>
        <td>R$ ${(item.valorPorMetro).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
        <td>${(item.valorPorMetro * item.metragem).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
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

      p {
        margin: 12px 0;
        padding: 0;
      }
       
      .texto-empresa p,
      .texto-cliente p,
      .dados-proposta p {
        margin-bottom: -10px;
        font-size: 12px
      }
  
      #cliente {
        margin-top: 20px;
        margin-bottom: 30px;
      }

      h2 {
        font-size: 20px;
        text-align: center;
      }
  
      #titulo-principal{
        margin-bottom: 0px;
        font-size: 15px
      }

      .texto-cliente {
        margin-bottom: 20px;
      }
  
      #dados-pagamento {
        padding-top: "2%";
        font-style: italic;
        margin: 30px 0px -5px 0px;
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
        padding: 2px 5px 2px 5px;
        text-align: center;
        font-size: 13px;
      }
  
      .linha-especial {
        background-color: #298A1E; /* Altere a cor conforme necessário */
        color: #fff;
        font-weight: bold;
        font-size: 12px;
      }
  
    </style>
  </head>
  
  <body>
  
    <header class="central">
      <div id="banner-logo">
      <img src="https://github.com/GabrielTrindade20/Projeto-App-MasterGreen/blob/mastergreen/app/src/imagens/banner.jpeg?raw=true" alt="Banner MasterGreen" width="300" height="80" />
      </div>
  
      <div class="texto-empresa">
      <p>Razão Social: Master Green Grama Sintética</p>
      <p>CNPJ: 36.347.491/0001-99</p>
      <p> Endereço: QNN 24 Conjunto E Lote 14, Ceilândia Sul - DF</p>
      <p> Telefone: (61) 98412-4179 </p>
      <p>E-mail: mastergreendf@gmail.com</p>
    </div>
  </header>

  <h2 id="titulo-principal">PROPOSTA PARA VENDA E INSTALAÇÃO DE GRAMA SINTÉTICA</h2>

  <div class="texto-cliente" id="cliente">
    <p><span>Ao(à):</span> ${cliente}</p>
    <p><span>A/C:</span> ${ac}</p>
    <p><span>Telefone:</span> ${telefone}</p>
    <p><span>Endereço:</span> ${endereco}</p>
    <p><span>CPF/CNPJ:</span> ${tipoPessoa}</p>
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
            <td colspan="3"></td>
            <td class="linha-especial" id="valor-total"><span>TOTAL:<span></td>
            <td class="linha-especial">${valorFinalCliente.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
            </tbody>
</table>


<div class="dados-proposta">
  <h3>
    <span> Dados da Proposta: </span>
  </h3>
    <p><span>Prazo de garantia:</span> 1 ano (garantia da fábrica).</p>
    <p><span>Forma de pagamento:</span> 50% de entrada + 50% na entrega.</p>
    <p><span>Frete:</span> ${frete}.</p>
    <p><span>Tributos:</span> incluso no preço.</p>
    <p><span>Validade desta proposta:</span> 30 dias.</p>
  </div>

  <h3 id="dados-pagamento">Dados para pagamento:</h3>
  <p><span>PIX:</span> 36.347.491/0001-99 - CNPJ </p> 
  <p><span>Em nome de:</span> Rocha Comércio e Instalação de Grama Sintética</p>

  <div class="newton">
    <p>NEWTON ROCHA</p>
    <p>Administrador</p>
  </div>

</body>

</html>
  
    `;
};


export default { gerarHTML };
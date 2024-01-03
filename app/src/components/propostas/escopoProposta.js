const gerarPDF = async () => {
  const options = {
    html: `
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

    #newton {
      margin-top: 100px;
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

    .texto-cliente {
      margin-bottom: 50px;
    }

    #dados-pagamento {
      padding-top: 30px;
      font-style: italic;
    }

    h1 {
      text-align: center;
    }

    table,
    th,
    td {
      border: 1px solid black;
    }

    table {
      border-collapse: collapse;
      margin: auto;
    }

    th,
    td {
      padding: 2px;
      text-align: center;
      width: auto;
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

    #footer {
      width: 100%;
      height: auto;
      position: absolute;
    }
  </style>
</head>

<body>

  <header class="central">
    <div id="banner-logo">
      <img src="../../imagens/banner.png" alt="banner-mastergreendf" width="500">
    </div>

    <div class="texto-empresa">
      <p>Razão Social: Master Green Grama Sintética</p>
      <p>CNPJ: 36.347.491/0001-99</p>
      <p> Endereço: QNN 24 Conjunto E Lote 14, Ceilândia /Sul/DF</p>
      <p> Telefone: (61) 98412-4179 </p>
      <p>E-mail: mastergreendf@gmail.com</p>
    </div>
  </header>

  <h2>PROPOSTA PARA VENDA E INSTALAÇÃO DE GRAMA SINTÉTICA</h2>

  <div class="texto-cliente">
    <p><span>Ao</span>${dados.cliente}</p>
    <p><span>A/C:</span> ${dados.ac}</p>
    <p><span>Telefone:</span>${dados.telefone}</p>
    <p><span>Endereço:</span> ${dados.endereco}</p>
    <p><span>CNPJ:</span>${dados.cnpj}</p>
    <p><span>Data da proposta:</span>${dados.dataProposta}</p>
  </div>

  <table border="1">
  <thead>
  <th>
    <span> ITEM</span>
  </th>
  <th>
    <span> QTD. (m²) </span>
  </th>
  <th>
    <span> DESCRIÇÃO DO PRODUTO</span>
  </th>
  <th>
    <span> VALOR UNIT. </span>
  </th>
  <th>
    <span> VALOR TOTAL </span>
  </th>
</thead>
    <tbody>
      {produtos.map((produto) => (
      <tr key=${produto.id}>
        <td>${produto.id}</td>
        <td>
          <input type="number" value=${produto.quantidade} onChange={(e)=> atualizarQuantidade(produto.id,
          e.target.value)}
          />
        </td>
        <td>
          <input type="text" value=${produto.descricao} onChange={(e)=> atualizarDescricao(produto.id, e.target.value)}
          />
        </td>
        <td>
          <input type="number" value=${produto.valorUnitario} onChange={(e)=> atualizarValorUnitario(produto.id,
          e.target.value)}
          />
        </td>
        <td>${calcularValorTotal(produto)}</td>
      </tr>
      ))}
      <tr>
        <td colSpan="4">TOTAL</td>
        <td>${calcularValorTotalTodosProdutos()}</td>
      </tr>
    </tbody>
  </table>

  <h3>
    <span> Dados da Proposta: </span>
  </h3>
  <div class="dados-proposta">
    <p><span>Descrição do produto:</span> ${produto.descricao} </p>
    <p><span>Prazo de garantia:</span> 1 ano (garantia da fábrica).</p>
    <p><span>Forma de pagamento:</span> 50% de entrada + 50% na entrega</p>
    <p><span>Frete:</span> ${produto.frente} </p>
    <p><span>Tributos:</span> incluso no preço.</p>
    <p><span>Validade desta proposta:</span> 30 dias</p>
  </div>

  <h3 id="dados-pagamento">Dados para pagamento:</h3>
  <p><span>PIX:</span> 36.347.491/0001-99 - CNPJ em nome da Rocha Comércio e Instalação de Grama Sintética</p>

  <div class="central" id="newton">
    <p>JOSÉ NEWTON DE ALMEIDA ROCHA</p>
    <p>Administrador</p>
  </div>


  <img src="../../imagens//grama.png" alt="grama" width="100px" id="footer">
  

</body>

</html>
`, fileName: 'proposta',
    directory: 'Documents',
  };
  try {
    const file = await RNHTMLtoPDF.convert(options);
    console.log('Caminho do arquivo PDF gerado:', file.filePath);
  } catch (error) {
    console.error('Erro ao gerar o PDF:', error);
  }
};
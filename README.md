# Projeto MasterGreen

## Visão Geral

O projeto MasterGreen é um aplicativo móvel desenvolvido em React Native que visa proporcionar a otimização do processo de orçamento da empresa.

## Funcionalidades Principais

- **Feature 1:** Calcula custos de trabalho
- **Feature 2:** Mostra os cálculos e valores para orçamento
- **Feature 3:** Calcula desconto
- **Feature 4:** Gera PDF com detalhes do orçamento

## Tecnologias Utilizadas

- **React Native:** Utilizado para o desenvolvimento multiplataforma.
- **Expo:** Facilita o desenvolvimento e o empacotamento da aplicação.

## Ambiente ativo — 11/10/2026

- `app-mastergreen/`: aplicativo atualizado para Expo SDK 57, com as telas reais
  Orçamento e Proposta, cores MasterGreen, fontes grandes e exportação/compartilhamento de PDF.
- `app/`: aplicativo original SDK 49, preservado como referência e para o APK antigo.
- Branch de trabalho: `develop`.
- A aba **Sistema** já faz login no web e consulta produtos, clientes permitidos
  e o percentual de nota fiscal. O orçamento rápido e o PDF continuam locais;
  ainda não são gravados no web. Histórico e relatórios virão nas próximas etapas.

## Estrutura do Projeto

- **`app-mastergreen/src/`**: Contém o código-fonte do aplicativo atualizado.
  - **`components/`**: Componentes reutilizáveis.
  - **`screens/`**: Telas principais do aplicativo.
  - **`navigation/`**: Configuração de navegação.

## Como Executar o Projeto

Certifique-se de ter o Node.js e o npm instalados. Em seguida, siga estas etapas:

1. Clone o repositório: `git clone https://github.com/GabrielTrindade20/Projeto-App-MasterGreen.git`
2. Navegue até o diretório ativo: `cd app-mastergreen`
3. Instale as dependências: `npm install`
4. Execute `npm start`, ou abra `iniciar-app.cmd` na raiz deste repositório.
5. No celular, abra o Expo Go compatível com SDK 57, toque em **Scan QR** e leia
   o QR do CMD. Celular e computador precisam estar na mesma rede.

O servidor usa a porta 8081. Mantenha o CMD aberto; se ele for fechado, execute
`iniciar-app.cmd` novamente. Não é necessário apertar `a`: esse comando exige
Android SDK/ADB no computador, enquanto o QR abre o projeto diretamente no celular.
Se a porta estiver ocupada, use a janela Expo já aberta ou encerre-a com Ctrl+C
antes de iniciar outra. Evite iniciar o projeto legado da pasta `app` por engano.

Para conectar o celular ao web local, crie `app-mastergreen/.env.local` com
`EXPO_PUBLIC_API_URL=http://IP_DO_PC:5001`. O IP precisa ser o da rede Wi-Fi
acessível pelo celular; `localhost` no aparelho aponta para o próprio celular.
Reinicie o Expo após mudar o arquivo. O endereço não contém senha nem acesso
direto ao PostgreSQL. Entre na aba Sistema com uma conta do banco de
desenvolvimento; a sessão usa a API do web. Enquanto desconectado, o app mantém
o percentual de nota fiscal do último acesso; sem acesso anterior, usa 4,5%.
Depois do login neste ambiente de desenvolvimento, o web fornece 5%.

## Verificações da migração

Na pasta `app-mastergreen`, execute `npm run check`, `npm test`, `npm run lint`
e `npx expo-doctor`. Node 24 é usado para os testes TypeScript nativos.
O teste opcional de interface usa Playwright com Edge:
`node tests/browser-smoke.cjs [caminho-do-pacote-playwright]` (Expo deve estar na 8081).

Preservada a estimativa do legado de 4,5% de nota fiscal sobre o valor bruto
quando ainda não há configuração recebida do web.
Os campos aceitam vírgula decimal. A logo do PDF vem de um asset local;
o documento mantém os dados e textos comerciais do original.

Validar no Android físico: seletor de data, gerar PDF, visualizar e compartilhar.
O Windows deste ambiente bloqueia `hermesc.exe` por Controle de Aplicativos;
a exportação de bytecode de produção permanece pendente. A exportação de
JavaScript com `--no-bytecode` é apenas uma verificação de desenvolvimento.

## Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir problemas (issues) ou enviar pull requests.

## Geração de PDF

Agora, o projeto inclui uma funcionalidade de geração de PDF. Após calcular o orçamento, você pode gerar um PDF detalhado com as informações.

## Autor

Gabriel Trindade Rocha
gabriel.oficioti@gmail.com

## Licença

Este projeto está sob a licença MasterGreendf. Consulte o arquivo [LICENSE.md] para obter mais detalhes.

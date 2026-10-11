# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

## MasterGreen — mobile em desenvolvimento

- Esta é a aplicação ativa (SDK 57), migrada do legado em `../app` (SDK 49).
- Preservar as abas Orçamento e Proposta, verde da marca e fontes grandes.
- Cálculo legado: custo por m² × área; nota fiscal sobre o bruto, antes do
  desconto. Sem sincronização prévia usa 4,5%; após conectar, usa o percentual
  configurado no web (atualmente 5% no ambiente de desenvolvimento).
- PDF e compartilhamento usam Expo Print, FileSystem e Sharing; validar no
  aparelho real. O navegador serve para testar telas e cálculos.
- A aba Sistema autentica na API web e lê produtos, clientes autorizados e
  percentual da nota fiscal. Propostas/PDF continuam locais e ainda não são
  salvos no web. Nunca colocar credenciais de banco no app.
- `EXPO_PUBLIC_API_URL` aponta para a API acessível pelo celular (IP do PC na
  rede local); nunca aponta diretamente para o PostgreSQL.
- `npm start` mostra o QR para Expo Go. `npm run check`, `npm test` e
  `npm run lint` verificam código e regras. `iniciar-app.cmd` na raiz do
  repositório abre a pasta correta, sem depender do Android SDK.

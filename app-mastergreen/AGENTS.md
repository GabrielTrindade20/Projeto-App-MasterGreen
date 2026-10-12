# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

## MasterGreen — mobile em desenvolvimento

- Esta é a aplicação ativa (SDK 57), migrada do legado em `../app` (SDK 49).
- Preservar o orçamento rápido, verde da marca e fontes grandes. Abas:
  Orçamento, Clientes, Histórico e Resumo; proposta pelo botão Fazer Proposta.
- Cálculo legado: custo por m² × área; nota fiscal sobre o bruto, antes do
  desconto, fixada em 4,5% conforme decisão do usuário em 11/10/2026.
  Não sincronizar percentual, produtos ou custos do web.
- PDF e compartilhamento usam Expo Print, FileSystem e Sharing; validar no
  aparelho real. O navegador serve para testar telas e cálculos.
- Login obrigatório na primeira abertura, sessão de 30 dias em SecureStore.
  Senha nunca persistida. Expiração não apaga rascunhos nem bloqueia o cálculo
  local; exige renovação para sincronizar. Logout explícito exige novo login.
- Rascunhos e fila em AsyncStorage por API/usuário. Ao gerar PDF, grava resumo
  antes de compartilhar. Itens/custos nunca são enviados; total não é recalculado.
- API /api/mobile/auth/login, /data e /proposals. Retry pelo mesmo clientId.
  Nunca colocar credenciais de banco no app. Histórico é apenas consulta.
- Segundo plano usa BackgroundTask e recibos separados, sem regravar o formulário.
  Android pode adiar; retomada do app confirma envios idempotentes. Expo Go/web
  não substituem teste do APK no aparelho físico.
- Configurações: sincronização Wi-Fi padrão, dados locais, fonte, contraste e conta.
- APK preview tem package .develop para não substituir o app em uso. Produção
  reutiliza o package legado, mas exige conferir assinatura/versionCode antes.
- `EXPO_PUBLIC_API_URL` aponta para a API acessível pelo celular (IP do PC na
  rede local); nunca aponta diretamente para o PostgreSQL.
- `npm start` mostra o QR para Expo Go. `npm run check`, `npm test` e
  `npm run lint` verificam código e regras. `iniciar-app.cmd` na raiz do
  repositório abre a pasta correta, sem depender do Android SDK.

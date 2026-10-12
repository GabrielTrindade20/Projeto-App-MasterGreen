# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

## MasterGreen — mobile em desenvolvimento

- Esta é a aplicação ativa (SDK 57), migrada do legado em `../app` (SDK 49).
- Preservar o orçamento rápido, verde da marca e fontes grandes. Abas:
  Orçamento, Clientes, Histórico e Resumo; proposta pelo botão Fazer Proposta.
- Cálculo legado: custo por m² × área; nota fiscal sobre o bruto, antes do
  desconto, fixada em 4,5% conforme decisão do usuário em 11/10/2026.
  Não sincronizar percentual nem alterar os custos do cálculo rápido. O catálogo
  cacheia nome, descrição, categoria original e preço por m² do cadastro de Produtos
  do web. Seleção na proposta filtra por `products.category`, sem inferir grupos
  pelo nome nem usar metadados `catalog` antigos. Nenhuma organização paralela
  em Configurações; alterações de categoria são feitas no cadastro de Produtos.
  Custos internos têm uma aba
  separada (pedido de 11/10/2026): selecionar copia descrição, mas limpa preço
  de venda. Nunca imprimir custo interno no PDF. Item manual segue offline.
- PDF e compartilhamento usam Expo Print, FileSystem e Sharing; validar no
  aparelho real. O navegador serve para testar telas e cálculos.
- Compartilhamento nativo: solicitar `base64: true` ao Print e gravar com
  `File.write(..., { encoding: 'base64' })` no `Paths.cache`. Não copiar a URI
  temporária retornada pelo Print: no Expo Go ela pode estar fora do escopo de
  leitura do FileSystem. Testes de orquestração: `tests/export-proposal.test.cjs`.
- Login obrigatório na primeira abertura, sessão de 30 dias em SecureStore.
  Senha nunca persistida. Expiração não apaga rascunhos nem bloqueia o cálculo
  local; exige renovação para sincronizar. Logout explícito exige novo login.
- Rascunhos e fila em AsyncStorage por API/usuário. Salvar grava resumo e cópia
  local dos itens para reenvio do PDF pelo histórico; gerar/compartilhar grava
  antes de abrir o compartilhamento. Pedido de 12/10/2026 substitui a restrição
  anterior: enviar itens comerciais (productId opcional, descrição, quantidade,
  unidade e preço de venda) para edição completa no web; nunca enviar custo interno.
  Total negociado não é recalculado. Catálogo preenche productId; itens antigos
  sem vínculo continuam livres, sem tentar adivinhar produto pelo nome.
  Ao abrir online, recuperar itens de snapshots locais antigos enviados, usando
  o mesmo clientId e resumo; API só complementa resumos intactos sem webDetails.
  Nunca sobrescrever edição web. Flag itemsSynced evita repetir recuperação.
  Nova proposta fica fixa sob o cabeçalho; confirmação limpa só rascunho e
  lastFinalized, preservando fila, histórico e propostas aguardando envio.
- API /api/mobile/auth/login, /data e /proposals. Retry pelo mesmo clientId.
  Cliente selecionado conserva customerId; endereço reúne rua, número, bairro,
  cidade/UF e CEP. ID inválido não deve criar novo cadastro silenciosamente.
  Nunca colocar credenciais de banco no app. Histórico não edita nem exclui;
  PDFs de propostas salvas no aparelho podem ser compartilhados novamente.
- Histórico de origem Web oferece Abrir no sistema web no detalhe. Link usa
  /orcamentos?view=UUID e abre no navegador, com login web independente e retorno
  à proposta após autenticação. Nunca transmitir token mobile na URL nem criar
  acesso público. EXPO_PUBLIC_WEB_URL opcional; padrão é a origem de API_URL.
  HTTP só em desenvolvimento; aparelho usa IP da rede, não localhost.
  Abrir no web requer conexão; compartilhamento de PDF local continua offline.
  Propostas App sincronizadas também oferecem Ver versão atual no web com
  &source=app. Compartilhar cópia original usa o snapshot local e avisa que não
  contém revisões web. Não adicionar editor completo ao mobile.
- Segundo plano usa BackgroundTask e recibos separados, sem regravar o formulário.
  Android pode adiar; retomada do app confirma envios idempotentes. Expo Go/web
  não substituem teste do APK no aparelho físico.
- Configurações: sincronização Wi-Fi padrão, dados locais, fonte, contraste e conta.
- PDFs usam `data.company`, sincronizado de Configurações do web; defaults antigos
  só quando não há cache. Nova geração, inclusive pelo histórico, usa os dados da
  empresa da última sincronização. Condições comerciais da proposta salva se mantêm.
  `company-profile.ts` espelha o contrato de `sistema-web/shared`;
  teste web `proposal-documents.test.ts` garante paridade. `catalog.ts` filtra
  somente as categorias originais, testadas com cache antigo e busca sem acentos.
  Unidades opcionais
  (`m²`, `un`, `m`, `serviço`) preservam rascunhos antigos e a multiplicação existente.
- Navegação: NavigationFeedbackProvider mostra indicador verde/Carregando antes
  de montar a próxima tela; abas usam tabPress/focus e atalhos useAppNavigation.
  Não adicionar espera artificial nem esperar sincronização para liberar tela.
  Focus remove indicador; proteção de 8s evita bloqueio por navegação cancelada.
  Aba atual não dispara loading; preferência de movimento reduzido conserva texto.
  Teste ux-smoke verifica renderização anterior à navegação e remoção por foco.
- UI/UX: fundo claro/verde, listas virtuais de clientes/histórico, filtros de
  período/origem/situação e cliente reutilizável na proposta. Resumo consulta
  `/api/mobile/summary?from=YYYY-MM-DD&to=YYYY-MM-DD`, com cache opcional
  `reports` no estado v1; nunca substituir um período offline por outro.
  Renovar resumo ao focar a aba e após cada sincronização bem-sucedida, inclusive
  quando custos/commission mudaram sem alterar o total do histórico. Manter cache.
  Documento e homologação: `docs/UI-UX-PLAN.md`; prévia web: `tests/ux-smoke.cjs`.
- APK preview tem package .develop para não substituir o app em uso. Produção
  reutiliza o package legado, mas exige conferir assinatura/versionCode antes.
  Em 12/10/2026 o export Android/Hermes voltou a passar. Isso não homologa APK:
  EAS/assinatura e testes no aparelho ainda pendentes; URLs de build exigem HTTPS
  sem credenciais/query/localhost. Roteiro: sistema-web/docs/RELEASE-CHECKLIST.md.
- Em 12/10/2026 Gabriel decidiu gerar o APK pessoalmente. Passo a passo:
  docs/GERAR-APK.md. Não gerar builds/alterar assinatura sem novo pedido.
- Segurança de links: query-string 7 usa decode-uri-component 0.5 via override
  e patches/query-string+7.1.3.patch (interop ESM). npm ci deve aplicar postinstall;
  não omitir scripts nem o diretório patches na build. xcode usa uuid 11.1.1.
  Testes query-decoder cobrem parsing/limite de tempo e IDs do gerador.
  Alertas sem patch de braces/node-forge pertencem ao toolchain; não apareceram
  no mapa de fontes do export Android de 12/10/2026. Não significa risco zero.
- `EXPO_PUBLIC_API_URL` aponta para a API acessível pelo celular (IP do PC na
  rede local); nunca aponta diretamente para o PostgreSQL.
- `npm start` mostra o QR para Expo Go. `npm run check`, `npm test` e
  `npm run lint` verificam código e regras. `iniciar-app.cmd` na raiz do
  repositório abre a pasta correta, sem depender do Android SDK.

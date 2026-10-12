# MasterGreen — planejamento de UI/UX mobile

Data: 11/10/2026. Estado: aprovado e implementado em develop; homologação no Android pendente.

## Entrega e validação

- Padrão claro/verde, botões de hierarquia distinta, seções recolhíveis, listas
  virtualizadas, busca/filtros fixos, seletor de cliente reutilizável e catálogo.
- Histórico por mês, ano e intervalo; origem, situação e ordenação; filtros e
  posição mantidos ao alternar abas (não persistidos após encerrar o aplicativo).
- Resumo por intervalo autenticado e cache dos últimos 24 períodos consultados,
  por API/usuário. Evolução exibe até 12 meses; totais usam o intervalo completo.
- Relatórios avançados/executivos e histórico mobile compartilham seleção de
  versões no servidor (valor/situação da versão calculada, data da original). Dashboard legado do web continua com suas regras antigas;
  não foi reformulado nesta entrega. Custos/lucro só do subconjunto com custos
  registrados e comissões estimadas pela taxa atual, com avisos explícitos.
- Fórmula 4,5%, dados locais, login, catálogo opcional e PDF preservados.
- Testes: TypeScript/lint, 14 testes mobile, métricas e SQL com rollback,
  paridade HTTP real web/mobile e navegador com dados fictícios (PDF, salvar
  repetido, filtros, seleção de cliente, offline e fonte extragrande a 320 px).
- Não houve nova dependência, alteração de schema ou acesso ao banco de produção.
- Validar com o proprietário: teclado/TalkBack, leitura e densidade no Redmi,
  seletor de data, PDF/compartilhamento nativos e modo avião no APK.

Scripts: `tests/ux-smoke.cjs` (prévia web com Playwright disponível no ambiente),
`npm test`, `npm run check`, `npm run lint`. Capturas com dados fictícios ficam
em `dist/ux-*.png`, fora do git. Não são capturas de clientes reais.

## Objetivo e limites

Tornar o aplicativo fácil de ler e operar pelo proprietário, com menos rolagem,
melhor localização de informações e acesso rápido à proposta. Preservar o cálculo,
a identidade verde, a sessão de 30 dias, os dados locais e o funcionamento offline.

O foco desta etapa é o app. O web participa das consultas e da consistência dos
indicadores; uma reformulação visual completa do web será um trabalho posterior.
O projeto já utiliza Expo SDK 57 e React Native 0.86. A modernização proposta é de
componentes, organização e interação; não depende de uma nova migração de stack.

As imagens enviadas orientam hierarquia, listas, espaços e seleção de filtros.
Não reproduzir fontes minúsculas, telas bancárias, imagens decorativas ou grades
densas de produtos. A leitura do proprietário determina a densidade final.

## Diagnóstico do código atual

- `mastergreen-ui.tsx`: telas com fundo verde escuro, texto predominantemente
  centralizado/negrito e um mesmo tipo de card/botão para quase tudo.
- `consultation-screens.tsx`: clientes e histórico mostram cards grandes, busca
  textual e lotes de 30 acessíveis no fim da lista; não existem filtros de período.
- `SyncStatus`: avisos completos repetidos em várias telas competem com o conteúdo.
- `proposal-screen.tsx`: formulário extenso, condições antes dos itens e ações no
  final; seleção de produto já funciona dentro de cada item.
- `/api/mobile/data`: clientes/produtos/histórico em cache, mas resumo limitado ao
  mês consultado, propostas rápidas e totais aprovados do web.
- Relatórios web: há indicadores de empresa, vendedores e administrador. Não foi
  identificado módulo de investidores; o plano usa a entidade real “responsável”.
- As propostas rápidas não têm custos ou situação comercial de aprovação no web.
  “Enviada ao sistema” não equivale a venda aprovada nem a recebimento financeiro.

## 1. Direção visual e acessibilidade

Personalidade: profissional, clara e simples. Fundo claro com leve tom neutro,
superfícies brancas, verde escuro para marca/destaques e verde de ação nos botões
principais. Cores adicionais somente para estados, sempre com rótulo e ícone.

- Texto principal como ponto inicial em 20–22 unidades lógicas; secundário legível
  em 18; títulos de 24–28 e valores de 30–36. Validar no aparelho do proprietário.
- Respeitar fonte do sistema e opção grande/extragrande do app sem multiplicação
  excessiva. Deixar linhas crescerem; evitar corte de nome e valores financeiros.
- Texto alinhado à esquerda para leitura. Valores com alinhamento consistente.
- Botões principais com altura mínima de projeto de 56, rótulo curto e ícone
  acompanhado de texto; controles secundários com área de toque de pelo menos 48.
- Meta de contraste de texto de 4,5:1; modo de alto contraste e foco visível.
- Sem ações obrigatórias escondidas em gestos. Animações discretas e compatíveis
  com preferência de movimento reduzido. TalkBack com ordem e rótulos coerentes.
- Grid de espaços 4/8/12/16/24/32; raios moderados, bordas leves e poucas sombras.
- Dois indicadores por linha somente se fonte e largura permitirem. Em fonte
  extragrande, virar uma coluna mantendo os valores completos.

Definir cores/espaços/tipografia por função (fundo, superfície, texto, ação,
alerta), depois variantes de componentes. A referência de cor pode ser mantida em
OKLCH no guia de design e exportada para formatos sRGB compatíveis com React Native.
Não transportar CSS de navegador diretamente para os componentes Android.

## 2. Navegação e estados gerais

Manter quatro abas com ícone e texto: **Orçar · Clientes · Histórico · Resumo**.
Abrir em Orçar, o trabalho principal do proprietário. Configurações pelo cabeçalho.

- Cabeçalho curto, título alinhado e contexto da tela.
- Indicador compacto: “Atualizado”, “Sem internet” ou “2 aguardando envio”.
  Tocar abre detalhes de sincronização; erros que exigem ação ficam visíveis.
- Guardar busca, filtros e posição ao alternar abas.
- Estados claros: carregando, nenhum registro no período, sem dados baixados e
  falha ao atualizar são situações diferentes.
- Campos mantêm o preenchimento ao voltar; teclado não cobre o campo ou a ação.

## 3. Histórico — localizar sem percorrer a lista inteira

Estrutura da tela: título → busca fixa → período/filtros → quantidade encontrada
→ lista por data. Começar em “Este mês”, com “Todo o histórico” sempre acessível.

- Atalhos: Este mês, Mês passado, Este ano e Todo o histórico.
- Seletor explícito de mês/ano e opção de data inicial/final. Escolhas mutuamente
  coerentes: intervalo personalizado substitui o atalho, sem filtros ocultos.
- Filtros adicionais numa folha de opções: origem (App/Web) e situação aplicável.
  Separar situação comercial do web de sincronização do app.
- Filtros ativos resumidos na tela, com Limpar e contagem dos resultados.
- Ordenação: mais recentes, mais antigas e maior valor.
- Linhas legíveis: nome, data, valor, origem e situação. Agrupamento por dia/mês.
- Renderização virtualizada e carregamento progressivo automático, com tentativa
  manual se houver falha. Não depender de chegar ao rodapé para filtrar.
- Sem edição/exclusão. Compartilhar PDF continua disponível nas propostas com
  documento salvo neste aparelho; indicar claramente quando ele não existe aqui.

Filtros funcionam no cache offline. Informar a última atualização e a cobertura
dos dados baixados se futuramente houver paginação remota.

Aceite: localizar proposta de qualquer mês/ano pelo filtro no topo, sem rolar
todo o histórico; preservar os mesmos resultados ao usar cache sem internet.

## 4. Clientes — lista organizada e seleção reutilizável

- Busca fixa por nome, telefone ou documento; ignorar acentos e pontuação.
- Lista alfabética, separadores de letras e linhas de duas ou três linhas:
  nome em destaque, telefone e cidade como informação secundária.
- Ordenação A–Z/Z–A e filtro por cidade. Acrescentar situação do cliente apenas
  se o campo real do cadastro for incluído na API; não inventar classificações.
- Ao tocar, abrir ficha com telefone, documento e endereço completos.
- Ação “Usar na proposta” preenche dados do cliente e mantém os itens existentes.
  Se já houver outro cliente no rascunho, confirmar a substituição desses campos.
- Reutilizar essa mesma seleção no campo Cliente da proposta.
- Iniciais podem ajudar a localizar o nome; fotos não são requisito de uso.

Aceite: encontrar cliente por parte do nome ou telefone e levá-lo à proposta em
poucos toques, com texto grande e sem duplicar manualmente o cadastro.

## 5. Resumo — desempenho compreensível

Estrutura: período no topo → indicador principal → indicadores complementares
→ evolução mensal → desempenho por responsável, acessível por “Ver equipe”.

Primeira tela deve responder: quanto foi aprovado, quantas propostas foram
aprovadas, quanto está sendo proposto e como isso varia no período escolhido.

- Destaque principal: **Vendas aprovadas do web**, com valor e quantidade.
- Indicadores secundários: propostas do app (valor proposto/quantidade) e ticket
  médio das aprovadas. Rótulos curtos; explicação detalhada por toque.
- Comparação com período anterior de duração equivalente, somente quando os
  dados permitirem. Base zero/ausente deve mostrar “Sem comparação”, não infinito.
- Evolução mensal em barras simples, valores legíveis e alternativa textual.
- Detalhe “Empresa”: custos, comissões e lucro quando os dados do web estiverem
  completos e as regras conferidas. Ausência de custo não significa lucro zero
  nem o valor integral da proposta como lucro.
- Detalhe “Equipe”: nome do responsável, valor aprovado, quantidade e comissão
  registrada. Mostrar somente pessoas com dados relevantes ao período.
- Atalhos dos indicadores levam ao histórico com o período/filtro correspondente.
- Offline: mostrar o resumo salvo daquele período e sua atualização; um período
  ainda não baixado informa que precisa de conexão, sem apresentar dados de outro.

### Dependência de API e de regra de negócio

Esta é a parte de maior esforço. Criar consulta autenticada para os períodos e
indicadores, reutilizando a regra dos relatórios web. Antes de expor lucro e
desempenho, conferir as diferenças entre as consultas atuais e a preferência pela
versão calculada de uma proposta, contando cada proposta original uma só vez.

Documentar para cada indicador: fonte, situação considerada, data usada, unidade
monetária, tratamento de ausência e período. Vendas aprovadas não são caixa
recebido. Propostas rápidas só participam dos indicadores de valor proposto.
Não calcular conversão comercial do app enquanto não houver aprovação registrada.

Usar datas comerciais sem mudança de dia por fuso e a convenção de São Paulo
para timestamps. Valores agregados devem vir do servidor; cache por período e
usuário. Validar paridade entre app e relatório web para o mesmo intervalo.

## 6. Orçamento e proposta — rapidez com orientação

### Orçar

- Agrupar preço por m² e metragem em uma seção de cálculo; custo e desconto
  próximos, com unidades visíveis.
- Valor final do cliente em destaque; custo, imposto, desconto e lucro estimado
  organizados em linhas secundárias, acessíveis ao proprietário.
- Botão Fazer proposta sempre fácil de alcançar. Qualquer passagem automática
  de dados deve preservar a fórmula atual e pedir confirmação se substituir
  conteúdo já preenchido na proposta.

### Proposta

Ordem sugerida: **Cliente → Itens → Condições → Revisão** em uma tela com seções
recolhíveis, sem exigir um assistente de quatro páginas para cada proposta.

- Cliente existente por busca ou preenchimento direto; opcionais em Dados adicionais.
- Um único “Adicionar item”. Item novo abre expandido com escolha de produto,
  descrição, metragem e preço editáveis. Itens concluídos mostram resumo e subtotal.
- Produto escolhido numa lista pesquisável com nome e preço por m². Categorias
  como filtro, se úteis; sem exigir foto ou cadastro central para um item livre.
- Frete, garantia e entrada agrupados em Condições, com resumo ao recolher.
- Total e ação principal em área inferior que respeita teclado e barra do celular.
- Gerar e compartilhar PDF como ação principal; Salvar e Visualizar como ações
  secundárias identificadas. Nova proposta como ação separada com confirmação.
- Diferenciar “Rascunho guardado”, “Proposta salva” e “Enviada ao sistema”.
- Erro junto ao campo, com foco no primeiro problema e sem apagar preenchimento.

Aceite: selecionar cliente, adicionar um item, informar metragem, conferir total
e compartilhar mantendo a rapidez atual; repetir salvar/compartilhar sem duplicar.

## 7. Configurações e acabamento

Organizar em linhas agrupadas: Conta, Sincronização, Leitura, Sobre e suporte.
Usar controles de seleção/alternância para opções, em vez de vários botões iguais.
Texto grande/extragrande com prévia imediata; alto contraste preservado.
Endereço do servidor e detalhes técnicos ficam em Informações de suporte.
Pendências de envio continuam acessíveis com orientação específica.

Não incluir nesta etapa: tema escuro completo, gráficos decorativos, novos usuários,
metas financeiras, módulo de investidores ou notificações comerciais.

## 8. Estrutura técnica e sequência de entrega

Separar estrutura de tela de rolagem: telas de lista não podem ser forçadas a
usar o mesmo ScrollView de um formulário. Usar FlatList/SectionList conforme o
agrupamento, com cabeçalho de filtros fixo e itens de altura flexível.

Organizar os componentes reutilizáveis por função: cabeçalho/status, campo,
botão primário/secundário, linha de lista, seletor de período, folha de filtros,
indicador financeiro, estados vazios e rodapé de ações. Manter filtro/consulta
separados da apresentação e adaptar o estado persistido com compatibilidade.

| Etapa | Entrega | Esforço relativo | Dependência |
|---|---|---|---|
| 1 | Prévia das quatro telas principais, com fonte grande e extragrande | Médio | Este plano |
| 2 | Padrão visual, navegação e componentes acessíveis | Médio | Direção visual definida |
| 3 | Histórico com período, filtros e lista organizada | Médio | Componentes e cache atual |
| 4 | Clientes e seletor reutilizável na proposta | Médio | Componentes e cadastro atual |
| 5 | Regras comuns de indicadores, API e cache por período | Alto | Auditoria dos relatórios |
| 6 | Resumo visual, gráficos simples e equipe | Médio/alto | Indicadores validados |
| 7 | Fluxo de orçamento/proposta, rodapé e seletores | Alto pelo impacto | Clientes e componentes |
| 8 | Configurações, estados e homologação com o proprietário | Baixo/médio | Telas concluídas |

Etapas 5 e 7 exigem mais cuidado: métricas precisam coincidir com o web e o fluxo
de proposta não pode perder dados nem ficar mais demorado. Entregar incrementos
testáveis em develop nos repositórios; mudanças de produção são uma etapa separada.

## Critérios finais de aceite

1. Histórico por mês, ano e intervalo acessível no topo; filtros persistem.
2. Cliente encontrado por busca normalizada e selecionado sem redigitação.
3. Indicadores do mesmo período conferem com a regra compartilhada do web.
4. Valores propostos, aprovados e pendentes de envio são claramente distintos.
5. Fonte extragrande não corta conteúdo nem deixa controles inacessíveis.
6. Proposta com cálculo conhecido mantém total, PDF e envio sem duplicação.
7. Sem internet, rascunho, catálogo baixado e propostas locais continuam utilizáveis.
8. Teclado, botão Voltar, barras do Android e reabertura do app não perdem dados.
9. Validar no Redmi do proprietário e pedir que ele encontre uma proposta antiga,
   escolha um cliente, interprete o resumo e gere um PDF sem instrução verbal.

## Referências técnicas

- [React Native: acessibilidade](https://reactnative.dev/docs/accessibility) —
  rótulos, estados, foco e anúncio de alterações.
- [React Native: FlatList](https://reactnative.dev/docs/flatlist) — listas com
  renderização progressiva e cabeçalho/rodapé.
- [W3C: contraste de texto](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
  — referência para contraste do sistema visual.

Skills aplicadas: native-app-designer (hierarquia, listas e movimento discreto) e
design-system-creator (padrões e componentes reutilizáveis). As recomendações
foram adaptadas ao Android, à identidade existente e à baixa visão do proprietário.

# Gerar e instalar o APK MasterGreen pelo Windows

Atualizado em 12/10/2026. A geração será feita pelo Gabriel, conforme pedido.
Nenhum APK foi gerado, nenhuma chave foi criada/trocada e nenhum deploy foi feito
nesta rodada. O export Hermes validado não é um APK.

## 1. Antes de começar

- Use o CMD, não o terminal da pasta antiga `app-mobile/app`.
- É necessário internet e uma conta Expo. Não precisa instalar Android Studio,
  Android SDK ou emulador para o build em nuvem.
- A API atualizada precisa estar publicada em HTTPS, com banco/migrações e login
  funcionando. O APK não publica o web automaticamente. Não usar localhost,
  IP do computador nem conexão PostgreSQL como endereço do app.
- Preview deve apontar para homologação/banco de teste; o sufixo `.develop`
  separa a instalação, mas NÃO separa o banco se você informar a URL oficial.
- Confira os créditos/limites da conta antes de confirmar uma build.
- Pendências operacionais: `sistema-web/docs/RELEASE-CHECKLIST.md`.

## 2. Abrir a pasta e entrar na conta

```bat
cd /d J:\Work\Lumitech\Clientes\MasterGreen\app-mobile\app-mastergreen
node --version
npx eas-cli@24.13.0 login
npx eas-cli@24.13.0 whoami
```

Use a conta que gerou o aplicativo antigo. Digite a senha somente no terminal,
nunca no chat. Node local validado: 24.19.0; SDK 57 requer ao menos 22.13.x.

## 3. Conferir e vincular o projeto existente

No painel Expo, localize o projeto antigo. O arquivo legado informa:

- slug: `AppMasterGreen`;
- projectId: `17ee6e08-809f-43e3-9d61-3cc78e06ea52`;
- pacote Android: `com.gab_roch.AppMasterGreen`.

Esses dados foram lidos do código, NÃO confirmados na conta. Confira que o
projeto pertence à conta correta. Não crie outro projeto automaticamente se a
intenção é atualizar a instalação existente.

Após confirmar, na pasta nova execute:

```bat
npx eas-cli@24.13.0 init --id 17ee6e08-809f-43e3-9d61-3cc78e06ea52
```

Como existe configuração dinâmica (`app.config.ts`), o CLI pode pedir alteração
manual. Nesse caso, em `app.json`, dentro de `expo`, ajuste `slug` para o slug
confirmado e acrescente/mescle `extra.eas.projectId` com o ID confirmado. Não
substitua o arquivo inteiro nem remova plugins/assets. Se solicitado, acrescente
`owner` com o usuário/organização correto. O `app.config.ts` preserva esses campos.

```json
"slug": "AppMasterGreen",
"extra": {
  "eas": { "projectId": "17ee6e08-809f-43e3-9d61-3cc78e06ea52" }
}
```

```bat
npx eas-cli@24.13.0 project:info
```

Pare se nome, proprietário ou ID não corresponderem ao projeto esperado.

## 4. Informar URLs de homologação

Substitua `https://HOMOLOGACAO.EXEMPLO` pelo endereço real publicado. Os dois
valores normalmente são iguais (origem do web, sem `/api/mobile` no final).

```bat
npx eas-cli@24.13.0 env:set --environment preview --name EXPO_PUBLIC_API_URL --value https://HOMOLOGACAO.EXEMPLO --visibility plaintext
npx eas-cli@24.13.0 env:set --environment preview --name EXPO_PUBLIC_WEB_URL --value https://HOMOLOGACAO.EXEMPLO --visibility plaintext
```

São URLs públicas, não segredos. Nunca adicionar usuário/senha do PostgreSQL,
senha de login ou token em variável `EXPO_PUBLIC_*`. `.easignore` exclui os
arquivos `.env` locais e chaves do upload; variáveis do build ficam no EAS.

## 5. Validar e gerar o APK de testes

```bat
npm ci
npm run check
npm test
npm run lint
npx expo install --check
npx eas-cli@24.13.0 build:inspect --platform android --profile preview --stage archive --output dist/eas-archive-preview
```

Confira o arquivo de upload antes da primeira build: não deve conter `.env`,
credenciais, keystores, dumps de banco ou material do app legado desnecessário;
deve conter `patches/query-string+7.1.3.patch`. Não use `--ignore-scripts` no
`npm ci`: o postinstall aplica a correção do decodificador de links.

```bat
npx eas-cli@24.13.0 build --platform android --profile preview
```

O perfil já gera **APK**, não AAB, com nome **MasterGreen Testes** e pacote
`com.gab_roch.AppMasterGreen.develop`. Para ESSE pacote de testes pode ser criada
uma chave separada se o EAS solicitar. Não confundir com a chave do pacote final.

Ao finalizar, abra no celular o link fornecido pelo EAS, baixe e instale o APK.
Autorize instalar desse navegador somente se o Android solicitar; não é preciso
desativar proteções gerais do aparelho. Não desinstale o aplicativo antigo.

## 6. Homologar o APK instalado

Faça com o computador/Metro desligado:

1. Login online, fechar/reabrir sem pedir a senha novamente.
2. Orçamento manual e com produto do catálogo; conferir cliente, itens e total.
3. Modo avião: salvar, fechar/reabrir e recuperar proposta/rascunho.
4. Gerar PDF curto/longo e compartilhar pelo WhatsApp, também pelo histórico.
5. Reconectar ao Wi-Fi: proposta chega uma única vez no web, com dados e itens.
6. Editar no web e consultar versão atual pelo link do app.
7. Conferir clientes/resumo, fonte extragrande, TalkBack e navegação.

Repetir o roteiro completo do RELEASE-CHECKLIST antes de entregar ao cliente.
Teste no navegador ou Expo Go não substitui esta instalação.

## 7. Conferir assinatura e versionCode do aplicativo final

```bat
set APP_VARIANT=production
npx eas-cli@24.13.0 credentials --platform android
npx eas-cli@24.13.0 build:version:get --platform android --profile production
```

Escolha o perfil **production** e confira o pacote `com.gab_roch.AppMasterGreen`.
Reutilize a chave original e compare o certificado com o APK distribuído anterior
(painel/registro da build antiga; `keytool -printcert -jarfile caminho-do-antigo.apk`
quando houver assinatura JAR disponível; APK somente v2/v3 exige apksigner).
Não gere chave nova para substituir a antiga. Se a chave sumiu, interrompa e
recupere-a: chave diferente impede atualizar a instalação existente.

O versionCode final precisa ser maior que o instalado. `production` tem
`autoIncrement: true` e versão remota. Se a versão remota estiver ausente ou
atrasada, ajuste a base para o maior versionCode já distribuído:

```bat
npx eas-cli@24.13.0 build:version:set --platform android --profile production
set APP_VARIANT=
```

Nunca reduza um versionCode já maior. Guarde backup seguro da chave, sem Git/chat.

## 8. Gerar o definitivo após o aceite

Configure a URL oficial confirmada, com o backend já atualizado. O domínio
`sistemamastergreen.com.br` está registrado no projeto, mas precisa confirmação
de ambiente/deploy antes de ser usado no APK. Não alteramos a produção nesta etapa.

```bat
npx eas-cli@24.13.0 env:set --environment production --name EXPO_PUBLIC_API_URL --value https://DOMINIO-OFICIAL-CONFIRMADO --visibility plaintext
npx eas-cli@24.13.0 env:set --environment production --name EXPO_PUBLIC_WEB_URL --value https://DOMINIO-OFICIAL-CONFIRMADO --visibility plaintext
npx eas-cli@24.13.0 build --platform android --profile production
```

Instale sobre o APK anterior em aparelho de teste/cópia, sem desinstalar, e confira
dados e login. Se aparecer conflito de pacote/assinatura, não mande apagar o app:
primeiro preserve pendências e confira chave/pacote/versão.

Somente após o aceite compartilhe com o cliente o link do APK da build
**production** aprovada. Guarde ID da build, versão, certificado e SHA-256 do APK
(`certutil -hashfile caminho-do.apk SHA256`) para rastrear a entrega.

## Referências oficiais

- https://docs.expo.dev/build/setup/
- https://docs.expo.dev/build-reference/apk/
- https://docs.expo.dev/eas/environment-variables/
- https://docs.expo.dev/app-signing/app-credentials/
- https://docs.expo.dev/build-reference/app-versions/

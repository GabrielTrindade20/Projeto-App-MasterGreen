/** No session tokens or customer details belong in browser links. */
export function proposalWebUrl(base: string, id: string, allowHttp = false, source: 'web'|'mobile' = 'web'): string {
  if (!/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(id)) {
    throw new Error('Esta proposta não tem um link válido. Atualize o histórico e tente novamente.');
  }
  let url: URL;
  try { url = new URL(base); } catch {
    throw new Error('O endereço do sistema web não está configurado.');
  }
  if (url.username || url.password || !(url.protocol === 'https:' || (allowHttp && url.protocol === 'http:'))) {
    throw new Error('O endereço do sistema web precisa ser uma conexão segura.');
  }
  return `${url.origin}/orcamentos?view=${id}${source==='mobile'?'&source=app':''}`;
}

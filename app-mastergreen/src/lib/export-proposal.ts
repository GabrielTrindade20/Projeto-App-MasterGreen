import { Directory, File, Paths } from 'expo-file-system';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { MASTERGREEN_LOGO_BASE64 } from './logo-base64';

export async function getBannerUri() {
  // Logo embutido como base64: evita resolução de asset em runtime, que no build
  // de produção Android expõe uma URI sem protocolo (ex.: "assets_mastergreen_logo")
  // e quebra o fetch. O PDF recebe a imagem direto, sem I/O nem rede.
  return `data:image/png;base64,${MASTERGREEN_LOGO_BASE64}`;
}

export async function exportProposal(html: string, filename: string, preview: boolean, onPrepared?:()=>Promise<void>) {
  if (preview) {
    await Print.printAsync({ html, width: 595, height: 842, margins: { left: 0, top: 0, right: 0, bottom: 0 } });
    return;
  }
  if (!(await Sharing.isAvailableAsync())) {
    throw new Error('O compartilhamento não está disponível neste aparelho. Use Visualizar PDF.');
  }
  // Expo Go can place Print's temporary file outside FileSystem's scoped cache.
  // Receive the bytes from Print instead of copying a URI without READ permission.
  // A4 explícito (595x842pt) — sem isso o Android renderiza em US Letter e o CSS
  // @page A4 cai dentro de uma área menor, deixando margens enormes no PDF.
  const pdf = await Print.printToFileAsync({ html, base64: true, width: 595, height: 842, margins: { left: 0, top: 0, right: 0, bottom: 0 } });
  if (!pdf.base64) throw new Error('Não foi possível preparar o PDF. Tente gerar novamente.');
  // Um diretório por exportação evita sobrescrever propostas com o mesmo nome.
  const folder = new Directory(Paths.cache, `proposta-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
  folder.create();
  const destination = new File(folder, filename);
  destination.write(pdf.base64, { encoding: 'base64' });
  await onPrepared?.();
  await Sharing.shareAsync(destination.uri, { mimeType: 'application/pdf', UTI: 'com.adobe.pdf', dialogTitle: filename });
}

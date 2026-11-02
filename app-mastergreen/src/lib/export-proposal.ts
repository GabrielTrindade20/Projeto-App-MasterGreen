import { Asset } from 'expo-asset';
import { Directory, File, Paths } from 'expo-file-system';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export async function getBannerUri() {
  const asset = Asset.fromModule(require('../../assets/mastergreen/logo.png'));
  await asset.downloadAsync();
  const uri = asset.localUri ?? asset.uri;
  // Android production bundle may expose the asset through a non-absolute URI
  // (e.g. "asset:///…"), which FileSystem SDK 57 rejects. Fetch bytes instead.
  if (uri.startsWith('file://')) {
    return `data:image/png;base64,${await new File(uri).base64()}`;
  }
  const response = await fetch(uri);
  const blob = await response.blob();
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1] ?? '');
    reader.onerror = () => reject(reader.error ?? new Error('Falha ao ler logo.'));
    reader.readAsDataURL(blob);
  });
  return `data:image/png;base64,${base64}`;
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

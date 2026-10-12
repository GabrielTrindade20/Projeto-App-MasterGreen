import { Asset } from 'expo-asset';
import { Directory, File, Paths } from 'expo-file-system';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export async function getBannerUri() {
  const asset = Asset.fromModule(require('../../assets/mastergreen/logo.png'));
  await asset.downloadAsync();
  return `data:image/png;base64,${await new File(asset.localUri ?? asset.uri).base64()}`;
}

export async function exportProposal(html: string, filename: string, preview: boolean, onPrepared?:()=>Promise<void>) {
  if (preview) {
    await Print.printAsync({ html });
    return;
  }
  if (!(await Sharing.isAvailableAsync())) {
    throw new Error('O compartilhamento não está disponível neste aparelho. Use Visualizar PDF.');
  }
  // Expo Go can place Print's temporary file outside FileSystem's scoped cache.
  // Receive the bytes from Print instead of copying a URI without READ permission.
  const pdf = await Print.printToFileAsync({ html, base64: true });
  if (!pdf.base64) throw new Error('Não foi possível preparar o PDF. Tente gerar novamente.');
  // Um diretório por exportação evita sobrescrever propostas com o mesmo nome.
  const folder = new Directory(Paths.cache, `proposta-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
  folder.create();
  const destination = new File(folder, filename);
  destination.write(pdf.base64, { encoding: 'base64' });
  await onPrepared?.();
  await Sharing.shareAsync(destination.uri, { mimeType: 'application/pdf', UTI: 'com.adobe.pdf', dialogTitle: filename });
}

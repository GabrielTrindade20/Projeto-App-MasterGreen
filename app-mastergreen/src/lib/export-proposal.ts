import { Asset } from 'expo-asset';
import { Directory, File, Paths } from 'expo-file-system';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export async function getBannerUri() {
  const asset = Asset.fromModule(require('../../assets/mastergreen/banner.jpeg'));
  await asset.downloadAsync();
  return `data:image/jpeg;base64,${await new File(asset.localUri ?? asset.uri).base64()}`;
}

export async function exportProposal(html: string, filename: string, preview: boolean) {
  if (preview) {
    await Print.printAsync({ html });
    return;
  }
  if (!(await Sharing.isAvailableAsync())) {
    throw new Error('O compartilhamento não está disponível neste aparelho. Use Visualizar PDF.');
  }
  const pdf = await Print.printToFileAsync({ html });
  // Um diretório por exportação evita sobrescrever propostas com o mesmo nome.
  const folder = new Directory(Paths.cache, `proposta-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
  folder.create();
  const destination = new File(folder, filename);
  await new File(pdf.uri).copy(destination);
  await Sharing.shareAsync(destination.uri, { mimeType: 'application/pdf', UTI: 'com.adobe.pdf', dialogTitle: filename });
}

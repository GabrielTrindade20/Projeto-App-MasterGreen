import { Asset } from 'expo-asset';

export async function getBannerUri() {
  return Asset.fromModule(require('../../assets/mastergreen/banner.jpeg')).uri;
}

export async function exportProposal(html: string, _filename: string, _preview: boolean) {
  // Expo Print no navegador imprime a página atual. O iframe isola o documento da proposta.
  const frame = document.createElement('iframe');
  frame.title = 'Proposta MasterGreen';
  frame.style.cssText = 'position:fixed;width:0;height:0;border:0;left:-9999px;';
  await new Promise<void>((resolve, reject) => {
    frame.onload = () => {
      const previewWindow = frame.contentWindow;
      if (!previewWindow) { frame.remove(); reject(new Error('Não foi possível abrir a proposta.')); return; }
      previewWindow.onafterprint = () => frame.remove();
      previewWindow.focus();
      previewWindow.print();
      resolve();
    };
    frame.srcdoc = html;
    document.body.appendChild(frame);
  });
}

import fs from 'fs';
import path from 'path';
import { generateThemeContent } from "./themeTemplate.js";

export function createFilesLocal({
  nameClient,
  colorPrimary,
  colorSecondary,
  logoPath,
  bgPath,
  formAlignment,
  __dirname
}){
  const localAssetsPath = path.join(__dirname, 'classroom', 'src', 'assets', nameClient, 'img');
  const localThemesPath = path.join(__dirname, 'classroom', 'src', 'scss', 'themes');
  const localThemeFile = path.join(localThemesPath, `_themes_${nameClient}.scss`);

  [localAssetsPath, localThemesPath].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Criado: ${dir}`);
    }
  });

  const logoFileName = path.basename(logoPath);
  const logoDestination = path.join(localAssetsPath, logoFileName);

  fs.copyFileSync(logoPath, logoDestination);
  console.log(`Arquivo copiado para: ${logoDestination}`);

  if (bgPath) {
    const bgFileName = path.basename(bgPath);
    const bgDestination = path.join(localAssetsPath, bgFileName);
    fs.copyFileSync(bgPath, bgDestination);
    console.log(`Arquivo copiado para: ${bgDestination}`);
  }

  const themeContent = generateThemeContent({
    nameClient,
    colorPrimary,
    colorSecondary,
    logoFileName,
    bgPath: bgPath ? path.basename(bgPath) : null,
    formAlignment,
  });

  fs.writeFileSync(localThemeFile, themeContent);
  console.log(`Arquivo de tema criado: ${localThemeFile}`);
}
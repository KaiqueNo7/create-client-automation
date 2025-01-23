import { input, select } from '@inquirer/prompts';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { generateThemeContent } from './themeTemplate.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createClient() {
  const nameClient = await input({
    message: 'Qual é o nome do cliente?',
    validate: (input) => input ? true : 'O nome do cliente não pode estar vazio.',
  });

  const colorPrimary = await input({
    message: 'Qual é a cor primária do cliente? (Ex: #1976d2)',
    validate: (input) =>
      /^#([0-9A-F]{3}|[0-9A-F]{6})$/i.test(input)
        ? true
        : 'Por favor, insira uma cor válida em formato hexadecimal.',
  });

  const colorSecondary = await input({
    message: 'Qual é a cor secundária do cliente? (Ex: #f57c00)',
    validate: (input) =>
      /^#([0-9A-F]{3}|[0-9A-F]{6})$/i.test(input)
        ? true
        : 'Por favor, insira uma cor válida em formato hexadecimal.',
  });

  const formAlignment = await select({
    message: 'Qual é a alinhamento do formulário?',
    choices: [
      { name: 'Esquerda', value: 'left' },
      { name: 'Centro', value: 'center' },
      { name: 'Direita', value: 'right' },
    ],
  });

  const logoPath = await input({
    message: 'Insira o caminho completo para o arquivo da logo do cliente (SVG, PNG ou JPG):',
    validate: (input) => fs.existsSync(input) ? true : 'O caminho do arquivo é inválido. Por favor, insira um caminho válido.',
  });

  const bgPath = await input({
    message: 'Insira o caminho completo para o arquivo de background do login (opcional, pressione Enter para ignorar):',
    validate: (input) => input === '' || fs.existsSync(input) ? true : 'O caminho do arquivo é inválido. Por favor, insira um caminho válido.',
  });

  const assetsPath = path.join(__dirname, 'classrom', 'src', 'assets', nameClient, 'img');
  const themesPath = path.join(__dirname, 'classrom', 'src', 'scss', 'themes');
  const themeFile = path.join(themesPath, `_themes_${nameClient}.scss`);

  [assetsPath, themesPath].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Criado: ${dir}`);
    }
  });

  const logoFileName = path.basename(logoPath);
  const logoDestination = path.join(assetsPath, logoFileName);
  fs.copyFileSync(logoPath, logoDestination);
  console.log(`Arquivo copiado para: ${logoDestination}`);

  if (bgPath) {
    const bgFileName = path.basename(bgPath);
    const bgDestination = path.join(assetsPath, bgFileName);
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

  fs.writeFileSync(themeFile, themeContent);
  console.log(`Arquivo de tema criado: ${themeFile}`);

  console.log('Rodando o comando "npm run build"...');
  exec('npm run build', { cwd: path.join(__dirname, 'classrom') }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Erro ao rodar o build: ${error.message}`);
      return;
    }

    if (stderr) {
      console.error(`Erro no processo de build: ${stderr}`);
    }

    console.log(`Build finalizado com sucesso: \n${stdout}`);
  });

  console.log(`Estrutura completa criada para o cliente: ${nameClient}`);
}

createClient()
  .then(() => console.log("Processo finalizado com sucesso!"))
  .catch((err) => console.error("Erro ao executar o script:", err));

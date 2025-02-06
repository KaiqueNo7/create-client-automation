import { input, select } from '@inquirer/prompts';
import fs from 'fs';
import path from 'path';
import { exec, execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { env } from 'process';
import dotenv from 'dotenv';
import { generateThemeContent } from './themeTemplate.js';
import { generateEnvClassroom } from './envClassroom.js';

dotenv.config();

function loadHistory() {
  try {
    if (fs.existsSync(historyFilePath)) {
      const data = fs.readFileSync(historyFilePath, 'utf-8');
      return JSON.parse(data || '{}');
    }
  } catch (error) {
    console.warn('Erro ao carregar o histórico, utilizando valores padrão:', error.message);
  }
  return {};
}

function saveHistory(history) {
  fs.writeFileSync(historyFilePath, JSON.stringify(history, null, 2));
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const historyFilePath = path.resolve(__dirname, 'history.json');
const localPath = path.join(__dirname, 'classroom');
const localEnvFile = path.join(localPath, `.env`);

async function createClient() {
  const history = loadHistory();

  const nameClient = await input({
    message: 'Qual é o nome do cliente?',
    default: history.nameClient || '',
    validate: (input) => input ? true : 'O nome do cliente não pode estar vazio.',
  });

  const colorPrimary = await input({
    message: 'Qual é a cor primária do cliente? (Ex: #123456)',
    default: history.colorPrimary || '',
    validate: (input) =>
      /^#([0-9A-F]{3}|[0-9A-F]{6})$/i.test(input)
        ? true
        : 'Por favor, insira uma cor válida em formato hexadecimal.',
  });

  const colorSecondary = await input({
    message: 'Qual é a cor secundária do cliente? (Ex: #123456)',
    default: history.colorSecondary || '',
    validate: (input) =>
      /^#([0-9A-F]{3}|[0-9A-F]{6})$/i.test(input)
        ? true
        : 'Por favor, insira uma cor válida em formato hexadecimal.',
  });

  const formAlignment = await select({
    message: 'Qual é o alinhamento do formulário?',
    choices: [
      { name: 'Esquerda', value: 'left' },
      { name: 'Centro', value: 'center' },
      { name: 'Direita', value: 'right' },
    ],
    default: history.formAlignment || 'center',
  });

  const logoPath = await input({
    message: 'Insira o caminho completo para o arquivo da logo do cliente (SVG, PNG ou JPG):',
    default: history.logoPath || '',
    validate: (input) => fs.existsSync(input) ? true : 'O caminho do arquivo é inválido. Por favor, insira um caminho válido.',
  });

  const bgPath = await input({
    message: 'Insira o caminho completo para o arquivo de background do login (opcional, pressione Enter para ignorar):',
    default: history.bgPath || '',
    validate: (input) => input === '' || fs.existsSync(input) ? true : 'O caminho do arquivo é inválido. Por favor, insira um caminho válido.',
  });

  const newHistory = { nameClient, colorPrimary, colorSecondary, formAlignment, logoPath, bgPath };
  saveHistory(newHistory);

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

  const envClassroom = generateEnvClassroom({nameClient});

  fs.writeFileSync(localEnvFile, envClassroom);
  console.log(`Arquivo de configuração criado: ${localEnvFile}`);
  
  console.log('Criando visualização do template');
  try {
    // 🟢 Troca a versão do Node antes de rodar
    execSync('source $HOME/.nvm/nvm.sh && nvm use 14', { cwd: localPath, stdio: 'inherit', shell: '/bin/bash' });

    // 🟢 Inicia o servidor do template (`npm run dev`) em um processo separado
    const devProcess = spawn('bash', ['-c', 'source $HOME/.nvm/nvm.sh && nvm use 14 && npm run dev'], {
      cwd: localPath,
      stdio: 'inherit',
      detached: true, // Permite que continue rodando separadamente
    });

    // 🟢 Aguarda decisão do usuário
    const templateOk = await select({
      message: 'Você deseja continuar?',
      choices: [
        { name: 'Sim', value: 'yes' },
        { name: 'Não', value: 'no' },
      ],
    });

    if (templateOk === 'no') {
      console.log('Encerrando o servidor...');
      process.kill(-devProcess.pid); // Mata o processo e subprocessos corretamente
      process.exit(1);
    }

  } catch (error) {
    console.error(`Erro ao criar o template localmente: ${error.message}`);
    process.exit(1);
  }

  const sendFiles = await select({
    message: 'Deseja enviar os arquivos para o projeto front-end?',
    choices: [
      { name: 'Sim', value: 'yes' },
      { name: 'Não', value: 'no' },
    ],
  });

  if (sendFiles === 'yes') {
    const scireFrontEndPath = env.SCIRE_FRONTEND_PATH || path.resolve(__dirname, '..', 'scire-front-end');
    const targetAssetsPath = path.join(scireFrontEndPath, 'classroom', 'src', 'assets', nameClient, 'img');
    const targetThemesPath = path.join(scireFrontEndPath, 'classroom', 'src', 'scss', 'themes');
    const targetThemeFile = path.join(targetThemesPath, `_themes_${nameClient}.scss`);

    [targetAssetsPath, targetThemesPath].forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Criado: ${dir}`);
      }
    });

    fs.copyFileSync(logoDestination, path.join(targetAssetsPath, logoFileName));
    console.log(`Logo copiada para: ${targetAssetsPath}`);

    if (bgPath) {
      fs.copyFileSync(path.join(localAssetsPath, path.basename(bgPath)), path.join(targetAssetsPath, path.basename(bgPath)));
      console.log(`Background copiado para: ${targetAssetsPath}`);
    }

    fs.copyFileSync(localThemeFile, targetThemeFile);
    console.log(`Arquivo de tema copiado para: ${targetThemeFile}`);

    const createPR = await select({
      message: 'Deseja criar uma nova branch e iniciar uma PR?',
      choices: [
        { name: 'Sim', value: 'yes' },
        { name: 'Não', value: 'no' },
      ],
    });
  
    if (createPR === 'yes') {
      const branchName = await input({
        message: 'Qual é o nome da branch?',
        validate: (input) => input ? true : 'O nome da branch não pode estar vazio.',
      });
  
      console.log(`Acessando o diretório: ${scireFrontEndPath}`);
      try {
        execSync('git checkout master', { cwd: scireFrontEndPath, stdio: 'inherit' });
        console.log('Branch alterada para master.');
  
        execSync('git pull', { cwd: scireFrontEndPath, stdio: 'inherit' });
        console.log('Repositório atualizado com git pull.');
  
        execSync(`git checkout -b feature/${branchName}`, { cwd: scireFrontEndPath, stdio: 'inherit' });
        console.log(`Nova branch criada: feature/${branchName}`);
  
        execSync(` git push --set-upstream origin feature/${branchName}`, { cwd: scireFrontEndPath, stdio: 'inherit' });
        console.log(`Push criado para a branch: feature/${branchName}`);
      } catch (error) {
        console.error(`Erro ao manipular o repositório Git: ${error.message}`);
        process.exit(1);
      }
    }
  
    console.log(`Estrutura completa criada para o cliente: ${nameClient}`);
  }
}

createClient()
  .then(() => console.log("Processo finalizado com sucesso!"))
  .catch((err) => console.error("Erro ao executar o script:", err));

import fs from "fs";
import chalk from 'chalk';
import inquirer from "inquirer";

interface Perfil {
  nome: string;
  lugar: "Paris" | "Nova York" | "Tóquio" | "Rio de Janeiro"  | "Outro";
  aviao: boolean;
}

function salvarPerfil(novoPerfil: Perfil): void {
   console.log(chalk.yellow('Verificando banco de dados...'));

  const dbFile: string = `src/database/data.json`;

  let perfisDoBanco: Perfil[] = [];

  try {
    const conteudoDoArquivo = fs.readFileSync(dbFile, "utf-8");
    perfisDoBanco = JSON.parse(conteudoDoArquivo);
  } catch (erro: any) {
    if (erro.code !== "ENOENT") {
      throw erro;
    }
  }

  const perfilExistente = perfisDoBanco.find(
    (perfil) => perfil.nome.toLowerCase() === novoPerfil.nome.toLowerCase()
  );

  if (perfilExistente) {
    throw new Error(`O nome '${novoPerfil.nome}' já está cadastrado.`);
  }

  perfisDoBanco.push(novoPerfil);
  const novoConteudo = JSON.stringify(perfisDoBanco, null, 2);
  fs.writeFileSync(dbFile, novoConteudo, "utf-8");

  console.log(chalk.green('Perfil inserido com sucesso!'));
}

async function run(): Promise<void> {
  try {
    console.log(chalk.magenta('Bem-vindo ao Criador de Perfil Interativo!'));
    
    const perguntas = [
      {
        type: "input",
        name: "nome",
        message: "Qual é o seu nome?",
        validate: (input: string): boolean | string => {
          if (input.trim() === "") {
            return "Por favor, digite um nome.";
          }
          return true;
        },
      },
      {
        type: "list",
        name: "lugar",
        message: "Qual desses lugares você gostaria de visitar?",
        choices: ["Paris" , "Nova York" , "Tóquio" , "Rio de Janeiro" , "Outro"],
      }, 
      {
        type: "confirm",
        name: "aviao",
        message: "Você já viajou de avião?",
        default: true,
      },
    ] as const;

    const respostas = await inquirer.prompt<Perfil>(perguntas as any);

    console.log(chalk.yellow('Bem-vindo ao Criador de Perfil Interativo!'));
    console.log(respostas);
    console.log("---------------------\n");

    salvarPerfil(respostas);
  } catch (erro: unknown) {
    if (erro instanceof Error) {
      console.error(`Erro: ${erro.message}`);
    } else {
      console.error("Ocorreu um erro desconhecido:", erro);
    }
  }
}

run();

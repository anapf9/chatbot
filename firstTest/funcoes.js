const fs = require('fs')
const path = require('path')
const pdfparse = require('pdf-parse')

// 1
function lerDiretorio(caminho) {
  return new Promise((resolve, reject) => {
    try {
      let arquivos = fs.readdirSync(caminho)
      // arquivos = arquivos.map(arquivo => path.join(caminho, arquivo))
      console.log(arquivos, typeof arquivos[1])
      resolve(arquivos)
    } catch (e) {
      reject(e)
    }
  })
}

// 2 - verificaSeArquivoExiste
function verificaSeArquivoExiste(array, nomeDoArquivo) {
  const found = array.find(item => item === nomeDoArquivo)
  if (found) {
    console.log('o Arquivo existe, qual palavra deseja procurar em seguida?')
    const caminho = path.join(__dirname, '.', 'arquivos', nomeDoArquivo)
    return caminho
  } else {
    console.log('Nem um arquivo encontrado')
  }
}

// 3 - retorna a palavra desejada dentro do documento
// precisa integrar com um leitor de pdf onde encontre as paginas que contem a palavra mencionada
function findKey(caminhoDoArquivoEncontrado) {
  
}

function lerArquivo(caminho) {
  return new Promise((resolve, reject) => {
    try {
      const conteudo = fs.readFileSync(caminho)
      // console.log('conteudo', conteudo)
      pdfparse(conteudo)
        .then(function (data) {
        console.log(typeof data.text)
        }).catch(function (e) {
          console.log(e)
        })
      resolve(conteudo)
    } catch (e) {
      reject(e)
    }
  })
}

module.exports = {
  lerDiretorio,
  lerArquivo,
  verificaSeArquivoExiste,
}
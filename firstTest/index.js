const path = require('path')
const fn = require('./funcoes')

const caminho = path.join(__dirname, '.', 'arquivos')
fn.lerDiretorio(caminho)
  // .then(arrayArquivosEncontrados => fn.elementosTerminadosCom(arrayArquivosEncontrados, '.pdf'))
  .then(arrayArquivosEncontrados => fn.verificaSeArquivoExiste(arrayArquivosEncontrados, '2013_Book_ElectricalMachines.pdf'))
  .then(caminhoEncontrado => fn.lerArquivo(caminhoEncontrado))
  // .then(console.log)
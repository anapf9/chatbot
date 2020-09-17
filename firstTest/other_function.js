const apiCall = [
  {
    "titleFile": "Ana Paula",
    "keysWords": [
      "b", "B", "tipo", "sanguineo",
      "sanguíneo", "sangue"
    ],
    "localPath": "https://docs.google.com/document/d/1hjb7PV9ZvlwL-A-0aUpudS57sfG9P9g4UrJYa3rgxp0/edit?usp=sharing"
  },
  {
    "titleFile": "Fábio",
    "keysWords": [
      "b",
      "B",
      "tipo",
      "sanguineo",
      "sanguíneo",
      "sangue"
    ],
    "localPath": "https://docs.google.com/document/d/1hjb7PV9ZvlwL-A-0aUpudS57sfG9P9g4UrJYa3rgxp0/edit?usp=sharing"
  },
  {
    "titleFile": "José",
    "keysWords": [
      "a",
      "A",
      "tipo",
      "sanguineo",
      "sanguíneo",
      "sangue"
    ],
    "localPath": "https://docs.google.com/document/d/1hjb7PV9ZvlwL-A-0aUpudS57sfG9P9g4UrJYa3rgxp0/edit?usp=sharing"
  },
  {
    "titleFile": "Lorena",
    "keysWords": [
      "ab",
      "AB",
      "tipo",
      "sanguineo",
      "sanguíneo",
      "sangue"
    ],
    "localPath": "https://docs.google.com/document/d/1hjb7PV9ZvlwL-A-0aUpudS57sfG9P9g4UrJYa3rgxp0/edit?usp=sharing"
  },
  {
    "titleFile": "Larissa",
    "keysWords": [
      "b",
      "B",
      "tipo",
      "sanguineo",
      "sanguíneo",
      "sangue"
    ],
    "localPath": "https://docs.google.com/document/d/1hjb7PV9ZvlwL-A-0aUpudS57sfG9P9g4UrJYa3rgxp0/edit?usp=sharing"
  },
  {
    "titleFile": "George",
    "keysWords": [
      "O",
      "o",
      "tipo",
      "sanguineo",
      "sanguíneo",
      "sangue"
    ],
    "localPath": "https://docs.google.com/document/d/1hjb7PV9ZvlwL-A-0aUpudS57sfG9P9g4UrJYa3rgxp0/edit?usp=sharing"
  }
]
let findItens = []
function findEqual(input) {
  const arrayDatas = json2array(apiCall)
  const found = []
  for (let i = 0; i < arrayDatas.length; i++) {
    const arrayKeyWords = arrayDatas[i].keysWords
    // console.log(arrayKeyWords)
    let palavraAchada = arrayKeyWords.find(item => item === input)
    if (palavraAchada) {
      found.push(arrayDatas[i])
    }
  }
  justNamesInArray(found)
  return found
}

function justNamesInArray(array) {
  findItens = array.map(el => {
    return el.titleFile
  })
  // console.log('achados', findItens)
}

function json2array(json) {
  var result = [];
  var keys = Object.keys(json);
  keys.forEach(function (key) {
    result.push(json[key]);
  });
  return result;
}

function urlToPDF(input) {
  /// console.log('sa', findItens)
  let found = apiCall.find(el => el.titleFile === input)
  console.log('url', found)
  return found.localPath
}

function matches(params) {
  let re = /a|b|ab|o|A|B|AB|O/
  let mat = params.match('a' || 'b')
  console.log(mat != null || undefined)
  return mat
}

//console.log(findEqual('b'))
//console.log(urlToPDF('Larissa'))

console.log(matches('a'))

// other

const arrays = [
  '2013_Book_ElectricalMachines.pdf',
  '2014_Book_DataAnalysis.pdf',
  '2015_Book_DataStructuresAndAlgorithmsWit.pdf',
  '2015_Book_IntroductionToEvolutionaryComp.pdf',
  '2015_Book_UMLClassroom.pdf',
  '2016_Book_LinearAndNonlinearProgramming.pdf',
  '2017_Book_ElectronicsForEmbeddedSystems.pdf',
  '2017_Book_IntroductionToDataScience.pdf',
  '2018_Book_IntroductionToParallelComputin.pdf',
  '2018_Book_MathematicalLogic.pdf',
  '2018_Book_NeuralNetworksAndDeepLearning.pdf',
  '2019_Book_InternetOfThingsFromHypeToReal.pdf'
]

function test() {
  const newArr = []
  for (let i = 0; i < arrays.length; i++) {
    //console.log(arrays[i])
    let terminaComPDF = /.pdf$/
    let removePDF
    let test = arrays[i].match(terminaComPDF);
    if (test) {
      removePDF = arrays[i].split(".")
    }
    let aki = styleHyphenFormat(removePDF[0])
    let cadaUm = aki.split("_")
    // let aki = styleHyphenFormat(cadaUm[2])
    // console.log(aki)
    newArr.push(cadaUm)

  }
  return newArr
}

function styleHyphenFormat(propertyName) {
  function upperToHyphenLower(match, offset, string) {
    return (offset ? '_' : '') + match.toLowerCase();
  }
  return propertyName.replace(/[A-Z]/g, upperToHyphenLower);
}

console.log(test())
console.log(`lorena2.js ran at ${Date()}`)

runQAQC = function(data) {
  console.log(`lorena2.js Summary statistics function ran at ${Date()}`)

let h=`<p style= "color:red; font-weight:bold">Successfully processed table with ${Object.keys(data).length} columns x ${qaqc.data[Object.keys(data)[0]].length} rows</p>`
      h += `<p></p>`
//looping through JSOn objects
//https://stackoverflow.com/questions/800593/loop-through-json-object-list

//https://www.freecodecamp.org/forum/t/filtering-json-object/244160/3
let data1 = qaqc.dataArray

const filterCombiner = (d, filterArray) => {
  for (let fn of filterArray) {
    if (!fn(d)) {
      return false;
    }
  }
  return true;
}
const filterArrayCases = [
  d => d.status != 0
  //d => d.ageInt < 40,
]

const arrCases = data1.filter(d => filterCombiner(d, filterArrayCases))
console.log("arrCases", arrCases)
let totalCases1 = Object.keys(arrCases).pop()
let totalCases = Number(totalCases1)+1
h +=`<p style= "font-weight:bold">Cases: ${totalCases}<p/>`

const filterArrayControls = [
  d => d.status == 0
]

const arrControls = data1.filter(d => filterCombiner(d, filterArrayControls))
console.log('arrControls', arrControls)
let totalControls1 = Object.keys(arrControls).pop()
let totalControls = Number(totalControls1)+1
h +=`<p style= "font-weight:bold">Controls: ${totalControls}<p/>`

const filterArrayEurCas = [
  d => d.status != 0,
  d => d.ethnicityClass == 1
]

const arrEurCas = data1.filter(d => filterCombiner(d, filterArrayEurCas))
console.log('arrEurCas', arrEurCas)
let totalEurCas1 = Object.keys(arrEurCas).pop()
let totalEurCas = Number(totalEurCas1)+1
h +=`<p style= "font-weight:bold">European Ancestry Cases: ${totalEurCas}<p/>`

const filterArrayEurCon = [
  d => d.status == 0,
  d => d.ethnicityClass == 1
]

const arrEurCon = data1.filter(d => filterCombiner(d, filterArrayEurCon))
console.log('arrEurCon', arrEurCon)
let totalEurCon1 = Object.keys(arrEurCon).pop()
let totalEurCon = Number(totalEurCon1)+1
h +=`<p style= "font-weight:bold">European Ancestry Controls: ${totalEurCon}<p/>`

h += `<p>Save summary statistics below.<p/>`
        h += qaqc.saveFile(qaqc.csvJSON(qaqc.dataTxt))

        //debugger
        // ...
let ssArray = ["Consortia", "studyDesign", "study", "ethnicityClass", "status","statusTotal","age20.29","age30.39","age40.49","age50.59","age60.69","age70.79","age80.89","age90.99","ageDK	ER_statusIndex_pos","ER_statusIndex_neg","ER_statusIndex_DK","famHist_yes","famHist_no","famHist_DK"]
let inArray = ["studyType", "study", "ethnicityClass", "status", "ageInt","ER_statusIndex", "famHist"]
let dat = qaqc.data

 return h
    }

console.log(`lorena2.js ran at ${Date()}`)

runQAQC = function(data) {
  console.log(`lorena2.js Summary statistics function ran at ${Date()}`)

let h=`<p style= "color:red; font-weight:bold">Successfully processed table with ${Object.keys(data).length} columns x ${qaqc.data[Object.keys(data)[0]].length} rows</p>`
      h += `<p></p>`
//looping through JSOn objects
//https://stackoverflow.com/questions/800593/loop-through-json-object-list
for (let [key,value] of Object.entries(qaqc.data)){
    for (var i = 0; i < qaqc.data.length; i++) {
      console.log(key);
      }
}
// function printprops(obj){
//   for(var col in obj)
//     h +=`<p style= "color:red">${col+ ": " +obj[col] + "\n"}</p>`
//     }

// printprops(qaqc.data)


// function add(obj){
//   var eth = []
//   for(var col in obj){
//     if( col==="EthnicityClass")
//     //  eth=obj[col]
//       //eth= [...new Set(eth)]
//     //  h +=`<p style= "color:green">${col+ ": " +eth ": n "+ "\n"}</p>`
//     h +=`<p style= "color:green">${col+ ": " +obj[col] + "\n"}</p>`
//     //eth.append(column[row])
//     //console.log(obj[col])//append sort
// }
// }
// add(qaqc.data)

//////////////////////////////////////////////////////

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
h += '<p><p/>'

///////////////////////////////////////////////////////////////////
        h += `<p>Save summary statistics below.<p/>`
        h += qaqc.saveFile(qaqc.csvJSON(qaqc.dataTxt))
        //h += qaqc.saveFile(JSON.stringify(qaqc.data))


        //debugger
        // ...
let ssArray = ["Consortia", "studyDesign", "study", "ethnicityClass", "status","statusTotal","age20.29","age30.39","age40.49","age50.59","age60.69","age70.79","age80.89","age90.99","ageDK	ER_statusIndex_pos","ER_statusIndex_neg","ER_statusIndex_DK","famHist_yes","famHist_no","famHist_DK"]
let inArray = ["studyType", "study", "ethnicityClass", "status", "ageInt","ER_statusIndex", "famHist"]
let dat = qaqc.data
//dat["BCAC_ID"].forEach(function(val, index){console.log(index, val)})

// for (i=0; i<inArray.length;i++){console.log(inArray[i])}
// for (i=0; i<inArray.length;i++){
//   dat[inArray[i]].forEach(function(val, index){console.log(index, val)})}
  // for (i=0; i<inArray.length;i++){console.log(inArray[i],
  //   dat[inArray[i]])}

  //   for (i=0; i<inArray.length;i++){
  //     dat[inArray[i]].forEach(function(val, index)
  //     {console.log("working")})
      
  //     for (i=0; i<inArray.length;i++){
  //       dat[inArray[i]].forEach(function(val, index)
  //                               {if (inArray[i]=="status"){if (val===0){console.log("case")}}
  //                               })}
//https://stackoverflow.com/questions/5667888/counting-the-occurrences-frequency-of-array-elements?noredirect=1&lq=1
// function count_status(obj, variable,name1, num1, name2,  num2, name3, num3){
// var arr = obj[variable]
// var counts = {};
 
// for (var i = 0; i < arr.length; i++) {
//   var num = arr[i];
//   counts[num] = counts[num] ? counts[num] + 1 : 1;
//  }
// console.log(counts)
// let emptArr=[]
// emptArr.push(counts)

// for (let [key,value] of Object.entries(counts)){console.log(`${key}: ${value}`);}
// counts[name1]=counts[num1]
// delete counts[num1]
// counts[name2]=counts[num2]
// delete counts[num2]
// counts[name3]=counts[num3]
// delete counts[num3]
// console.log(counts)
// }
// count_status(qaqc.data, "status", "case",1,"control", 0, "case2", 2)
////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////
// https://stackoverflow.com/questions/24444738/sum-similar-keys-in-an-array-of-objects
// var holder = {};

// obj.forEach(function(d) {
//   if (holder.hasOwnProperty(d.name)) {
//     holder[d.name] = holder[d.name] + d.value;
//   } else {
//     holder[d.name] = d.value;
//   }
// });

// var obj2 = [];

// for (var prop in holder) {
//   obj2.push({ name: prop, value: holder[prop] });
// }

// console.log(obj2);
 return h
    }
// }
// for (const col in qaqc.data){
//     if (col.indexOf("") > -1) {
//       missing=""
//       h +=`<p style= "color:red">${col} column has missing data<p>`
///////////////////////////////////////////
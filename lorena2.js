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


function add(obj){
  var eth = []
  for(var col in obj){
    if( col==="EthnicityClass")
    //  eth=obj[col]
      //eth= [...new Set(eth)]
    //  h +=`<p style= "color:green">${col+ ": " +eth ": n "+ "\n"}</p>`
    h +=`<p style= "color:green">${col+ ": " +obj[col] + "\n"}</p>`
    //eth.append(column[row])
    //console.log(obj[col])//append sort
}
}
add(qaqc.data)

        h += '</p>'
        h += `<p>Save summary statistics below.<p/>`
        h += qaqc.saveFile(qaqc.csvJSON(qaqc.dataTxt))
        //h += qaqc.saveFile(JSON.stringify(qaqc.data))


        //debugger
        // ...
        return h
    }
// }
// for (const col in qaqc.data){
//     if (col.indexOf("") > -1) {
//       missing=""
//       h +=`<p style= "color:red">${col} column has missing data<p>`
///////////////////////////////////////////
dat["BCAC_ID"].forEach(function(val, index){console.log(index, val)})
let ssArray = ["Consortia", "studyDesign", "study", "ethnicityClass", "status","statusTotal","age20.29","age30.39","age40.49","age50.59","age60.69","age70.79","age80.89","age90.99","ageDK	ER_statusIndex_pos","ER_statusIndex_neg","ER_statusIndex_DK","famHist_yes","famHist_no","famHist_DK"]
let inArray = ["studyType", "study", "ethnicityClass", "status", "ageInt","ER_statusIndex", "famHist"]
for (i; i<inArray.length;i++){console.log(inArray[i])}


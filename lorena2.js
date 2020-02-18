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

function printprops(o){
  for(var p in o)
  //  console.log(p+ ": " +o[p] + "\n");
    h +=`<p style= "color:red">${p+ ": " +o[p] + "\n"}</p>`
    }
}
printprops(qaqc.data)

        h += '</p>'
        h += `<p>Save summary statistics below.<p/>`
        h += qaqc.saveFile(JSON.stringify(qaqc.data))


        //debugger
        // ...
        return h
    }
// }
// for (const col in qaqc.data){
//     if (col.indexOf("") > -1) {
//       missing=""
//       h +=`<p style= "color:red">${col} column has missing data<p>`

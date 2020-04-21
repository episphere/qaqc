console.log(`jonas.js loaded at ${Date()}`)

runQAQC=function(data){
    console.log(`jonas.js runQAQC function ran at ${Date()}`)
    let h=`<p>Table with ${Object.keys(data).length} columns x ${qaqc.data[Object.keys(data)[0]].length} rows</p>`
    h+='<p style="color:blue">List of variables'
    Object.keys(qaqc.data).forEach(k=>{
        h+=`<li style="color:blue">${k} (${qaqc.data[k].length} x ${typeof(qaqc.data[k][0])=='string' ? 'string' : 'number'})</li>`
    })
    h+='</p>'
    h+=qaqc.saveFile(JSON.stringify(qaqc.data))
    //debugger
    // ...
    return h
}
// dev http://localhost:8000/qaqc/?script=5&boxid=653087731560

runQAQC=function(data){
    console.log(`upset.js runQAQC function ran at ${Date()}`)
    let h=`<p>Table with ${Object.keys(data).length} columns x ${qaqc.data[Object.keys(data)[0]].length} rows</p>`
    h+='<p style="color:blue">Studies: <span style="color:brown">'
    upset.getStudies()
    upset.data.studies.forEach(s=>{
        h+=`<input type='checkbox' id="${s}_check" onchange="upset.count()" checked=true>${s.slice(6)}; `
    })
    h+='</span></p>'
    // table
    h+='<p style="color:blue">Constraints: <span style="color:green">'
    upset.data.parms.forEach(s=>{
        h+=`<input type='checkbox' id="${s}_parm" onchange="upset.count()">${s}; `
    })
    h+='</span></p>'
    h+='<hr>'
    h+='<div id="upsetCountDiv">'
    h+='</div>'
    setTimeout(upset.count,1000)
    return h
}

upset={
    data:{
        studies:[],
        parms:[]
    }
}

upset.getStudies=_=>{
    Object.keys(qaqc.data).forEach(x=>{
        if(x.match('study_')){
            upset.data.studies.push(x)
        }else{
            upset.data.parms.push(x)
        }
    })
    return upset.data.studies
}

upset.count=function(data=qaqc.data,div='upsetCountDiv'){
    if(typeof(div)=='string'){
        div=document.getElementById(div)
    }
    // count studies
    let n=qaqc.data[upset.data.studies[0]].length
    upset.data.studiesArray=[...Array(n)].map((_,i)=>0)
    upset.data.studies.forEach(s=>{
        let ip = document.getElementById(s+'_check')
        if(ip.checked){
            upset.data.studiesArray=upset.data.studiesArray.map((x,i)=>{
                return x||data[s][i]
            })
        }
        //debugger
    })
    let h = `# individuals in studies selected: ${upset.data.studiesArray.reduce((a,b)=>a+b)}`
    div.innerHTML=h
}

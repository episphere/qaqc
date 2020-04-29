// dev http://localhost:8000/qaqc/?script=5&boxid=653087731560

runQAQC=function(data){
    console.log(`upset.js runQAQC function ran at ${Date()}`)
    let h=`<table align="left"><tr><td vAlign="bottom" style="white-space:nowrap">`
    h+=`<p>Data: ${Object.keys(data).length}x${qaqc.data[Object.keys(data)[0]].length}, demo:<a href="https://www.youtube.com/watch?v=Asi0jMGz3fQ" target="_blank" style="background-color:yellow">YouTube</a></p>`
    h+='<p style="color:blue">Studies: <br><span style="color:brown">'
    upset.getStudies()
    upset.data.studies.forEach(s=>{
        h+=`<input type='checkbox' id="${s}_check" onchange="upset.count()" checked=true>${s.slice(6)}; `
    })
    h+='</span></p>'
    // table
    h+='<p style="color:blue">Constraints: <span style="color:green">'
    upset.data.parms.forEach((s,i)=>{
        h+=`<br>${i+1}.<input type='checkbox' id="${s}_parm" onchange="upset.check('${s}');upset.count()">${s} (<span id="${s}_count" style="color:gray"></span>); `
    })
    h+='</span></p>'
    h+='</td><td vAlign="bottom" width=100><div id="constrainedPlotly"></div></td><td vAlign="bottom" align="left"><div id="constrainingPlotly"></div></td></tr>'
    h+='<tr><td vAlign="top" style="white-space:nowrap">'
    h+='<hr>'
    h+='<div id="upsetCountDiv">'
    h+='</div>'
    h+='</td><td vAlign="top" colspan=2><div id="upsetTableDiv"></td>'
    h+='</tr>'
    h+='</table>'
    setTimeout(upset.count,1000)
    return h
}
    

upset={
    data:{
        studies:[],
        parms:[],
        selectedParms:[]
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
    // count with all constraints
    upset.data.countAll=upset.data.studiesArray
    // ... update count so far
    upset.data.countConstrained=[{total:upset.data.studiesArray.reduce((a,b)=>a+b)}]

    let h = `<p style="color:navy"><span style="color:maroon"># individuals in the studies selected: (<span style="color:blue">${upset.data.countConstrained[0].total}</span>)</span>`
    console.log(upset.data.selectedParms)
    upset.data.selectedParms.forEach((p,i)=>{
        upset.data.countAll=upset.data.countAll.map((x,i)=>{
            return x&data[p][i]
        })
        let c = {}
        c[p]=upset.data.countAll.reduce((a,b)=>a+b)
        upset.data.countConstrained.push(c)
        h+=`<br>${i+1}. with ${p.replace(' available','')}: (<span style="color:blue">${c[p]}</span>)`
    })
    upset.data.countParms={}
    upset.data.parms.forEach(s=>{
        let c = document.getElementById(s+'_count')
        upset.data.countParms[s]=upset.data.countAll.map((x,i)=>{
            return x&data[s][i]
        }).reduce((a,b)=>a+b)
        c.textContent=upset.data.countParms[s]
    })
    h+='</p>'
    div.innerHTML=h
    upset.constrainingPlotly()
    upset.constrainedPlotly()
}

upset.check=(s)=>{
    if(upset.data.selectedParms.indexOf(s)==-1){
        upset.data.selectedParms.push(s)
    }else{
        let ind=upset.data.selectedParms.indexOf(s)
        upset.data.selectedParms=upset.data.selectedParms.slice(0,ind).concat(upset.data.selectedParms.slice(ind+1))
        //debugger
    }
}

upset.constrainingPlotly=_=>{
    let trace={
        x:[],
        y:[],
        text:[],
        type: 'bar',
        orientation: 'h',
        textposition:"inside",
        width:0.9,
    }
    upset.data.parms.forEach((p,i)=>{
        trace.x.push(upset.data.countParms[p])
        trace.y.push(i+1)
        trace.text.push(p)
    })
    Plotly.newPlot('constrainingPlotly',[trace],{
        //height: 35*upset.data.parms.length,
        height:300,
        width: 300,
        yaxis: {autorange: 'reversed'},
        xaxis:{
            title:'# selected individuals with attribute'
        },
        margin: {
            l: 20,
            r: 5,
            b: 40,
            t: 10,
            pad: 4
        }
    })
}

upset.constrainedPlotly=_=>{
    let trace={
        type:'scatter',
        x:[],
        y:[],
        //text:[],
        //mode: 'lines+markers+text',
        mode: 'lines+markers',
        line:{
            color:'blue'
        }
    }
    let annotations=[]
    upset.data.countConstrained.forEach((x,i)=>{
        let L = Object.keys(upset.data.countConstrained[i])[0]
        trace.x.push(i)
        //trace.text.push(L)
        trace.y.push(x[L])
        annotations.push({
            showarrow: false,
            x: i,
            y: x[L],
            text:`${upset.data.parms.indexOf(L)+1}. ${L}`,
            textangle:-30,
            font: {
                color: 'green',
                size:14
            }
        })
        annotations[0].text='Total'
        annotations[0].font.color='maroon'

    })
    let layout={
        height: 300,
        width: 200,
        margin: {
            l: 60,
            r: 5,
            b: 20,
            t: 10,
            pad: 4
        },
        annotations:annotations
    }
    if(upset.data.selectedParms.length>0){
        layout.yaxis={
            title:'cohort size (# individuals)'
        }
        layout.width=Math.min(450,200+40*upset.data.selectedParms.length)
        layout.margin.l=50
    }
    Plotly.newPlot('constrainedPlotly',[trace],layout)
    setTimeout(upset.table,1000)
}

upset.table=(div='upsetTableDiv')=>{
    if(typeof(div)=='string'){
        div=document.getElementById(div)
    }
    /*
    let fac=(n,p=1)=>{
        if(n>1){return fac(n-1,p*n)}
        else{return p}
    }
    let comb=(n,k)=>fac(n)/(fac(n-k)*fac(k))
    let n=0 // number of combinations
    */
    let m=upset.data.parms.length-2
    //for(var i=1;i<=m;i++){n+=comb(m,i)}
    let n=2**m
    upset.baseStr=[... Array(m+1)].map(_=>'0').join('')
    int2bin=function(x,baseStr=upset.baseStr){
        let i = Math.floor(Math.log2(x))
        baseStr=baseStr.split('')
        baseStr[baseStr.length-i-1]='1'
        //baseStr[i]='1'
        baseStr=baseStr.join('')
        x = x-2**i
        if(x>0){
            return int2bin(x,baseStr)
        }else{
            return baseStr
        }
    }
    upset.values=[]
    for(var i=1;i<=2**m;i++){
        upset.values[i]={
            str:int2bin(i),
            count:0
        }
    }
    h='<hr><table>'
    // headers
    //h+='<tr>'
    for(let i=2;i<m+2;i++){
        h+='<tr>'
        h+=`<td style="color:green" align="left">${i+1}.${upset.data.parms[i].slice(0,upset.data.parms[i].indexOf('_'))}</td>`
        for(let j=1;j<=2**m;j++){
            if(upset.values[j].str[i]=='0'){h+=`<td>&#9898;</td>`}
            else {h+=`<td>&#9899;</td>`}
        }
        //h+=`<td style="writing-mode:vertical-lr;transform:rotate(-90deg);transform-origin:top right">${upset.data.parms[i].slice(0,upset.data.parms[i].indexOf('_'))}</td>`
        h+='</tr>'
    }
    h+='</table>'
    div.innerHTML=h
    return div
}

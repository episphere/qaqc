console.log(`GWAS_explorer.js ran at ${Date()}`)

runQAQC = function (data) {
  console.log(`GWAS_explorer.js runQAQC function ran at ${Date()}`)

  let h=''
  h+= `<script type="module">
  import {Runtime, Inspector} from "https://cdn.jsdelivr.net/npm/@observablehq/runtime@4/dist/runtime.js";
  import define from "https://api.observablehq.com/@episphere/plco.js?v=3";`
  new Runtime().module(define, name => {
    if (name === "plot1") return new Inspector(document.querySelector("#observablehq-plot1-0ee3af29"));
  });  
  h+=`</script>`
 
  // h+=`<p>Data: ${Object.keys(data).length}x${qaqc.data[Object.keys(data)[0]].length}, demo:<a href="https://www.youtube.com/watch?v=Asi0jMGz3fQ" target="_blank" style="background-color:yellow">YouTube</a></p>`
  // // new table
  
  // h+='<p style="color:blue">Studies: <br><span style="color:brown">'
  //     upset.getStudies()
  //     upset.data.studies.forEach(s=>{
  //         h+=`<input type='checkbox' id="${s}_check" onchange="upset.count()" checked=true>${s.slice(6)}; `
  //     })
  // h+='</span></p>'


  
//plot1 = {
    // let div = DOM.element('div');
    // let ip = DOM.element('input');
    // let p = DOM.element('p');
    // p.innerHTML = 'Chromossome: ';
    // p.appendChild(ip);
    // ip.value = 1;
    // ip.type = 'number';
    // ip.style.width = '50px';
    // let divPlot = DOM.element('div'); // plot in this division
    // div.appendChild(divPlot);
    // div.appendChild(p);
    // ip.onchange = _ => {
    //   if (ip.value < 1) {
    //     ip.value = 1;
    //   } else if (ip.value > 22) {
    //     ip.value = 22;
    //   } else {
    //     // prepare plotly
    //     let xx = breastCancerEastAsia.data.filter(x => x[4] == ip.value);
    //     let trace = {
    //       x: xx.map(x => parseInt(x[5])), // position
    //       y: xx.map(x => parseFloat(x[6])), // -logp
    //       mode: 'markers',
    //       type: 'scatter',
    //       marker: {
    //         symbol: 3,
    //         size: 5
    //       }
    //     };
    //     let layout = {
    //       title: `Chromossome ${ip.value}`,
    //       xaxis: {
    //         title: 'position'
    //       },
    //       yaxis: {
    //         title: '-log(p)'
    //       }
    //     };
    //     Plotly.newPlot(divPlot, [trace], layout);
    //   }
    // };
    // ip.onchange();
    // div.appendChild(p);
    // //div.innerHTML = `# of records: ${breastCancerEastAsia.data.length}`;
    // return div;
 // }

}
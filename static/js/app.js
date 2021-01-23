//Create function to build metadata
function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata= data.metadata;
      var resultsarray= metadata.filter(sampleobject => sampleobject.id == sample);
      var result= resultsarray[0]
      var PANEL = d3.select("#sample-metadata");
      PANEL.html("");
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key}: ${value}`);
      });
    
    });

  }

//Create function to build charts
function buildCharts(sample) {

  //Load sample data using d3.js
  d3.json("samples.json").then((data) => {
    var samples= data.samples;
    var resultsarray= samples.filter(sampleobject => sampleobject.id == sample);
    var result= resultsarray[0]

    var ids = result.otu_ids;
    var labels = result.otu_labels;
    var values = result.sample_values;

    //Build horizontal bar chart using sample data  
    var barData =[
      {
        y:ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
        x:values.slice(0,10).reverse(),
        text:labels.slice(0,10).reverse(),
        type:"bar",
        orientation:"h"
      }
    ];

    var barLayout = {
      title: "Top 10 Microbial Species Found per Individual",
      margin: { t: 80, l: 150 }
    };

    Plotly.newPlot("bar", barData, barLayout);

    //Build bubble chart using sample data
    var bubbleData = [
      {
        x: ids,
        y: values,
        text: labels,
        mode: "markers",
        marker: {
          color: ids,
          size: values,
          }
      }
    ];

    var bubbleLayout = {
      margin: { t: 0 },
      xaxis: { 
        title: "OTU ID",
        gridcolor: 'white',
        type:'log',
        gridwidth:2
      },
      yaxis: {
        gridcolor: 'white',
        gridwidth:2
      },
      hovermode: "closest",
      paper_bgcolor:'rgb(229, 236, 246)',
      plot_bgcolor: 'rgb(229, 236, 246)'
      };

    Plotly.plot("bubble", bubbleData, bubbleLayout);

  });

}
   
 
function init() {
  //Establish reference to dropdown select element
  var selector = d3.select("#selDataset");

  //Populate options using sample names
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    //Build plots using first sample entry
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  //Fetch new data whenever a different option is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

//Initialize dashboard
init();
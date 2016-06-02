


var nodes, edges, network;
var startpages = [];

var needsreset = true;

var container = document.getElementById('container');
//Global options
var options = {
  nodes: {
    shape: 'dot',
    scaling: { min: 20,max: 30,
      label: { min: 14, max: 30, drawThreshold: 9, maxVisible: 20 }
    },
    font: {size: 14, face: 'Helvetica Neue, Helvetica, Arial'}
  },
  interaction: {
    hover: true,
    hoverConnectedEdges: false,
    selectConnectedEdges: true,
  },
};

var nodes = new vis.DataSet();
var edges = new vis.DataSet();
var data = {nodes:nodes,edges:edges};
var initialized = false;


//Make the network
function makeNetwork() {
  network = new vis.Network(container,data,options);
  bindNetwork();
  initialized=true;
}


//Reset the network to be new each time.
function resetNetwork(start) {
  if (!initialized) makeNetwork();
  var startID = getNeutralId(start);
  startpages = [startID]; // Register the page as an origin node
  tracenodes = [];
  traceedges = [];

  // Change "go" button to a refresh icon
  document.getElementById("submit").innerHTML = '<i class="icon ion-refresh"> </i>';

  // -- CREATE NETWORK -- //
  //Make a container
  nodes = new vis.DataSet([
    {id:startID, label:wordwrap(decodeURIComponent(start),20), value:2, level:0,
     color:getColor(0), x:0, y:0, parent:startID} //Parent is self
  ]);
  edges = new vis.DataSet();
  //Put the data in the container
  data = {nodes:nodes,edges:edges};
  network.setData(data);
}


// Add a new start node to the map.
function addStart(start, index) {
  if (needsreset) {
    // Delete everything only for the first call to addStart by tracking needsreset
    resetNetwork(start);
    needsreset = false;
    return;

  } else {
    var startID = getNeutralId(start);
    startpages.push(startID);
    nodes.add([
      {id:startID, label:wordwrap(decodeURIComponent(start),20), value:2, level:0,
      color:getColor(0), x:0, y:0, parent:startID} // Parent is self
    ]);
  }
}

// Reset the network with content from a JSON string
function resetNetworkFromJson(data) {
  var obj = networkFromJson(data);
  nodes = obj.nodes;
  edges = obj.edges;
  startpages = obj.startpages;
  network.setData({nodes:nodes, edges:edges});
}

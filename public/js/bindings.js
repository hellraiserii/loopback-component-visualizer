// This script contains the code that binds actions to events, both within the
// network, in the search bar, and for the modal popup.


// Have changes been made
var changesmade = false;
var inputBox;

//Functions that will be used as bindings
function expandEvent (params) { // Expand a node (with event handler)
  if (params.nodes.length) { //Did the click occur on a node?
    var page = params.nodes[0]; //The id of the node clicked
    expandNode(page);
  }
}

function mobileTraceEvent (params) { // Trace back a node (with event handler)
  if (params.nodes.length) { //Was the click on a node?
    //The node clicked
    var page = params.nodes[0];
    //Highlight in blue all nodes tracing back to central node
    traceBack(page);
  } else {
    resetProperties();
  }
}

function openPageEvent (params) {
  if (params.nodes.length) {
    var nodeid = params.nodes[0];
    var page = encodeURIComponent(unwrap(nodes.get(nodeid).label));
    var url = "http://en.wikipedia.org/wiki/"+page;
    window.open(url, '_blank');
  }
}

// Bind the network events
function bindNetwork(){
  if (isTouchDevice) { // Device has touchscreen
    network.on("hold", expandEvent); // Long press to expand
    network.on("click", mobileTraceEvent); // Highlight traceback on click
  } else { // Device does not have touchscreen
    network.on("click", expandEvent); // Expand on click
    network.on("hoverNode", function(params){ // Highlight traceback on hover
      traceBack(params.node);
    });
    network.on("blurNode", resetProperties); // un-traceback on un-hover
  }

  //Bind double-click to open page
  network.on("doubleClick", openPageEvent);
}

window.onload = function() {
    resetNetworkFromInput();  
};

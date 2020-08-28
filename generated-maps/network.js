/* 
network.js:
This code handles the drawing of network graph displaying all the relationships
between the meanings. It allows the user to:
  - Drag any meaning and thus place them where ever they want
  - Zoom in and out of the graph to isolate specific data
  - Drag the visualization
  - Download the visualization in PNG or SVG format

Code written by Loris Rimaz
*/

// DOM selections
const saveGraphToPNG = document.getElementById('saveGraphToPNG');
const saveGraphToSVG = document.getElementById('saveGraphToSVG');
let network;

// Event listeners on the buttons
saveGraphToPNG.addEventListener('click', (event) =>
  exportToCanvas(event, network)
);
saveGraphToSVG.addEventListener('click', (event) =>
  exportToSVG(event, network)
);

// Function drawing the network graph
function drawGraph() {
  const networkWidth = getContainerData().width;
  const networkHeight = 500;

  // Add SVG
  network = d3
    .select('#network')
    .append('svg')
    .attr('id', 'network')
    .attr('width', networkWidth)
    .attr('height', networkHeight)
    .attr('transform', `translate(${margin.left}, 0)`)
    .style('border', '1px black solid')
    .style('border-radius', '5px')
    .style('background-color', 'white');

  // Add groups
  const visualisationGroup = network.append('g');
  const networkWatermark = network.append('g');

  networkWatermark.attr(
    'transform',
    `translate(${networkWidth - margin.left}, ${networkHeight})`
  );
  networkWatermark
    .append('text')
    .text('by WoPoss')
    .attr(
      'style',
      `font-family: Arial, Helvetica, sans-serif; font-size: 12px; fill: #87aac9; font-style: italic;`
    )
    .attr('x', 0)
    .attr('y', 0)
    .attr('dx', 28)
    .attr('dy', -15);

  // Add marker
  network
    .append('defs')
    .append('marker')
    .attr('id', 'arrowhead')
    .attr('viewBox', '-0 -5 10 10')
    .attr('refX', 15)
    .attr('refY', 0)
    .attr('orient', 'auto')
    .attr('markerWidth', 13)
    .attr('markerHeight', 13)
    .attr('xoverflow', 'visible')
    .append('svg:path')
    .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
    .attr('fill', 'black')
    .style('stroke', 'none');

  // Declare simulation
  const simulation = d3
    .forceSimulation()
    .force(
      'link',
      d3
        .forceLink() // This force provides links between nodes
        .id((d) => d.id)
        .distance(75)
    )
    .force('charge', d3.forceManyBody().strength(-100))
    .force('center', d3.forceCenter(networkWidth / 2, networkHeight / 2));

  // Create dataset
  const dataset = extractDefinitionData();

  // Recode dataset's emergence data for circle colors
  if (data.dataForm != 'cent') {
    const datasetEmergences = dataset.nodes.map((node) => node.emergence);
    const singleEmergences = [
      ...new Set(dataset.nodes.map((node) => node.emergence)),
    ];
    datasetEmergences.sort((a, b) => a - b);
    singleEmergences.sort((a, b) => a - b);
    const indices = datasetEmergences.map((d) => singleEmergences.indexOf(d));
    dataset.nodes.sort((a, b) => a.emergence - b.emergence);
    dataset.nodes.forEach((node, i) => {
      node.emergence = indices[i];
    });
  }

  // Add zoom capabilities
  var zoom_handler = d3.zoom().on('zoom', zoom_actions);
  zoom_handler(network);

  // Initialize the links
  const link = visualisationGroup
    .selectAll('.links')
    .data(dataset.links)
    .enter()
    .append('line')
    .attr('class', 'links')
    .style('stroke', 'black')
    .style('stroke-dasharray', (d) => (d.isCert ? 0 : 3))
    .attr('marker-end', (d) => (d.hasDest ? 'url(#arrowhead)' : 'none'));

  // Initialize the nodes
  const node = visualisationGroup
    .selectAll('.nodes')
    .data(dataset.nodes)
    .enter()
    .append('g')
    .attr('class', 'nodes')
    .style('font', 'Arial, Helvetica, sans-serif')
    .style('font-size', 12);

  // Add elements to nodes
  // Rects
  node
    .append('rect')
    .attr('width', (d) => {
      const w = d.name.split(' ');
      const text = w[0] + (w[1] ? ' ' + w[1] : '') + (w[2] ? '...' : '');
      return getTextWidth(text) + 12;
    })
    .attr('height', 20)
    .attr('x', 5)
    .attr('y', -26)
    .attr('rx', 3)
    .attr('ry', 3)
    .style('fill', (d) => colors[d.modal])
    .style('opacity', 0.5);

  // Circles
  node
    .append('circle')
    .attr('r', 10)
    .style('stroke', (d) => colors[d.modal])
    .style('stroke-width', 2)
    .style(
      'fill',
      (d) =>
        `rgb(45, ${50 + 8 * (d.emergence * 2)}, ${100 + 9 * (d.emergence * 2)})`
    );

  // Text
  node
    .append('text')
    .text((d) => {
      const w = d.name.split(' ');
      return w[0] + (w[1] ? ' ' + w[1] : '') + (w[2] ? '...' : '');
    })
    .attr('dx', 10)
    .attr('dy', -10);

  // Add drag capabilities
  var drag_handler = d3
    .drag()
    .on('start', drag_start)
    .on('drag', drag_drag)
    .on('end', drag_end);

  drag_handler(node);

  // Add nodes and links to simulation
  simulation.nodes(dataset.nodes).on('tick', ticked);
  simulation.force('link').links(dataset.links);

  // This function is run at each iteration of the force algorithm, updating the nodes position.
  function ticked() {
    link
      .attr('x1', (d) => d.source.x)
      .attr('y1', (d) => d.source.y)
      .attr('x2', (d) => d.target.x)
      .attr('y2', (d) => d.target.y);

    node.attr('transform', (d) => `translate(${d.x},${d.y})`);
  }

  // Drag functions
  // d is the node
  function drag_start(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  // Should prevent drag outside the box
  function drag_drag(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  // Handles release of the node
  function drag_end(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  // Zoom function
  function zoom_actions() {
    visualisationGroup.attr('transform', d3.event.transform);
  }

  // Draws legend
  drawLegend(network);
}

function extractDefinitionData() {
  const obj = { nodes: [], links: [] };
  definitions.forEach((def, i) => {
    // Created nodes data
    obj.nodes.push({
      id: def.id,
      name: def.meaning,
      emergence: def.emergence,
      modal: def.modal,
    });
    // Create links data
    for (rel in def.relationships) {
      if (rel === 'destinations' || rel === 'unspecified') {
        def.relationships[rel].forEach((r) => {
          if (rel === 'unspecified') {
            let add = true;
            if (obj.links.length > 0) {
              obj.links.forEach((l) => {
                if (l.source === r.rel && l.target === def.id) {
                  add = false;
                }
              });
              if (add) {
                obj.links.push({
                  source: def.id,
                  target: r.rel,
                  hasDest: false,
                  isCert: r.cert,
                });
              }
            } else {
              obj.links.push({
                source: def.id,
                target: r.rel,
                hasDest: false,
                isCert: r.cert,
              });
            }
          } else {
            obj.links.push({
              source: def.id,
              target: r.rel,
              hasDest: true,
              isCert: r.cert,
            });
          }
        });
      }
    }
  });
  return obj;
}

// Function drawing legend
function drawLegend(network) {
  // Main text element
  const text = network
    .append('text')
    .attr('x', 6)
    .attr('y', 18)
    .attr(
      'style',
      `font-family: Arial, Helvetica, sans-serif; font-size: 12px`
    );

  // Various tspans
  text.append('tspan').text('Use mousewheel to zoom in and out');

  text
    .append('tspan')
    .text('Click and drag to explore the network graph')
    .attr('dx', -getTextWidth('Use mousewheel to zoom in and out'))
    .attr('dy', 15);

  text
    .append('tspan')
    .text('Click and drag any node to move it')
    .attr('dx', -getTextWidth('Click and drag to explore the network graph'))
    .attr('dy', 15);
}

// Draws graph only if there is data in the localStorage
if (data) {
  drawGraph();
}

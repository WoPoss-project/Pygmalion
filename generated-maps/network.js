function drawLinks() {
  const networkWidth = getContainerData().width;
  const networkHeight = 400;
  const network = d3
    .select('#network')
    .append('svg')
    .attr('width', networkWidth)
    .attr('height', networkHeight)
    .attr('transform', `translate(${margin.left}, 0)`)
    .style('border', '1px black solid')
    .style('border-radius', '5px');

  const visualisationGroup = network
    .append('g')
    .style('background-color', '#808080');

  visualisationGroup.append('rect');

  network
    .append('defs')
    .append('marker')
    .attr('id', 'arrowhead')
    .attr('viewBox', '-0 -5 10 10') //the bound of the SVG viewport for the current SVG fragment. defines a coordinate system 10 wide and 10 high starting on (0,-5)
    .attr('refX', 15) // x coordinate for the reference point of the marker. If circle is bigger, this need to be bigger.
    .attr('refY', 0)
    .attr('orient', 'auto')
    .attr('markerWidth', 13)
    .attr('markerHeight', 13)
    .attr('xoverflow', 'visible')
    .append('svg:path')
    .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
    .attr('fill', 'black')
    .style('stroke', 'none');

  const simulation = d3
    .forceSimulation()
    .force(
      'link',
      d3
        .forceLink() // This force provides links between nodes
        .id((d) => d.id) // This sets the node id accessor to the specified function. If not specified, will default to the index of a node.
        .distance(50)
    )
    .force('charge', d3.forceManyBody()) // This adds repulsion (if it's negative) between nodes.
    .force('center', d3.forceCenter(networkWidth / 2, networkHeight / 2)); // This force attracts nodes to the center of the svg area

  const dataset = extractDefinitionData();
  //add zoom capabilities
  var zoom_handler = d3.zoom().on('zoom', zoom_actions);
  zoom_handler(network);

  // Initialiser les liens
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

  node
    .append('rect')
    .attr('width', (d) => getTextWidth(d.name) + 12)
    .attr('height', 20)
    .attr('x', 5)
    .attr('y', -26)
    .attr('rx', 3)
    .attr('ry', 3)
    .style('fill', (d) => colors[d.modal])
    .style('opacity', 0.5);

  node
    .append('circle')
    .attr('r', 10)
    .style('stroke', (d) => colors[d.modal])
    .style('stroke-width', 2)
    .style(
      'fill',
      (d) =>
        `rgb(45, ${50 + 10 * (d.emergence * 2)}, ${
          100 + 11 * (d.emergence * 2)
        })`
    );

  node
    .append('text')
    .text((d) => d.name)
    .attr('dx', 10)
    .attr('dy', -10);

  //add drag capabilities
  var drag_handler = d3
    .drag()
    .on('start', drag_start)
    .on('drag', drag_drag)
    .on('end', drag_end);

  drag_handler(node);

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

  //Drag functions
  //d is the node
  function drag_start(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  //make sure you can't drag the circle outside the box
  function drag_drag(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function drag_end(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  //Zoom function
  function zoom_actions() {
    visualisationGroup.attr('transform', d3.event.transform);
  }
}

function extractDefinitionData() {
  const obj = { nodes: [], links: [] };
  definitions.forEach((def, i) => {
    obj.nodes.push({
      id: def.id,
      name: def.meaning,
      emergence: def.emergence,
      modal: def.modal,
    });
    /*if (i === 0) {
      obj.nodes[i]['fx'] = networkWidth / 2;
      obj.nodes[i]['fy'] = networkHeight / 2;
    }*/
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

if (data) {
  drawLinks();
}

window.addEventListener('resize', () => {
  d3.selectAll('#network').select('svg').remove();

  drawLinks();
});

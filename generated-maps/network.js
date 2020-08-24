const networkWidth = getContainerData().width;
const networkHeight = 400;
const network = d3
  .select('#network')
  .append('svg')
  .attr('width', networkWidth)
  .attr('height', networkHeight)
  .attr('transform', `translate(${margin.left}, 0)`);

const dataset = extractDefinitionData();

// Initialiser les liens
let link = network
  .selectAll('line')
  .data(dataset.links)
  .enter()
  .append('line')
  .style('stroke', '#aaa');

// Initialiser les noeuds
let node = network
  .selectAll('circle')
  .data(dataset.nodes)
  .enter()
  .append('circle')
  .attr('r', 20)
  .style('fill', '#69b3a2');

const simulation = d3
  .forceSimulation()
  .force(
    'link',
    d3
      .forceLink() // This force provides links between nodes
      .id((d) => d.id) // This sets the node id accessor to the specified function. If not specified, will default to the index of a node.
      .distance(120)
  )
  .force('charge', d3.forceManyBody().strength(-700)) // This adds repulsion (if it's negative) between nodes.
  .force('center', d3.forceCenter(width / 2, height / 2)); // This force attracts nodes to the center of the svg area

simulation
  .nodes(dataset.nodes) // Force algorithm is applied to data.nodes
  .on('end', ticked);

simulation.force('link').links(dataset.links);

// This function is run at each iteration of the force algorithm, updating the nodes position.
function ticked() {
  link
    .attr('x1', function (d) {
      return d.source.x;
    })
    .attr('y1', function (d) {
      return d.source.y;
    })
    .attr('x2', function (d) {
      return d.target.x;
    })
    .attr('y2', function (d) {
      return d.target.y;
    });

  node
    .attr('cx', function (d) {
      return d.x + 6;
    })
    .attr('cy', function (d) {
      return d.y - 6;
    });
}

function extractDefinitionData() {
  const obj = { nodes: [], links: [] };
  definitions.forEach((def) => {
    obj.nodes.push({
      id: def.id,
      name: def.meaning,
    });
    for (rel in def.relationships) {
      if (rel === 'destinations' || rel === 'unspecified') {
        def.relationships[rel].forEach((r) => {
          if (rel === 'unspecified') {
            if (obj.links.length > 0) {
              let add = true;
              obj.links.forEach((l) => {
                if (l.o === r.rel && l.t === def.id) {
                  add = false;
                }
              });
              if (add) {
                obj.links.push({ source: def.id, target: r.rel });
              }
            } else {
              obj.links.push({ source: def.id, target: r.rel });
            }
          } else {
            obj.links.push({ source: def.id, target: r.rel });
          }
        });
      }
    }
  });
  return obj;
}

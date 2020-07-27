const data = JSON.parse(localStorage.getItem('card'));
const width = 900;
const height = 600;
const margins = {
  top: 100,
  left: 100,
  right: 20,
  bottom: 0,
};

const options = [
  ['Modal: deontic', 'deontic'],
  ['Modal: dynamic', 'dynamic'],
  ['Modal: epistemic', 'epistemic'],
  ['Not modal', 'notModal'],
  ['Premodal', 'premodal'],
  ['Postmodal: futurity', 'postmodal'],
];

const svg = d3
  .select('#card')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .attr('style', 'font: 12px sans-serif');

const legend = svg.append('g').attr('class', 'legend');

for (let i = 0; i < options.length; i++) {
  const col = i <= 2 ? 1 : 0;
  const row = i % 3 == 0 ? 1 : i % 3 == 1 ? 2 : 3;
  const colSpace = 125;
  legend
    .append('rect')
    .style('fill', color(options[i][1]))
    .attr('x', 25 + col * colSpace)
    .attr('y', row * 25)
    .attr('width', 12)
    .attr('height', 12);

  legend
    .append('text')
    .text(options[i][0])
    .attr('x', 40 + col * colSpace)
    .attr('y', row * 25)
    .attr('dy', 10);
}

legend
  .append('rect')
  .attr('width', 10)
  .attr('height', 10)
  .attr('x', 25 + 2 * 125)
  .attr('y', 2 * 25)
  .style('fill', 'none')
  .style('stroke', 'black')
  .style('stroke-width', 2)
  .style('stroke-dasharray', 4);

legend
  .append('text')
  .text('Likely modal (see color)')
  .attr('x', 290)
  .attr('y', 2 * 25)
  .attr('dy', 10);

legend.append('rect');

const meaningsGroup = svg
  .append('g')
  .attr('class', 'meanings')
  .style('fill', 'black');

const definitions = preparedData();

const x = d3
  .scaleLinear()
  .domain([
    d3.max(definitions, (d) => d.emergence),
    d3.min(definitions, (d) => d.emergence),
  ])
  .range([margins.left, width - margins.right]);

const y = d3
  .scaleBand()
  .domain(definitions.map((d) => d.id))
  .range([margins.top, height - margins.bottom])
  .padding(0.2)
  .round(true);

meaningsGroup
  .append('g')
  .style('fill', 'white')
  .style('stroke-width', 3)
  .selectAll('rect')
  .data(definitions)
  .enter()
  .append('rect')
  .style('stroke', (d) => color(d.modal))
  .style('stroke-dasharray', (d) => (!d.certainty ? 4 : 0))
  .attr('x', (d) => width - x(d.emergence))
  .attr('y', (d) => y(d.id))
  .attr('width', (d) => x(d.emergence))
  .attr('height', y.bandwidth());

meaningsGroup
  .append('g')
  .style('fill', 'black')
  .selectAll('text')
  .data(definitions)
  .enter()
  .append('text')
  .attr('dy', '1.66em')
  .attr('dx', '1.25em')
  .attr('text-anchor', 'start')
  .attr('x', (d) => width - x(d.emergence))
  .attr('y', (d) => y(d.id))
  .text((d) => d.meaning);

function preparedData() {
  const meanings = data.meanings;
  const definitions = [];
  meanings.forEach((meaning) => {
    if (meaning.modalities.length > 1) {
      meaning.modalities.forEach((modalitiy) => {
        definitions.push(modalityFormatting(meaning, modalitiy));
      });
    } else {
      definitions.push(modalityFormatting(meaning, meaning.modalities[0]));
    }
  });
  return definitions;
}

function modalityFormatting(meaning, modalitiy) {
  return {
    id: modalitiy.id,
    meaning: meaning.definition,
    construct: meaning.construct,
    group: meaning.group,
    modal: modalitiy.modal,
    emergence: modalitiy.emergence,
    certainty: modalitiy.certainty,
    attestation: modalitiy.attestation,
    relationships: modalitiy.relationships,
  };
}

function color(modal) {
  const conversion = {
    notModal: 'lightgrey',
    deontic: 'crimson',
    dynamic: 'blueviolet',
    epistemic: 'forestgreen',
    premodal: 'black',
    postmodal: 'gold',
  };
  return conversion[modal];
}

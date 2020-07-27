const data = JSON.parse(localStorage.getItem('card'));

const width = '100%';
const height = '100%';
const margin = {
  top: 100,
  left: 100,
  right: 100,
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

const w = Number(svg.style('width').split('px')[0]);
const h = Number(svg.style('height').split('px')[0]);

const legend = svg
  .append('g')
  .attr('class', 'legend')
  .attr('transform', `translate(${margin.left}, ${(h / 100) * 3})`);

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

const definitions = preparedData();

const earliest = d3.min(definitions, (d) => d.emergence);
const latest = d3.max(definitions, (d) => d.emergence);

if (data.dataFormat === 'cent') {
  definitions.forEach((def) => {
    if (def.emergence > 0) {
      def.emergence -= 1;
    }
    def.emergence += Math.abs(earliest);
  });
}

const meaningsGroup = svg
  .append('g')
  .attr('class', 'meanings')
  .attr('transform', `translate(${margin.left}, ${(h / 100) * 15})`)
  .style('width', (w / 100) * 80);

let containerWidth = meaningsGroup.style('width');
containerWidth = Number(containerWidth.substring(0, containerWidth.length - 2));
let containerPortion = Math.floor(
  containerWidth / range(earliest, latest).length
);

meaningsGroup
  .selectAll('rect')
  .data(definitions)
  .enter()
  .append('rect')
  .style('fill', 'white')
  .style('stroke-width', 3)
  .style('stroke', (d) => color(d.modal))
  .style('stroke-dasharray', (d) => (!d.certainty ? 4 : 0))
  .attr('x', (d) => d.emergence * containerPortion)
  .attr('y', (d, i) => i * 37)
  .attr('width', (d) => containerWidth - d.emergence * containerPortion)
  .attr('height', 30);

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
  .attr('x', (d) => d.emergence * containerPortion)
  .attr('y', (d, i) => i * 37)
  .text((d) => d.meaning);

const scale = svg.append('g').attr('transform', `translate(-25, 20)`);

if (data.dataFormat == 'cent') {
  const centuries = range(earliest, latest + 1);
  const romanDates = [];
  centuries.forEach((cent) => {
    let number = '';
    if (cent < 0) {
      number = `${romanize(cent)} BC`;
    } else {
      number = romanize(cent);
    }
    if (!romanDates.includes(number) && number != '') {
      romanDates.push(number);
    }
  });

  /*
  scale
    .selectAll('rect')
    .data(romanDates)
    .enter()
    .append('rect')
    .attr('width', (d, i) => x(earliest))
    .attr('height', y.bandwidth())
    .attr('x', x(earliest))
    .attr('y', (d, i) => i * 50);*/
}

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

function romanize(num) {
  if (isNaN(num)) return NaN;
  let digits = String(+num).split(''),
    key = [
      '',
      'C',
      'CC',
      'CCC',
      'CD',
      'D',
      'DC',
      'DCC',
      'DCCC',
      'CM',
      '',
      'X',
      'XX',
      'XXX',
      'XL',
      'L',
      'LX',
      'LXX',
      'LXXX',
      'XC',
      '',
      'I',
      'II',
      'III',
      'IV',
      'V',
      'VI',
      'VII',
      'VIII',
      'IX',
    ],
    roman = '',
    i = 3;
  while (i--) roman = (key[+digits.pop() + i * 10] || '') + roman;
  return Array(+digits.join('') + 1).join('M') + roman;
}

function range(start, end) {
  return Array(end - start + 1)
    .fill()
    .map((_, idx) => start + idx);
}

const data = JSON.parse(localStorage.getItem('card'));
const definitions = prepareDefinitions();

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

const width = '100%';
const height = '100%';
const margin = {
  top: 100,
  left: 150,
  right: 100,
  bottom: 0,
};

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

const meaningsGroup = svg
  .append('g')
  .attr('class', 'meanings')
  .attr('transform', `translate(${margin.left}, ${(h / 100) * 18.5})`);

const scale = svg
  .append('g')
  .attr('transform', `translate(${margin.left}, ${(h / 100) * 15})`);

function basicDisplay() {
  const options = [
    ['Modal: deontic', 'deontic'],
    ['Modal: dynamic', 'dynamic'],
    ['Modal: epistemic', 'epistemic'],
    ['Not modal', 'notModal'],
    ['Premodal', 'premodal'],
    ['Postmodal: futurity', 'postmodal'],
  ];

  for (let i = 0; i < options.length; i++) {
    const col = i <= 2 ? 1 : 0;
    const row = i % 3 == 0 ? 1 : i % 3 == 1 ? 2 : 3;
    const colSpace = 125;

    legend
      .append('rect')
      .style('fill', color(options[i][1]))
      .attr('x', col * colSpace)
      .attr('y', row * 25)
      .attr('width', 12)
      .attr('height', 12);

    legend
      .append('text')
      .text(options[i][0])
      .attr('x', col * colSpace)
      .attr('y', row * 25)
      .attr('dx', 15)
      .attr('dy', 10);
  }

  legend
    .append('rect')
    .attr('width', 10)
    .attr('height', 10)
    .attr('x', 2 * 125)
    .attr('y', 2 * 25)
    .style('fill', 'none')
    .style('stroke', 'black')
    .style('stroke-width', 2)
    .style('stroke-dasharray', 4);

  legend
    .append('text')
    .text('Likely modal (see color)')
    .attr('x', 250)
    .attr('y', 2 * 25)
    .attr('dx', 15)
    .attr('dy', 10);

  drawData();
}

function prepareDefinitions() {
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

function drawData(elements = definitions) {
  const t = svg.transition().duration(750);

  meaningsGroup.style('width', (w / 100) * 80);

  let containerWidth = meaningsGroup.style('width');
  containerWidth = Number(
    containerWidth.substring(0, containerWidth.length - 2)
  );
  let containerPortion = Math.floor(
    containerWidth / range(earliest, latest).length
  );

  meaningsGroup
    .selectAll('rect')
    .data(elements)

    .enter()
    .append('rect')
    .attr('class', 'data')
    .style('fill', 'white')
    .style('stroke-width', 3)
    .style('stroke', (d) => color(d.modal))
    .style('stroke-dasharray', (d) => (!d.certainty ? 4 : 0))
    .attr('x', (d) => margin.left / 2 + d.emergence * containerPortion)
    .attr('y', (_, i) => i * 37)
    .attr('width', (d) => containerWidth - d.emergence * containerPortion)
    .attr('height', 30)
    .on('click', (d) => {
      newDisplay(d);
    })

    .exit()
    .remove();

  meaningsGroup
    .style('fill', 'black')
    .selectAll('text')
    .data(elements)

    .enter()
    .append('text')
    .attr('class', 'data')
    .attr('dy', '1.66em')
    .attr('dx', '1.25em')
    .attr('text-anchor', 'start')
    .attr('x', (d) => margin.left / 2 + d.emergence * containerPortion)
    .attr('y', (_, i) => i * 37)
    .text((d) => d.meaning)

    .exit()
    .remove();

  drawScale(earliest, latest, containerPortion);
}

function drawScale(earliest, latest, containerPortion) {
  if (data.dataFormat == 'cent') {
    const centuries = range(earliest, latest);
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

    romanDates.push('...');

    scale
      .selectAll('rect')
      .data(romanDates)
      .enter()
      .append('rect')
      .attr('width', containerPortion)
      .attr('height', 30)
      .attr('x', (_, i) => margin.left / 2 + i * containerPortion)
      .attr('y', 0)
      .style('stroke', (d, i) => `rgb(45, ${120 + 6 * i}, ${180 + 7 * i})`)
      .style('stroke-width', 3)
      .style('fill', (d, i) => `rgb(45, ${120 + 6 * i}, ${180 + 7 * i})`);

    scale
      .selectAll('text')
      .data(romanDates)
      .enter()
      .append('text')
      .text((d) => d)
      .attr('x', (d, i) => margin.left / 2 + i * containerPortion)
      .attr('y', 0)
      .attr('dx', 15)
      .attr('dy', 22)
      .attr('font-size', 20)
      .attr('style', 'font-weight: bold')
      .style('fill', 'white');
  }
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

function newDisplay(event) {
  const keptIds = [event.id];
  const keptElements = [];
  for (const [_, value] of Object.entries(event.relationships)) {
    if (value != '') {
      value.forEach((val) => keptIds.push(val));
    }
  }
  keptIds.forEach((id) => {
    definitions.forEach((def) => {
      if (Object.values(def).includes(id)) {
        keptElements.push(def);
      }
    });
  });
  drawData(keptElements);
}

if (data) {
  basicDisplay();
}

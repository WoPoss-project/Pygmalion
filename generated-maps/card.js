const data = JSON.parse(localStorage.getItem('card'));
const definitions = prepareDefinitions();

const earliest = d3.min(definitions, (d) => d.emergence);
const latest = d3.max(definitions, (d) => d.emergence);

const lineGenerator = d3.line();

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
  .attr('transform', `translate(${margin.left}, ${(h / 100) * 12.75})`);

const etymology = svg
  .append('g')
  .attr('class', 'etymology')
  .attr('transform', `translate(${margin.left}, ${(h / 100) * 3})`);

const meaningsGroup = svg
  .append('g')
  .attr('class', 'meanings')
  .attr('transform', `translate(${margin.left}, ${(h / 100) * 27})`);

const scale = svg
  .append('g')
  .attr('transform', `translate(${margin.left}, ${(h / 100) * 23})`);

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

  drawEtymology();
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

function drawEtymology() {
  const ety = data.etymology;
  const newEty = [];
  ety.forEach((e) => {
    newEty.push(Object.values(e));
  });

  let totalLength = 0;
  const gh = 80;

  for (let i = 0; i < newEty.length + 1; i++) {
    let gw = newEty[i]
      ? newEty[i][2].split(' ').join('').length * 7.5 >
        newEty[i][1].length * 7.5
        ? newEty[i][2].split(' ').join('').length * 7.5
        : newEty[i][1].length * 7.5
      : data.headword[data.headword.length - 1] ===
        data.headword[data.headword.length - 1].toLowerCase()
      ? data.headword.length * 8
      : data.headword.length * 11.5;
    gw += 25;

    const g = etymology
      .append('g')
      .attr('transform', `translate(${totalLength}, ${(h / 100) * 3})`);

    g.append('path')
      .attr('d', () => {
        if (i == 0) {
          return lineGenerator([
            [0, 0],
            [25, 0],
            [gw, 0],
            [gw + 25, gh / 2],
            [gw, gh],
            [25, gh],
            [0, gh],
            [0, 0],
          ]);
        } else {
          return lineGenerator([
            [0, 0],
            [25, 0],
            [gw, 0],
            [gw + 25, gh / 2],
            [gw, gh],
            [25, gh],
            [0, gh],
            [25, gh / 2],
            [0, 0],
          ]);
        }
      })
      .style('fill', 'none')
      .style('stroke', 'black')
      .style('stroke-width', 3);
    if (newEty[i]) {
      for (let j = 0; j < newEty[i].length; j++) {
        g.append('text')
          .text(newEty[i][j])
          .attr('x', i === 0 ? 18 : 25)
          .attr('y', j * 25)
          .attr('dx', 12)
          .attr('dy', 20);
      }
    } else {
      g.append('text')
        .text(data.headword)
        .attr('x', 25)
        .attr('y', 25)
        .attr('dx', 12)
        .attr('dy', 20);
    }
    totalLength += gw;
  }
}

function drawData(elements = definitions) {
  meaningsGroup.style('width', (w / 100) * 80);
  let containerWidth = meaningsGroup.style('width');
  containerWidth = Number(
    containerWidth.substring(0, containerWidth.length - 2)
  );
  let containerPortion = Math.floor(
    containerWidth / range(earliest, latest).length
  );

  let tip = d3
    .select('body')
    .append('div')
    .attr('class', 'tooltip-donut')
    .style('opacity', 0);

  elements.sort((a, b) => {
    const compareConstruct = (a, b) => (a < b ? -1 : b < a ? 1 : 0);
    const compareDate = (a, b) => Math.sign(a - b);

    return (
      compareConstruct(a.construct, b.construct) ||
      compareDate(a.emergence, b.emergence)
    );
  });

  meaningsGroup
    .selectAll('g')
    .data(elements, (d) => d.id)

    .join(
      (enter) =>
        enter
          .append('g')
          .attr('class', 'data')
          .attr(
            'transform',
            (d, i) =>
              `translate(${d.emergence * containerPortion + 10}, ${i * 37})`
          )
          .style('opacity', 0)
          .call(addElems, containerWidth, containerPortion, tip)
          .call((enter) =>
            enter.transition().duration(250).style('opacity', 1)
          ),
      (update) =>
        update
          .call(updateElems, containerWidth, containerPortion)
          .transition()
          .duration(250)
          .attr(
            'transform',
            (d, i) =>
              `translate(${d.emergence * containerPortion + 10}, ${i * 37})`
          ),
      (exit) => exit.transition().duration(250).style('opacity', 0).remove()
    );

  drawScale(earliest, latest, containerPortion);
}

function addElems(elements, cW, cP, tip) {
  elements
    .append('path')
    .attr('d', (d) => {
      const width = cW - (d.emergence * cP + 10);
      return lineGenerator([
        [0, 0],
        [0 + 10, 0],
        [0 + width, 0],
        [0 + width + 10, 15],
        [0 + width, 30],
        [0 + 10, 30],
        [0, 30],
        [0, 0],
      ]);
    })
    .style('stroke-dasharray', (d) => (!d.certainty ? 4 : 0))
    .style('fill', 'white')
    .style('stroke', (d) => color(d.modal))
    .style('stroke-width', 3)
    .on('click', (d) => {
      tip.transition().duration(50).style('opacity', 0);
      newDisplay(d);
    })
    .on('dblclick', () => {
      d3.event.preventDefault();
      elements.remove();
      drawData();
    })
    .on('mouseover', (d) => {
      tip.transition().duration(50).style('opacity', 1);
      tip
        .html(d.attestation)
        .style('left', d3.event.pageX + 10 + 'px')
        .style('top', d3.event.pageY - 15 + 'px');
    })
    .on('mouseout', () => {
      tip.transition().duration(50).style('opacity', 0);
    });

  elements
    .insert('text')
    .style('fill', 'black')
    .attr('dy', '1.66em')
    .attr('dx', '1.1em')
    .attr('text-anchor', 'start')
    .text((d) => d.meaning)
    .attr('y', 0)
    .attr('x', 0)
    .call(wrap, cW, cP);
}

function updateElems(elements, cW, cP) {
  elements.selectAll('text').call(wrap, cW, cP);
}

function checkHeight(d, boxWidth) {
  const length = d.meaning.length;
  if (length * 5.5 >= boxWidth) {
    return 50;
  } else {
    return 30;
  }
}

function wrap(text, cW, cP) {
  text.each(function () {
    let text = d3.select(this),
      words = text.text().split(/\s+/).reverse(),
      word,
      line = [],
      lineNumber = 0,
      lineHeight = 1.5, // ems
      x = text.attr('x'),
      y = text.attr('y'),
      dy = parseFloat(text.attr('dy')),
      tspan = text
        .text(null)
        .append('tspan')
        .attr('x', x)
        .attr('y', y)
        .attr('dy', dy + 'em'),
      emergence = text.data()[0].emergence;

    const width = cW - (emergence * cP + 10);
    while ((word = words.pop())) {
      line.push(word);
      tspan.text(line.join(' '));
      if (tspan.text().length * 6 > width) {
        line.pop();
        tspan.text(line.join(' ') + ' ');
        line = [word];
        tspan = text
          .append('tspan')
          .attr('x', x)
          .attr('y', y)
          .attr('dy', ++lineNumber * lineHeight + dy + 'em')
          .attr('dx', '1.1em')
          .text(word);

        // Modify destination path
        let node = text.node().parentNode.firstChild;
        const yModifier = lineNumber + 1;
        d3.select(node).attr(
          'd',
          lineGenerator([
            [0, 0],
            [10, 0],
            [width, 0],
            [width + 10, 15 * yModifier],
            [width, 30 * yModifier],
            [10, 30 * yModifier],
            [0, 30 * yModifier],
            [0, 0],
          ])
        );

        // move other blocks
        let nodes = text.node().parentNode.parentNode.childNodes;
        let parent = text.node().parentNode;
        let nodesToMove = range(
          [...nodes].indexOf(parent) + 1,
          nodes.length - 1
        );
        nodesToMove = nodesToMove.map((index) => nodes[index]);
        nodesToMove.forEach((node) => {
          const g = d3.select(node);
          let transform = g.attr('transform');
          let xy = transform
            .split('(')[1]
            .split(')')[0]
            .split(', ')
            .map((coord) => Number(coord));
          g.attr(
            'transform',
            `translate(${xy[0]}, ${xy[1] + 30 * lineNumber})`
          );
          /*const path = node.childNodes[0],
            text = node.childNodes[1],
            coords = getCoords(path);
          const pathX = Number(coords[0][0]),
            pathY = Number(coords[0][1]) + 30 * lineNumber,
            pathWidth = Number(coords[2][0]) - pathX;
          d3.select(path).attr('d', () => {
            return lineGenerator([
              [pathX, pathY],
              [pathX + 10, pathY],
              [pathX + pathWidth, pathY],
              [pathX + pathWidth + 10, pathY + 15],
              [pathX + pathWidth, pathY + 30],
              [pathX + 10, pathY + 30],
              [pathX, pathY + 30],
              [pathX, pathY],
            ]);
          });
          let t = d3.select(text);
          t.attr('y', Number(t.attr('y')) + 30 * lineNumber);*/
        });
      }
    }
  });
}

function getCoords(path) {
  path = d3.select(path);
  d = path.attr('d').split(/(?=[LMC])/);
  return d.map((coord) => {
    coord = coord.substring(1);
    return coord.split(',');
  });
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

    romanDates.push('');

    scale
      .selectAll('path')
      .data(romanDates)
      .enter()
      .append('path')
      .attr('class', 'scale')
      .attr('d', (_, i) => {
        const width = containerPortion + 0.5;
        const x = i * width;
        if (i === 0) {
          return lineGenerator([
            [x, 0],
            [x + 10, 0],
            [x + width, 0],
            [x + width + 10, 15],
            [x + width, 30],
            [x + 10, 30],
            [x, 30],
            [x, 0],
          ]);
        } else {
          return lineGenerator([
            [x, 0],
            [x + 10, 0],
            [x + width, 0],
            [x + width + 10, 15],
            [x + width, 30],
            [x + 10, 30],
            [x, 30],
            [x + 10, 15],
            [x, 0],
          ]);
        }
      })
      .attr('height', 30)
      .attr('x', (_, i) => i * (containerPortion + 0.5))
      .attr('y', 0)
      .style('fill', (_, i) => `rgb(45, ${100 + 8 * i}, ${160 + 9 * i})`);

    scale
      .selectAll('text')
      .data(romanDates)
      .enter()
      .append('text')
      .attr('class', 'scale')
      .text((d) => d)
      .attr('x', (_, i) => i * (containerPortion + 0.5))
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
  const keptIds = [
    event.id,
    ...Object.values(event.relationships).reduce((a, b) => a.concat(b)),
  ];
  const keptElements = [];
  keptIds.forEach((id) => {
    definitions.forEach((def) => {
      if (Object.values(def).includes(id)) {
        keptElements.push(def);
      }
    });
  });
  console.log(keptElements);
  drawData(keptElements);
}

if (data) {
  basicDisplay();
}

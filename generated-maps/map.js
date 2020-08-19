const data = JSON.parse(localStorage.getItem('card'));
const definitions = prepareDefinitions();

const saveToPNG = document.getElementById('saveToPNG');
saveToPNG.addEventListener('click', exportToCanvas);

const select = document.getElementById('mode');
let selectMode = select.value;

select.addEventListener('change', (event) => {
  const value = event.target.value;
  selectMode = value;
  const elements = meaningsGroup.selectAll('g').data();
  drawData(
    elements,
    elements.length < definitions.length ? true : false,
    value
  );
});

const earliest = d3.min(definitions, (d) => d.emergence);
const emergenceMax = d3.max(definitions, (d) => d.emergence);
definitions.forEach((d) => (d.disparition = +d.disparition));
const disparitionMax = d3.max(definitions, (d) => d.disparition);
const latest = d3.max(definitions, (d) =>
  typeof disparitionMax == 'undefined' || emergenceMax > disparitionMax
    ? d.emergence
    : d.disparition
);

const lineGenerator = d3.line();

if (data.dataFormat === 'cent') {
  definitions.forEach((def) => {
    if (def.emergence > 0) {
      def.emergence -= 1;
      def.disparition -= 1;
    }
    if (earliest < 0) {
      def.emergence += Math.abs(earliest);
      def.disparition += Math.abs(earliest);
    }
  });
} else if (data.dataFormat === 'dec') {
  const r = range10(
    earliest > 0 && latest > 0 ? findCent(earliest) - 100 : findCent(earliest),
    findCent(latest) + 100
  );

  definitions.forEach((def) => {
    def.emergence = r.indexOf(def.emergence);
    def.disparition = r.indexOf(def.disparition);
  });
} else {
  const r = range(
    earliest > 0 && latest > 0 ? findCent(earliest) - 99 : findCent(earliest),
    findCent(latest) + 100
  );
  definitions.forEach((def) => {
    def.emergence = r.indexOf(def.emergence);
    def.disparition = r.indexOf(def.disparition);
  });
}

const margin = {
  top: 100,
  left: 100,
  right: 100,
  bottom: 0,
};
const width = '100%';
const height = margin.top * 2.5 - 5 + definitions.length * 37;

const svg = d3
  .select('#map')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .attr('style', 'font: 12px sans-serif')
  .style('background-color', 'white');

const w = Number(svg.style('width').split('px')[0]);
const h = Number(svg.style('height').split('px')[0]);

svg
  .append('svg:defs')
  .append('svg:marker')
  .attr('id', 'arrow1')
  .attr('refX', 4.25)
  .attr('refY', 2)
  .attr('markerWidth', 30)
  .attr('markerHeight', 30)
  .attr('orient', 'auto-start-reverse')
  .append('path')
  .attr('d', 'M 0 0 4 2 0 4 0.25 2')
  .style('fill', 'black');

svg
  .append('svg:defs')
  .append('svg:marker')
  .attr('id', 'arrow2')
  .attr('refX', -1)
  .attr('refY', 2)
  .attr('markerWidth', 30)
  .attr('markerHeight', 30)
  .attr('orient', '0deg')
  .append('path')
  .attr('d', 'M 0 0 4 2 0 4 0.25 2')
  .style('fill', 'black');

const legend = svg
  .append('g')
  .attr('class', 'legend')
  .attr('transform', `translate(${margin.left}, 0)`);

const etymology = svg
  .append('g')
  .attr('class', 'etymology')
  .attr('transform', `translate(${margin.left}, ${margin.top + 5})`);

const relationshipGroup = svg
  .append('g')
  .attr('class', 'relationship')
  .attr('transform', `translate(${margin.left}, ${margin.top * 2.5 + 15})`);

const constructsAndGroups = svg
  .append('g')
  .attr('class', 'relationship')
  .attr('transform', `translate(${margin.left}, ${margin.top * 2.5})`);

const meaningsGroup = svg
  .append('g')
  .attr('class', 'meanings')
  .attr('transform', `translate(${margin.left}, ${margin.top * 2.5})`);

const scale = svg
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top * 2})`);

function basicDisplay() {
  const options = [
    ['Modal: deontic', 'deontic'],
    ['Modal: dynamic', 'dynamic'],
    ['Modal: epistemic', 'epistemic'],
    ['Not modal', 'notModal'],
    ['Premodal', 'premodal'],
    ['Postmodal', 'postmodal'],
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

  legend
    .append('path')
    .attr(
      'd',
      lineGenerator([
        [420, 45],
        [440, 45],
      ])
    )
    .style('fill', 'none')
    .style('stroke', 'black')
    .style('stroke-width', 2)
    .style('stroke-dasharray', 0);

  legend
    .append('text')
    .text('Semantic relation')
    .attr('x', 420)
    .attr('y', 45)
    .attr('dx', 25)
    .attr('dy', 3.5);

  legend
    .append('path')
    .attr(
      'd',
      lineGenerator([
        [420, 65],
        [440, 65],
      ])
    )
    .style('fill', 'none')
    .style('stroke', 'black')
    .style('stroke-width', 2)
    .style('stroke-dasharray', 4);

  legend
    .append('text')
    .text('Hypothetical relation')
    .attr('x', 420)
    .attr('y', 65)
    .attr('dx', 25)
    .attr('dy', 3.5);

  drawEtymology();
  drawData();
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
    disparition: modalitiy.disparition,
  };
}

function drawEtymology() {
  const ety = data.etymology;
  const newEty = [];
  let gw = getTextWidth('No etymology') + 25;

  let totalLength = 0;
  const gh = 80;

  if (typeof ety === 'object') {
    ety.forEach((e) => {
      newEty.push(Object.values(e));
    });

    for (let i = 0; i < newEty.length + 1; i++) {
      gw = newEty[i]
        ? getTextWidth(newEty[i][2]) > getTextWidth(newEty[i][1])
          ? getTextWidth(newEty[i][2])
          : getTextWidth(newEty[i][1])
        : getTextWidth(data.headword);
      gw += i === 0 ? 25 : 45;

      const g = etymology
        .append('g')
        .attr('transform', `translate(${totalLength}, 0)`);

      g.append('path')
        .attr('d', () => {
          if (i == 0) {
            return lineGenerator([
              [0, 0],
              [gw, 0],
              [gw + 25, gh / 2],
              [gw, gh],
              [0, gh],
              [0, 0],
            ]);
          } else {
            return lineGenerator([
              [0, 0],
              [gw, 0],
              [gw + 25, gh / 2],
              [gw, gh],
              [0, gh],
              [25, gh / 2],
              [0, 0],
            ]);
          }
        })
        .style('fill', 'none')
        .style('stroke', 'black')
        .style('stroke-width', 3)
        .style('stroke-dasharray', () =>
          newEty[i] ? (newEty[i][3] ? 0 : 4) : 0
        );
      if (newEty[i]) {
        for (let j = 0; j < newEty[i].length - 1; j++) {
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
          .attr('x', 20)
          .attr('y', gh / 2 + 3)
          .attr('dx', i == 0 ? 0 : 20);
      }
      totalLength += gw;
    }
  } else if (typeof ety === 'boolean' && ety === false) {
    gw = getTextWidth(data.headword);

    const g = etymology
      .append('g')
      .attr('transform', `translate(${totalLength}, 0)`);

    g.append('path')
      .attr(
        'd',
        lineGenerator([
          [0, 0],
          [25, 0],
          [gw, 0],
          [gw + 25, gh / 2],
          [gw, gh],
          [25, gh],
          [0, gh],
          [0, 0],
        ])
      )
      .style('fill', 'none')
      .style('stroke', 'black')
      .style('stroke-width', 3);

    g.append('text')
      .text(data.headword)
      .attr('x', 20)
      .attr('y', gh / 2 + 3);
  } else {
    for (let i = 0; i < 2; i++) {
      gw =
        i === 0
          ? getTextWidth('Etymology unknown')
          : getTextWidth(data.headword);
      gw += i === 0 ? 25 : 45;
      const g = etymology
        .append('g')
        .attr('transform', `translate(${totalLength}, 0)`);

      g.append('path')
        .attr('d', () => {
          if (i == 0) {
            return lineGenerator([
              [0, 0],
              [gw, 0],
              [gw + 25, gh / 2],
              [gw, gh],
              [0, gh],
              [0, 0],
            ]);
          } else {
            return lineGenerator([
              [0, 0],
              [gw, 0],
              [gw + 25, gh / 2],
              [gw, gh],
              [0, gh],
              [25, gh / 2],
              [0, 0],
            ]);
          }
        })
        .style('fill', 'none')
        .style('stroke', 'black')
        .style('stroke-width', 3);

      g.append('text')
        .text(i === 0 ? 'Etymology unknown' : data.headword)
        .attr('x', i === 0 ? 20 : 40)
        .attr('y', gh / 2 + 3);

      totalLength += gw;
    }
  }
}

function sortElements(elements, mode) {
  elements.sort((a, b) => {
    const compareConstruct = (a, b) => (a < b ? -1 : b < a ? 1 : 0);
    const compareDate = (a, b) => Math.sign(a - b);

    return (
      compareConstruct(a[mode], b[mode]) ||
      compareDate(a.emergence, b.emergence)
    );
  });
  return elements;
}

function drawData(
  elements = definitions,
  allowUpdate = false,
  mode = selectMode
) {
  meaningsGroup.style('width', (w / 100) * 80);
  const container = getContainerData();

  let tip = d3
    .select('body')
    .append('div')
    .attr('class', 'tooltip-donut')
    .style('opacity', 0);

  elements = sortElements(elements, mode);

  const lines = getLines(elements, container.width, container.portion);

  drawConstructsOrGroups(
    elements,
    container.width,
    container.portion,
    lines,
    mode
  );

  meaningsGroup
    .selectAll('g')
    .data(elements, (d) => d.id)

    .join(
      (enter) =>
        enter
          .append('g')
          .attr('class', 'data')
          .attr('transform', (d, i) => {
            return `translate(${d.emergence * container.portion}, ${
              i * 37 + lines[i] * 30
            })`;
          })
          .style('opacity', 0)
          .call(addElems, container.width, container.portion, tip)
          .call((enter) =>
            enter.transition().duration(250).style('opacity', 1)
          ),
      (update) =>
        update
          .call(
            updateElems,
            container.width,
            container.portion,
            elements,
            allowUpdate,
            lines
          )
          .transition()
          .duration(250)
          .attr(
            'transform',
            (d, i) =>
              `translate(${d.emergence * container.portion}, ${
                i * 37 + lines[i] * 30
              })`
          ),
      (exit) => exit.transition().duration(250).style('opacity', 0).remove()
    );

  drawScale(earliest, latest, container.width);
}

function drawConstructsOrGroups(elements, cW, cP, lines, mode) {
  constructsAndGroups.selectAll('path').remove();
  constructsAndGroups.selectAll('text').remove();
  const dataList = [...new Set(elements.map((el) => el[mode]))];
  dataList.forEach((group) => {
    if (group != 'None') {
      const indexes = [];
      elements.forEach((el) =>
        el[mode] == group ? indexes.push(elements.indexOf(el)) : false
      );
      const max = Math.max(...indexes);
      const min = Math.min(...indexes);
      const x0 = elements[min].emergence * cP;
      const x1 = elements[max].emergence * cP;
      const x2 = Math.min(x0, x1) - 15;
      const xMiddle = x2 - 10;
      const y0 = min * 37 + lines[min] * 30;
      const y1 =
        max * 37 +
        lines[max] * 30 +
        (wrap(elements[max].meaning, cW, cP, elements[max]) + 1) * 30;
      const pathHeight = y1 - y0;
      const yMiddle = y1 - pathHeight / 2;

      if (min < max) {
        constructsAndGroups
          .append('path')
          .attr(
            'd',
            lineGenerator([
              [x0, y0],
              [x2, y0],
              [x2, yMiddle],
              [xMiddle, yMiddle],
              [x2, yMiddle],
              [x2, y1],
              [x0, y1],
            ])
          )
          .attr('fill', 'none')
          .style('stroke', 'black')
          .style('stroke-width', 1)
          .style('opacity', 0)
          .transition()
          .duration(500)
          .style('opacity', 1);
      }

      constructsAndGroups
        .append('text')
        .text(group)
        .attr('x', () => {
          if (min < max) {
            return xMiddle - getTextWidth(group) - 5;
          } else {
            return x0 - getTextWidth(group) - 5;
          }
        })
        .attr('y', yMiddle + 4)
        .style('opacity', 0)
        .transition()
        .duration(500)
        .style('opacity', 1);
    }
  });
}

function addElems(elements, cW, cP, tip) {
  elements
    .append('path')
    .attr('d', (d) => {
      let width = cW - d.emergence * cP;
      if (d.disparition != -1 && !isNaN(d.disparition)) {
        const end = cW - d.disparition * cP;
        width = width - end;
      }
      return lineGenerator([
        [0, 0],
        [0 + width, 0],
        [0 + width + 10, 15],
        [0 + width, 30],
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
      relationshipGroup.selectAll('.rel').remove();
      drawData();
    })
    .on('mouseover', (d) => {
      tip.transition().duration(50).style('opacity', 1);
      tip
        // TODO: adapt for centuries
        .html(() => {
          const r =
            data.dataFormat != 'cent'
              ? data.dataFormat === 'dec'
                ? range10(
                    earliest > 0 && latest > 0
                      ? findCent(earliest) - 100
                      : findCent(earliest),
                    findCent(latest) + 100
                  )
                : range(
                    earliest > 0 && latest > 0
                      ? findCent(earliest) - 99
                      : findCent(earliest),
                    findCent(latest) + 100
                  )
              : 0;
          if (data.dataFormat === 'cent') {
            const em = d.emergence - Math.abs(earliest);
            const dis = d.disparition - Math.abs(earliest);
            return (
              (em < 0 ? `${romanize(em)} BC` : romanize(em)) +
              ' to ' +
              (isNaN(d.disparition)
                ? 'present'
                : dis < 0
                ? `${romanize(dis)} BC`
                : romanize(dis)) +
              ': ' +
              d.attestation
            );
          } else {
            return (
              r[d.emergence] +
              (data.dataFormat === 'dec' ? 's to ' : ' to ') +
              (d.disparition != -1 ? r[d.disparition] : 'present') +
              (data.dataFormat === 'dec'
                ? d.disparition != -1
                  ? 's: '
                  : ': '
                : ': ') +
              d.attestation
            );
          }
        })
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

function updateElems(elements, cW, cP, elementsData, displayRels, lines) {
  //elements.selectAll('text').call(wrap, cW, cP, 'update');

  if (displayRels) {
    const element = elementsData.reduce((acc, curr) =>
      curr.rel === 'origin' ? (acc = curr) : acc
    );
    const elementIndex = elementsData.indexOf(element);
    const indexes = range(
      0 - elementIndex,
      elementsData.length - 1 - elementIndex
    );

    const offset =
      lines[elementIndex] * 30 + wrap(element.meaning, cW, cP, element) * 15;
    const x0 =
      element.disparition != -1 && !isNaN(element.disparition)
        ? element.disparition * cP + 10
        : cW + 10;
    const y0 = elementIndex * 37 + offset;

    relationshipGroup.selectAll('.rel').remove();
    relationshipGroup
      .selectAll('.rel')
      .data(elementsData, (d) => d.id)
      .enter()
      .append('path')
      .attr('class', 'rel')
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('stroke-width', 3)
      .attr('marker-end', (d) =>
        d.rel === 'destinations'
          ? 'url(#arrow1)'
          : d.rel === 'origins'
          ? 'url(#arrow2)'
          : false
      )
      .style('stroke-dasharray', (d) => (!d.relCert ? 4 : 0))
      .style('opacity', 0)
      .attr('d', (d, i) => {
        const modifier = indexes[i];
        const lineHeight = wrap(d.meaning, cW, cP, d);
        const off = lines[i] * 30 + lineHeight * 15;
        const x1 =
          cW + 10 + (Math.abs(modifier) * margin.right) / 1.5 / indexes.length;
        const x2 =
          d.disparition != -1 && !isNaN(d.disparition)
            ? d.disparition * cP + 10
            : cW + 10;
        const y1 = y0 - offset + modifier * 37 + off;
        const points =
          i != elementIndex
            ? [
                [x0, y0],
                [x1, y0],
                [x1, y1],
                [x2, y1],
              ]
            : [[x0, y0]];
        return lineGenerator(points);
      })
      .transition()
      .duration(500)
      .style('opacity', 1);
  }
}

function newDisplay(event) {
  if (event.relationships) {
    const keptIds = [
      event.id,
      ...Object.values(event.relationships)
        .reduce((a, b) => a.concat(b))
        .map((r) => r.rel),
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
    drawData(
      addRelationshipInfo(event.relationships, keptElements),
      true,
      selectMode
    );
  } else {
    Swal.fire({
      icon: 'error',
      title: 'No relationship data',
      text:
        'Please make sure you have specified relationships between the meanings.',
    });
  }
}

function addRelationshipInfo(relationships, elements) {
  definitions.forEach((def) => {
    delete def.rel;
    delete def.relCert;
  });
  for (const direction in relationships) {
    relationships[direction].forEach((rel) => {
      elements.forEach((el) => {
        if (!('rel' in el) && !('relCert' in el)) {
          el['rel'] = 'origin';
          el['relCert'] = true;
        }
        if (rel.rel === el.id) {
          el['rel'] = direction;
          el['relCert'] = rel.cert;
        }
      });
    });
  }
  return elements;
}

function drawScale(earliest, latest, cW) {
  const dates = [];

  let centuries;
  if (data.dataFormat == 'cent') {
    // recode data for centuries
    centuries = range(earliest, latest + 1);
  } else if (data.dataFormat == 'dec') {
    // recode data for decades
    const decadesForScale = range10(
      earliest > 0 && latest > 0
        ? findCent(earliest) - 100
        : findCent(earliest),
      findCent(latest) + 100
    );
    // decadesForScale.splice(decadesForScale.indexOf(0), 1);
    centuries = [
      ...new Set(decadesForScale.map((dec) => centuryFromYear(dec))),
    ];
  } else {
    const yearsForScale = range(
      earliest > 0 && latest > 0 ? findCent(earliest) - 99 : findCent(earliest),
      findCent(latest) + 100
    );
    // decadesForScale.splice(decadesForScale.indexOf(0), 1);
    centuries = [...new Set(yearsForScale.map((dec) => centuryFromYear(dec)))];
  }

  const cP =
    cW / (centuries.includes(0) ? centuries.length - 1 : centuries.length);

  centuries.forEach((cent) => {
    let number = '';
    if (cent < 0) {
      number = `${romanize(cent)} BC`;
    } else {
      number = romanize(cent);
    }
    if (!dates.includes(number) && number != '') {
      dates.push(number);
    }
  });

  scale
    .selectAll('path')
    .data(dates)
    .enter()
    .append('path')
    .attr('class', 'scale')
    .attr('d', (d, i) => {
      let x = i * cP;
      if (i === 0) {
        return lineGenerator([
          [x, 0],
          [x + cP, 0],
          [x + cP + 10, 15],
          [x + cP, 30],
          [x, 30],
          [x, 0],
        ]);
      } else {
        return lineGenerator([
          [x, 0],
          [x + cP, 0],
          [x + cP + 10, 15],
          [x + cP, 30],
          [x + 10, 30],
          [x, 30],
          [x + 10, 15],
          [x, 0],
        ]);
      }
    })
    .attr('height', 30)
    .attr('x', (_, i) => i * (cP + 0.5))
    .attr('y', 0)
    .style('fill', (_, i) => `rgb(45, ${100 + 8 * i}, ${160 + 9 * i})`);
  // .style('stroke', (_, i) => `rgb(45, ${100 + 8 * i}, ${160 + 9 * i})`)
  // .style('stroke-width', 2);

  scale
    .selectAll('text')
    .data(dates)
    .enter()
    .append('text')
    .attr('class', 'scale')
    .text((d) => d)
    .attr('x', (_, i) => i * cP)
    .attr('y', 0)
    .attr('dx', (_, i) => (i === 0 ? 6 : 12))
    .attr('dy', 22)
    .attr('font-size', 20)
    .attr('style', 'font-weight: bold')
    .style('fill', 'white');
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

function getContainerData() {
  let containerWidth = svg.style('width');
  containerWidth =
    Math.floor(
      Number(containerWidth.substring(0, containerWidth.length - 2)) -
        margin.right
    ) - margin.left;

  let containerPortion =
    data.dataFormat === 'cent'
      ? containerWidth /
        (range(earliest, latest).includes(0)
          ? range(earliest, latest + 1).length - 1
          : range(earliest, latest + (earliest > 0 && latest > 0 ? 1 : 0))
              .length)
      : data.dataFormat === 'dec'
      ? containerWidth /
        (range10(findCent(earliest), findCent(latest) + 100).includes(0)
          ? range10(findCent(earliest), findCent(latest) + 100).length - 1
          : range10(
              earliest > 0 && latest > 0
                ? findCent(earliest) - 100
                : findCent(earliest),
              findCent(latest) + 100
            ).length)
      : containerWidth /
        (range(findCent(earliest), findCent(latest) + 100).includes(0)
          ? range(findCent(earliest), findCent(latest) + 100).length - 1
          : range(
              earliest > 0 && latest > 0
                ? findCent(earliest) - 99
                : findCent(earliest),
              findCent(latest) + 100
            ).length);
  return { width: containerWidth, portion: containerPortion };
}

function getLines(elements, cW, cP) {
  const lines = elements.map((elem) => wrap(elem.meaning, cW, cP, elem));

  let total = 0;
  lines.forEach((l) => (total += (l + 1) * 37));
  const newHeight = margin.top * 2.5 - 5 + total;

  svg.transition().duration(250).attr('height', newHeight);

  const linesOriginal = [...lines];
  for (let i = 0; i < lines.length; i++) {
    const l = linesOriginal[i];
    const index = i;
    if (l > 0) {
      range(index + 1, lines.length - 1).forEach((n) => (lines[n] += l));
      lines[index] -= l;
      control = l;
    }
  }
  return lines;
}

function wrap(text, cW, cP, r = 'add') {
  if (typeof text != 'string') {
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
        emergence = text.data()[0].emergence,
        disparition = text.data()[0].disparition;

      let width = cW - emergence * cP;
      if (disparition != -1 && !isNaN(disparition)) {
        const end = cW - disparition * cP;
        width = width - end;
      }

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
              [width, 0],
              [width + 10, 15 * yModifier],
              [width, 30 * yModifier],
              [0, 30 * yModifier],
              [0, 0],
            ])
          );
        }
      }
    });
  } else {
    let words = text.split(/\s+/).reverse(),
      word,
      line = [],
      lineNumber = 0,
      emergence = r.emergence,
      disparition = r.disparition;
    let width = cW - emergence * cP;
    if (disparition != -1 && !isNaN(disparition)) {
      const end = cW - disparition * cP;
      width = width - end;
    }
    while ((word = words.pop())) {
      line.push(word);
      if (line.join(' ').length * 6 > width) {
        line.pop();
        line = [word];
        ++lineNumber;
      }
    }
    return lineNumber;
  }
}

function exportToCanvas(event) {
  event.preventDefault();

  let svgWidth = svg.style('width');
  svgWidth = Number(svgWidth.substring(0, svgWidth.length - 2));

  let svgHeight = svg.style('height');
  svgHeight = Number(svgHeight.substring(0, svgHeight.length - 2));

  svg.attr('width', svgWidth);
  const svgNode = svg.node();

  const canvas = document.createElement('canvas');
  canvas.width = svgWidth;
  canvas.height = svgHeight;

  var ctx = canvas.getContext('2d');
  var data = new XMLSerializer().serializeToString(svgNode);
  var DOMURL = window.URL || window.webkitURL || window;

  var img = new Image();
  var svgBlob = new Blob([data], { type: 'image/svg+xml' });
  var url = DOMURL.createObjectURL(svgBlob);

  img.onload = function () {
    ctx.drawImage(img, 0, 0);
    DOMURL.revokeObjectURL(url);

    var imgURI = canvas
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');

    triggerDownload(imgURI);
  };

  img.src = url;
}

function triggerDownload(imgURI) {
  const evt = new MouseEvent('click', {
    view: window,
    bubbles: false,
    cancelable: true,
  });

  const a = document.createElement('a');
  a.setAttribute('download', 'semantic_map.png');
  a.setAttribute('href', imgURI);
  a.setAttribute('target', '_blank');

  a.dispatchEvent(evt);
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

function range10(start, end) {
  return Array((end - start + 10) / 10)
    .fill()
    .map((_, idx) => start + idx * 10);
}

function getTextWidth(text) {
  // create a dummy element
  const dummy = document.createElement('span');
  dummy.id = 'ruler';
  dummy.innerHTML = text;
  dummy.style.visibility = 'hidden';
  dummy.style.whiteSpace = 'nowrap';
  dummy.style.fontFamily = 'Arial, Helvetica, sans-serif';
  dummy.style.fontSize = '12px';
  document.body.appendChild(dummy);

  const dummyWidth = $('#ruler').width();
  document.body.removeChild(document.getElementById('ruler'));
  return dummyWidth;
}

function getCoords(path) {
  path = d3.select(path);
  d = path.attr('d').split(/(?=[LMC])/);
  return d.map((coord) => {
    coord = coord.substring(1);
    return coord.split(',');
  });
}

function centuryFromYear(year) {
  const century = Math.floor((Math.abs(year) - 1) / 100) + 1;
  if (year > 0) {
    return century;
  } else {
    return -1 * century;
  }
}

function findCent(dec) {
  if (dec % 10 == 0) {
    if (dec % 100 != 0) {
      while (dec % 100 != 0) {
        if (dec < 0) {
          dec -= 10;
        } else {
          dec += 10;
        }
      }
    } else {
      if (dec < 0) {
        dec -= 100;
      } else {
        dec += 100;
      }
    }
  } else {
    while (dec % 100 != 0) {
      if (dec < 0) {
        dec -= 1;
      } else {
        dec += 1;
      }
    }
  }
  return dec;
}

if (data) {
  basicDisplay();
}

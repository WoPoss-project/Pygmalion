/* DOM constants definition */
const headwordInput = document.getElementById('headwordInput');
const dateSpec = document.getElementById('dateSpec');
const addSense = document.getElementById('addSense');
const newSenses = document.getElementById('newSenses');
const etymologyArea = document.getElementById('etymology');
const etymologicalStep = document.getElementById('etymologicalStep');
const submitForm = document.getElementById('submitForm');

// Event on the "Add a sense" button
addSense.addEventListener('click', createSense);

// Event on the select-type input for the date format
dateSpec.addEventListener('change', function () {
  const dates = document.querySelectorAll('.date');
  const change = event.target.value;
  dates.forEach((el) => {
    const value = el.value;
    const parent = el.parentNode;
    const newChild = modalDatePicker(change);
    newChild.value = value;
    parent.replaceChild(newChild, el);
  });
});

etymologicalStep.addEventListener('click', addEtymologicalStep);

submitForm.addEventListener('click', confirmForm);

// Function to add an etymological step
function addEtymologicalStep(event) {
  event.preventDefault();

  etymologicalStep.style.float = 'right';

  const div = document.createElement('div');
  div.className = 'etymologyStep';

  const etymologyLabel = document.querySelectorAll('.ety');
  const label = document.createElement('label');
  label.className = 'ety';
  if (etymologyLabel.length === 0) {
    label.innerHTML = 'Origin';
  } else {
    const labelValue = etymologyLabel[etymologyLabel.length - 1].innerHTML;
    if (labelValue === 'Origin') {
      label.innerHTML = 'Evolution 1';
    } else {
      label.innerHTML = `Evolution ${Number(labelValue.split(' ')[1]) + 1}`;
    }
  }

  const etymologyDelete = document.createElement('label');
  etymologyDelete.innerHTML = 'Delete entry';
  etymologyDelete.className = 'delete';
  etymologyDelete.addEventListener('click', deleteEntry);

  const br = document.createElement('br');

  const periodDiv = document.createElement('div');
  periodDiv.className = 'col-33';

  const period = document.createElement('input');
  period.type = 'text';
  period.className = 'period';
  period.placeholder = 'e.g. PIE, PI, LAT, ...';

  const etymologicalDiv = document.createElement('div');
  etymologicalDiv.className = 'col-33';

  const etymologicalForm = document.createElement('input');
  etymologicalForm.type = 'text';
  etymologicalForm.className = 'etymologicalForm';
  etymologicalForm.placeholder = 'Etymological form...';

  const definitionlDiv = document.createElement('div');
  definitionlDiv.className = 'col-33';

  const shortDefinition = document.createElement('input');
  shortDefinition.type = 'text';
  shortDefinition.className = 'shortDefinition';
  shortDefinition.placeholder = 'Short, one-word, definition';

  const smalls = ['Language/period', 'Etymological form', 'Short definition'];
  smalls.forEach((el) => {
    const small = document.createElement('small');
    small.innerHTML = el;
    smalls[smalls.indexOf(el)] = small;
  });

  div.appendChild(label);
  div.appendChild(etymologyDelete);
  div.appendChild(br);

  periodDiv.appendChild(period);
  periodDiv.appendChild(smalls[0]);
  div.appendChild(periodDiv);

  etymologicalDiv.appendChild(etymologicalForm);
  etymologicalDiv.appendChild(smalls[1]);
  div.appendChild(etymologicalDiv);

  definitionlDiv.appendChild(shortDefinition);
  definitionlDiv.appendChild(smalls[2]);
  div.appendChild(definitionlDiv);

  etymologyArea.appendChild(div);
}

// Add a sense/definition to the form
function createSense(event) {
  event.preventDefault();

  const definition = document.createElement('div');
  definition.className = 'definition';

  const definitionRow = document.createElement('div');
  definitionRow.className = 'row';

  const senseLabelDiv = document.createElement('div');
  senseLabelDiv.className = 'col-25';
  const senseLabel = document.createElement('label');
  senseLabel.innerHTML = 'Definition';

  senseLabelDiv.appendChild(senseLabel);

  const senseInputDiv = document.createElement('div');
  senseInputDiv.className = 'col-75';
  const senseInput = document.createElement('input');
  senseInput.type = 'text';
  senseInput.className = 'definitionText';
  senseInput.placeholder = 'Please enter a definition for the headword...';

  senseInputDiv.appendChild(senseInput);

  definitionRow.appendChild(senseLabelDiv);
  definitionRow.appendChild(senseInputDiv);

  groupRow = selectRow('Semantic group', 'group', 'Add a group...');
  constructRow = selectRow(
    'Construction',
    'construction',
    'Add a construction...'
  );

  const xRow = document.createElement('div');
  xRow.className = 'row';
  const xDiv = document.createElement('div');
  xDiv.className = 'col-100';
  const x = document.createElement('span');
  x.innerHTML = 'x';
  x.className = 'deleteDefinition';
  x.addEventListener('click', deleteDefinition);

  xDiv.appendChild(x);
  xRow.appendChild(xDiv);

  definition.appendChild(xRow);
  definition.appendChild(definitionRow);
  definition.appendChild(constructRow);
  definition.appendChild(groupRow);
  definition.appendChild(createModality());

  newSenses.appendChild(definition);
}

// Takes in the value of the select-type input for the date format
// Creates and returns an input element with the correct values
function modalDatePicker(spec) {
  const dateElement = document.createElement('input');
  dateElement.className = 'date';
  if (spec === 'cent') {
    dateElement.type = 'text';
    dateElement.placeholder = 'Century (II BC, I BC, I, II) or Year';
  } else if (spec === 'dec') {
    dateElement.type = 'text';
    dateElement.placeholder = 'Decade (200s BC, 130s BC, 30s, 1920s) or Year';
  } else {
    dateElement.type = 'text';
    dateElement.placeholder = 'Please enter a specific year';
  }
  return dateElement;
}

// Allows us to create the modality part of the form
function createModality(event) {
  // Definition of the global elements
  let div = document.createElement('div');
  div.className = 'modal';

  const modalityLabel = document.createElement('label');
  modalityLabel.innerHTML = 'Modality';

  const deleteModalLabel = document.createElement('label');
  deleteModalLabel.innerHTML = 'Delete modality';
  deleteModalLabel.className = 'delete';
  deleteModalLabel.addEventListener('click', deleteEntry);

  const modalAttestation = document.createElement('input');
  modalAttestation.type = 'text';
  modalAttestation.className = 'attest';
  modalAttestation.placeholder = "Modality's first attestation";

  const smalls = [
    'Modality type',
    'Modality/Meaning emergence date',
    'First attestation',
  ];

  smalls.forEach((el) => {
    const small = document.createElement('small');
    small.innerHTML = el;
    smalls[smalls.indexOf(el)] = small;
  });

  const confidenceCheckbox = document.createElement('input');
  confidenceCheckbox.type = 'checkbox';
  confidenceCheckbox.name = 'certitude';
  confidenceCheckbox.className = 'certitude';
  confidenceCheckbox.checked = true;

  const confidenceLabel = document.createElement('label');
  confidenceLabel.innerHTML = 'Modal meaning is certain';

  // If the function was called by an event...
  if (event) {
    // ... this means that we need to add a modality to the modality list
    event.preventDefault();

    const newModalArea = event.target.parentNode.querySelector('.modals');

    div = mainModal(
      div,
      modalityLabel,
      deleteModalLabel,
      smalls,
      modalAttestation,
      confidenceCheckbox,
      confidenceLabel
    );

    newModalArea.appendChild(div);
  } else {
    // ... or else we need to create a new modality list as well as a modality
    const row = document.createElement('div');
    row.className = 'row';

    const modalLabelDiv = document.createElement('div');
    modalLabelDiv.className = 'col-25';
    const modalLabel = document.createElement('label');
    modalLabel.innerHTML = '&nbsp;';
    modalLabel.className = 'modalLabel';
    modalLabelDiv.appendChild(modalLabel);

    const modalitiesRowDiv = document.createElement('div');
    modalitiesRowDiv.className = 'col-75';
    const modalitiesDiv = document.createElement('div');
    modalitiesDiv.className = 'modals';

    div = mainModal(
      div,
      modalityLabel,
      deleteModalLabel,
      smalls,
      modalAttestation,
      confidenceCheckbox,
      confidenceLabel
    );

    modalitiesDiv.appendChild(div);
    modalitiesRowDiv.appendChild(modalitiesDiv);

    const newModalButton = document.createElement('button');
    newModalButton.innerHTML = 'Add modal meaning';
    newModalButton.style.width = '100%';
    newModalButton.addEventListener('click', createModality);
    modalitiesRowDiv.appendChild(newModalButton);

    row.appendChild(modalLabelDiv);
    row.appendChild(modalitiesRowDiv);
    return row;
  }
}

// General function for main modality elements
function mainModal(div, lab, del, smalls, test, check, conf) {
  div.appendChild(lab);
  div.appendChild(del);
  div.appendChild(createModalSelect());
  div.appendChild(smalls[0]);
  div.appendChild(modalDatePicker(dateSpec.value));
  div.appendChild(smalls[1]);
  div.appendChild(test);
  div.appendChild(smalls[2]);
  div.appendChild(check);
  div.appendChild(conf);
  return div;
}

function selectRow(lab, cla, opt) {
  const row = document.createElement('div');
  row.className = 'row';

  const labelDiv = document.createElement('div');
  labelDiv.className = 'col-25';
  const label = document.createElement('label');
  label.innerHTML = lab;

  labelDiv.appendChild(label);

  const selectDiv = document.createElement('div');
  selectDiv.className = 'col-75';
  const select = document.createElement('select');
  select.className = cla;
  const existingSelects = document.querySelector(`.${cla}`);
  const groups = [];
  if (!existingSelects) {
    groups.push('None', opt);
  } else {
    existingSelects.childNodes.forEach((el) => groups.push(el.innerHTML));
  }
  groups.forEach((t) => {
    const option = document.createElement('option');
    option.value = t;
    option.innerHTML = t;
    select.appendChild(option);
  });

  if (cla === 'group') {
    select.addEventListener('change', change);
  } else {
    select.addEventListener('change', change);
  }

  selectDiv.appendChild(select);

  row.appendChild(labelDiv);
  row.appendChild(selectDiv);

  return row;
}

// General function to generate a select-type input with the modal types
function createModalSelect() {
  const modalSelect = document.createElement('select');
  const options = [
    ['Not modal', 'notModal'],
    ['Modal: deontic', 'deontic'],
    ['Modal: dynamic', 'dynamic'],
    ['Modal: epistemic', 'epistemic'],
    ['Premodal', 'premodal'],
    ['Postmodal', 'postmodal'],
  ];

  for (optionIndex in options) {
    const option = document.createElement('option');
    option.innerHTML = options[optionIndex][0];
    option.value = options[optionIndex][1];
    modalSelect.appendChild(option);
  }
  return modalSelect;
}

// Function to delete a modality
function deleteEntry(event) {
  const parent = event.target.parentNode;
  const grandParent = parent.parentNode;
  // Will not work if the user is about to delete the only modality for a definition
  if (
    (grandParent.childNodes.length > 1 && parent.className === 'modal') ||
    parent.className === 'etymologyStep'
  ) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
    grandParent.removeChild(parent);
    if (
      parent.className === 'etymologyStep' &&
      grandParent.childNodes.length <= 0
    ) {
      etymologicalStep.style.float = 'left';
    }
  } else {
    Swal.fire({
      icon: 'warning',
      title: 'Caution!',
      text: 'Each sense/definition should have at least one modality',
    });
  }
}

function deleteDefinition(event) {
  event.preventDefault();

  const col100 = event.target.parentNode;
  const row = col100.parentNode;
  const definition = row.parentNode;

  while (definition.firstChild) {
    const rows = definition.firstChild;
    while (rows.firstChild) {
      const cols = rows.firstChild;
      while (cols.firstChild) {
        const element = cols.firstChild;
        cols.removeChild(element);
      }
      rows.removeChild(cols);
    }
    definition.removeChild(rows);
  }

  definition.parentNode.removeChild(definition);
}

// Function to handle the changes of the selects elements for group selection
function change(event) {
  let selectedValue;
  event.preventDefault();
  selectedValue = event.target.value;

  if (
    selectedValue === 'Add a group...' ||
    selectedValue === 'Add a construction...'
  ) {
    selectedValue = selectedValue.split(' ');
    const newElement = selectedValue[selectedValue.length - 1].split('.')[0];
    Swal.fire({
      title: `Please type a name for the new ${newElement}`,
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off',
      },
      confirmButtonText: 'Confirm',
      showCancelButton: true,
      preConfirm: (value) => {
        if (value != '') {
          addGroup(value, newElement, event.target);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Failed',
            text: 'Please make sure the field is not empty',
            preConfirm: () => {
              change((event = event));
            },
          });
        }
      },
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.cancel) {
        event.target.value = 'None';
      }
    });
  }
}

// Adds the new group to every select element for group selection
function addGroup(opt, elem, select) {
  const selects = document.getElementsByClassName(elem);

  for (let i = 0; i < selects.length; i++) {
    const option = document.createElement('option');
    option.value = opt;
    option.innerHTML = opt;
    selects[i].options.add(option, selects[i].length - 1);
  }

  select.value = opt;
}

function confirmForm(event) {
  event.preventDefault();

  const headwordInput = document.getElementById('headwordInput');
  const dateSpec = document.getElementById('dateSpec');
  const definitionTexts = document.querySelectorAll('.definition');

  if (headwordInput.value != '') {
    if (definitionTexts.length > 0) {
      let etymology = [[], [], []];
      const etymologyPeriods = document.querySelectorAll('.period');
      const etymologyForms = document.querySelectorAll('.etymologicalForm');
      const etymologyDefinitions = document.querySelectorAll(
        '.shortDefinition'
      );
      etymologyPeriods.forEach((el) => etymology[0].push(el.value));
      etymologyForms.forEach((el) => etymology[1].push(el.value));
      etymologyDefinitions.forEach((el) => etymology[2].push(el.value));
      const etymologicalData = [];
      for (let c = 0; c < etymology[0].length; c++) {
        const data = [];
        for (let i = 0; i < etymology.length; i++) {
          for (let j = 0; j < etymology[i].length; j++) {
            if (j === c) {
              data.push(etymology[i][j]);
            }
          }
        }
        etymologicalData.push({
          period: data[0],
          form: data[1],
          def: data[2],
        });
      }

      let missingField = false;
      const definitions = [];
      definitionTexts.forEach((definition) => {
        const v = [];
        const rows = definition.childNodes;
        rows.forEach((row) => {
          const cols = row.childNodes;
          cols.forEach((col) => {
            if (col.className == 'col-75') {
              const values = col.childNodes;
              values.forEach((value) => {
                if (value.value || value.value === '') {
                  if (
                    (value.value === '' && value.nodeName != 'BUTTON') ||
                    value.value === 'Add a group...' ||
                    value.value === 'Add a construction...'
                  ) {
                    mandatory(value);
                    missingField = true;
                  }

                  v.push(value.value);
                } else {
                  const modalities = value.childNodes;
                  let modalityValues = [];
                  modalities.forEach((modality) => {
                    const modalityElements = modality.childNodes;
                    modalityElements.forEach((modEl) => {
                      if (modEl.value || modEl.value === '') {
                        if (
                          modEl.value === '' &&
                          modEl.nodeName != 'BUTTON' &&
                          modEl.className != 'attest'
                        ) {
                          mandatory(modEl);
                          missingField = true;
                        }
                        if (modEl.type === 'checkbox') {
                          modalityValues.push(modEl.checked);
                        } else if (modEl.className === 'date') {
                          modalityValues.push(
                            dateConversion(dateSpec.value, modEl)
                          );
                        } else {
                          modalityValues.push(modEl.value);
                        }
                      }
                    });
                    const modalityObject = {
                      id: randomId(),
                      modal: modalityValues[0],
                      emergence: modalityValues[1],
                      attestation: modalityValues[2],
                      certainty: modalityValues[3],
                    };
                    if (v.length == 4) {
                      v[3].push(modalityObject);
                    } else {
                      v.push([modalityObject]);
                    }
                    modalityValues = [];
                  });
                }
              });
            }
          });
        });
        definitions.push({
          definition: v[0],
          construct: v[1],
          group: v[2],
          modalities: v[3],
        });
      });
      const data = {
        headword: headwordInput.value,
        etymology: etymologicalData,
        dataFormat: dateSpec.value,
        meanings: definitions,
      };
      if (!missingField) {
        localStorage.setItem('card', JSON.stringify(data));
        console.log(JSON.parse(localStorage.getItem('card')));
      } else {
        swal.fire({
          icon: 'error',
          title: 'Error!',
          text:
            'Please fill in all the mandatory fields and make sure the emergence dates are encoded correctly!',
        });
      }
      return;
    } else {
      swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'At least one definition is required',
      });
    }
  } else {
    swal.fire({
      icon: 'error',
      title: 'Error!',
      text: 'Please specify a headword',
    });
    mandatory(headwordInput);
  }
}

function mandatory(element) {
  element.style.border = '1px solid rgb(226, 70, 70)';
  element.addEventListener('change', function (event) {
    event.target.style.border = '1px solid #ccc';
  });
}

function dateConversion(format, element) {
  let date;
  if (format === 'cent') {
    let century;
    if (Number(element.value)) {
      century = centuryFromYear(Number(element.value));
    } else {
      const conversion = {
        M: 1000,
        D: 500,
        C: 100,
        L: 50,
        X: 10,
        V: 5,
        I: 1,
      };
      const value = element.value.split(' ');
      const arr = value[0].split('');

      let total = 0;
      let c, cV, n, nV;
      for (let i = 0; i < arr.length; i++) {
        c = arr[i];
        cV = conversion[c];

        n = arr[i + 1];
        nV = conversion[n];

        cV >= nV
          ? (total += cV)
          : cV < nV
          ? (total -= cV)
          : cV && !nV
          ? (total += cV)
          : total;
      }
      value.length > 1 ? (century = -1 * total) : (century = total);
    }
    if (
      century >= -50 &&
      century <= 21 &&
      typeof century == 'number' &&
      century
    ) {
      date = century;
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Date encoding error!',
        text:
          'Dates are not encoded correctly. Century format is as follows: "II BC", "IX BC", "VI BC" for the centuries before Christ and "II", "XX", "IV" for the centuries after Christ. Specific years should be typed as follows: "1700", "100", "-50", "-500". Centuries will be inferred from the years.',
      });
      mandatory(element);
    }
  } else if (format === 'dec') {
    let decade;
    if (Number(element.value)) {
      decade = decadeFromYear(element.value) + 's';
    } else {
      const input = element.value.split(' ');
      if (input.length == 1 || input.length == 2) {
        const dec = input[0];
        if (
          dec[dec.length - 1] == 's' &&
          dec[dec.length - 2] == '0' &&
          Number(dec[0])
        ) {
          input.length == 2 ? (decade = '-' + input[0]) : (decade = input[0]);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Date encoding error!',
            text:
              'Dates are not encoded correctly. Please make sure you format decades as follows: "200s BC", "50s BC", "10s", "1920s".',
          });
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Date encoding error!',
          text:
            'Dates are not encoded correctly. Please make sure you format decades as follows: "200s BC", "50s BC", "10s", "1920s".',
        });
      }
    }
    decade = Number(decade.slice(0, -1));
    if (
      decade >= -5000 &&
      decade <= 2020 &&
      typeof decade == 'number' &&
      decade
    ) {
      date = decade;
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Date encoding error!',
        text:
          'Dates are not encoded correctly. Please make sure you format decades as follows: "200s BC", "50s BC", "10s", "1920s", or that you entered a valid year (-202, -19, 1414, 1932)',
      });
    }
  } else if (
    Number(element.value) &&
    Number(element.value) >= -5000 &&
    Number(element.value) <= 2020
  ) {
    date = Number(element.value);
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Error!',
      text:
        'Dates are not encoded correctly. Please make sure the years you entered are correct',
    });
  }
  return date;
}

function centuryFromYear(year) {
  const century = Math.floor((Math.abs(year) - 1) / 100) + 1;
  if (year > 0) {
    return century;
  } else {
    return -1 * century;
  }
}

function decadeFromYear(year) {
  const arr = year.split('');
  arr[arr.length - 1] = '0';
  const decade = Number(arr.join(''));
  return decade;
}

function randomId() {
  return Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '')
    .substr(2, 10);
}

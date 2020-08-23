/* DOM constants definition */
const headwordInput = document.getElementById('headwordInput');
const dateSpec = document.getElementById('dateSpec');
const addSense = document.getElementById('addSense');
const newSenses = document.getElementById('newSenses');
const etymologyArea = document.getElementById('etymology');
const etymologicalStep = document.getElementById('etymologicalStep');
const noEtymology = document.getElementById('noEtymology');
const etymologyUnknown = document.getElementById('etymologyUnknown');
const submitForm = document.getElementById('submitForm');

let withEtymology = true;
let etymologyIsKnown = true;

// Event on the "Add a meaning" button
addSense.addEventListener('click', createSense);

// Event on the select-type input for the date format
dateSpec.addEventListener('change', function () {
  const dates = [...document.querySelectorAll('.date')];
  [...document.querySelectorAll('.disp')].forEach((e) => dates.push(e));
  const change = event.target;
  dates.forEach((el) => {
    const value = el.value;
    const parent = el.parentNode;
    const newChild = modalDatePicker(change.value);
    newChild.value = value;
    newChild.className = el.className;
    parent.replaceChild(newChild, el);
  });
});

etymologicalStep.addEventListener('click', addEtymologicalStep);
noEtymology.addEventListener('click', proceedWithNoEtymology);
etymologyUnknown.addEventListener('click', etymologyIsUnknown);

submitForm.addEventListener('click', confirmForm);

// Function to add an etymological step
function addEtymologicalStep(event) {
  event.preventDefault();

  if (!etymologyIsKnown) {
    Swal.fire({
      icon: 'info',
      title: 'Etymology',
      text:
        'We noticed that you flagged etymology as unknown. That flag has been removed. If you change your mind, please flag it again as unknown.',
    });
    etymologyUnknown.disabled = false;
    etymologyUnknown.className = 'etymologyUnknown';
    etymologyIsKnown = true;
  }

  noEtymology.style.visibility = 'hidden';

  const div = document.createElement('div');
  div.className = 'etymologyStep';

  const labelRow = document.createElement('div');
  labelRow.className = 'row';

  const label = document.createElement('label');
  label.className = 'ety';
  label.innerHTML = 'Etymological step';

  const etymologyDelete = document.createElement('label');
  etymologyDelete.innerHTML = 'Delete entry';
  etymologyDelete.className = 'delete';
  etymologyDelete.addEventListener('click', deleteEntry);

  const br = document.createElement('br');

  const dataRow = document.createElement('div');
  dataRow.className = 'row';

  const periodDiv = document.createElement('div');
  periodDiv.className = 'col-25';

  const period = document.createElement('input');
  period.type = 'text';
  period.className = 'period';
  period.placeholder = 'e.g. PIE, PI, LAT, ...';

  const etymologicalDiv = document.createElement('div');
  etymologicalDiv.className = 'col-25';

  const etymologicalForm = document.createElement('input');
  etymologicalForm.type = 'text';
  etymologicalForm.className = 'etymologicalForm';
  etymologicalForm.placeholder = 'Etymological form...';

  const definitionlDiv = document.createElement('div');
  definitionlDiv.className = 'col-25';

  const shortDefinition = document.createElement('input');
  shortDefinition.type = 'text';
  shortDefinition.className = 'shortDefinition';
  shortDefinition.placeholder = 'Short, one-word, definition';

  const etymologicalStepConfidenceDiv = document.createElement('div');
  etymologicalStepConfidenceDiv.className = 'col-25';

  const etymologicalStepConfidence = document.createElement('input');
  etymologicalStepConfidence.type = 'checkbox';
  etymologicalStepConfidence.name = 'etyConfidence';
  etymologicalStepConfidence.className = 'etyConfidence';
  etymologicalStepConfidence.checked = true;

  const etymologicalStepConfidenceLabel = document.createElement('label');
  etymologicalStepConfidenceLabel.innerHTML = 'Etymology is certain';

  const smalls = ['Language/period', 'Etymological form', 'Short definition'];
  smalls.forEach((el) => {
    const small = document.createElement('small');
    small.innerHTML = el;
    smalls[smalls.indexOf(el)] = small;
  });

  labelRow.appendChild(label);
  labelRow.appendChild(etymologyDelete);
  labelRow.appendChild(br);

  div.appendChild(labelRow);

  periodDiv.appendChild(period);
  periodDiv.appendChild(smalls[0]);
  dataRow.appendChild(periodDiv);

  etymologicalDiv.appendChild(etymologicalForm);
  etymologicalDiv.appendChild(smalls[1]);
  dataRow.appendChild(etymologicalDiv);

  definitionlDiv.appendChild(shortDefinition);
  definitionlDiv.appendChild(smalls[2]);
  dataRow.appendChild(definitionlDiv);

  etymologicalStepConfidenceDiv.appendChild(etymologicalStepConfidence);
  etymologicalStepConfidenceDiv.appendChild(etymologicalStepConfidenceLabel);
  dataRow.appendChild(etymologicalStepConfidenceDiv);

  div.appendChild(dataRow);

  etymologyArea.appendChild(div);
}

function proceedWithNoEtymology(event) {
  event.preventDefault();
  Swal.fire({
    icon: 'info',
    title: 'No etymology',
    text:
      'We have registered your choice to not include an etymology. If you change your mind, simply click "Proceed with etymology"',
  });
  etymologicalStep.style.visibility = 'hidden';
  noEtymology.innerHTML = 'Proceed with etymology';
  noEtymology.removeEventListener('click', proceedWithNoEtymology);
  noEtymology.addEventListener('click', proceedWithEtymology);
  withEtymology = false;
}

function proceedWithEtymology(event) {
  event.preventDefault();
  etymologicalStep.style.visibility = 'visible';
  noEtymology.innerHTML = 'Proceed without etymology';
  noEtymology.removeEventListener('click', proceedWithEtymology);
  noEtymology.addEventListener('click', proceedWithNoEtymology);
  withEtymology = true;
}

function etymologyIsUnknown(event) {
  event.preventDefault();
  Swal.fire({
    icon: 'info',
    title: 'Etymology flagged as unknown',
    text:
      'We have taken note that the etymology is unkown. If you change your mind, simply click "Add etymological step"',
  });
  noEtymology.style.visibility = 'hidden';
  if (etymologicalStep.style.visibility === 'hidden') {
    etymologicalStep.style.visibility = 'visible';
  }
  etymologyUnknown.disabled = true;
  etymologyUnknown.className = 'etymologyUnknownDisabled';
  etymologyIsKnown = false;
  withEtymology = true;
  if (etymologyArea.childNodes.length > 0) {
    deleteAllEtymology();
  }
}

function deleteAllEtymology() {
  const parent = etymologyArea;
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
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
  senseLabel.innerHTML = 'Meaning / function / use';

  senseLabelDiv.appendChild(senseLabel);

  const senseInputDiv = document.createElement('div');
  senseInputDiv.className = 'col-75';
  const senseInput = document.createElement('input');
  senseInput.type = 'text';
  senseInput.className = 'definitionText';
  senseInput.placeholder =
    'Please enter a meaning / function / use for the headword...';

  senseInputDiv.appendChild(senseInput);

  definitionRow.appendChild(senseLabelDiv);
  definitionRow.appendChild(senseInputDiv);

  groupRow = selectRow('Semantic group', 'group', 'Add a group...');
  constructRow = selectRow(
    'Collocation',
    'collocation',
    'Add a collocation...'
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
  modalityLabel.innerHTML = 'Description';

  const deleteModalLabel = document.createElement('label');
  deleteModalLabel.innerHTML = 'Delete description';
  deleteModalLabel.className = 'delete';
  deleteModalLabel.addEventListener('click', deleteEntry);

  const modalAttestation = document.createElement('input');
  modalAttestation.type = 'text';
  modalAttestation.className = 'attest';
  modalAttestation.placeholder = 'First attestation(s)';

  const smalls = [
    'Modality type',
    'Date of meaning emergence',
    'Date of meaning disappearance',
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
  confidenceLabel.innerHTML = '(Modal) meaning is certain';

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
    newModalButton.innerHTML = 'Add new (modal) description';
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
  let date = modalDatePicker(dateSpec.value);
  date.className = 'date';
  div.appendChild(date);
  div.appendChild(smalls[1]);
  let disp = modalDatePicker(dateSpec.value);
  disp.className = 'disp';
  div.appendChild(disp);
  div.appendChild(smalls[2]);
  div.appendChild(test);
  div.appendChild(smalls[3]);
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

  select.addEventListener('change', change);

  selectDiv.appendChild(select);

  row.appendChild(labelDiv);
  row.appendChild(selectDiv);

  return row;
}

// General function to generate a select-type input with the modal types
function createModalSelect() {
  const modalSelect = document.createElement('select');

  const existingSelects = document.querySelector(`.modality`);
  const options = [];
  if (!existingSelects) {
    options.push(
      'Not modal',
      'Modal: deontic',
      'Modal: dynamic',
      'Modal: epistemic',
      'Premodal',
      'Postmodal',
      'Add a modality...'
    );
  } else {
    existingSelects.childNodes.forEach((el) => options.push(el.innerHTML));
  }

  for (optionIndex in options) {
    const option = document.createElement('option');
    option.innerHTML = options[optionIndex];
    option.value = options[optionIndex];
    modalSelect.appendChild(option);
  }

  modalSelect.className = 'modality';
  modalSelect.addEventListener('change', change);

  return modalSelect;
}

// Function to delete a modality
function deleteEntry(event) {
  let parent = event.target.parentNode;
  let grandParent = parent.parentNode;
  const grandGrandParent = grandParent.parentNode;
  // Will not work if the user is about to delete the only modality for a definition
  if (
    (grandParent.childNodes.length > 1 && parent.className === 'modal') ||
    grandParent.className === 'etymologyStep'
  ) {
    if (
      grandParent.className === 'etymologyStep' &&
      grandGrandParent.childNodes.length - 1 == 0
    ) {
      noEtymology.style.visibility = 'visible';
    }
    if (grandParent.className === 'etymologyStep') {
      parent = grandParent;
      grandParent = grandGrandParent;
    }
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
    grandParent.removeChild(parent);
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
    selectedValue === 'Add a collocation...' ||
    selectedValue === 'Add a modality...'
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
      let etymologicalData;
      if (withEtymology && etymologyIsKnown) {
        let etymology = [[], [], [], []];
        const etymologyPeriods = document.querySelectorAll('.period');
        const etymologyForms = document.querySelectorAll('.etymologicalForm');
        const etymologyDefinitions = document.querySelectorAll(
          '.shortDefinition'
        );
        const etymologyConfidence = document.querySelectorAll('.etyConfidence');
        etymologyPeriods.forEach((el) => etymology[0].push(el.value));
        etymologyForms.forEach((el) => etymology[1].push(el.value));
        etymologyDefinitions.forEach((el) => etymology[2].push(el.value));
        etymologyConfidence.forEach((el) => etymology[3].push(el.checked));

        etymologicalData = [];
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
            certitude: data[3],
          });
        }
      } else if (!withEtymology) {
        etymologicalData = false;
      } else {
        etymologicalData = 'unknown';
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
                    value.value === 'Add a collocation...'
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
                          modEl.className != 'disp' &&
                          modEl.nodeName != 'BUTTON' &&
                          modEl.className != 'attest'
                        ) {
                          mandatory(modEl);
                          missingField = true;
                        } else if (modEl.type === 'checkbox') {
                          modalityValues.push(modEl.checked);
                        } else if (
                          modEl.className === 'date' ||
                          modEl.className === 'disp'
                        ) {
                          if (
                            modEl.className === 'disp' &&
                            modEl.value === ''
                          ) {
                            modalityValues.push('None');
                          } else {
                            let conversion = dateConversion(
                              dateSpec.value,
                              modEl
                            );
                            if (conversion) {
                              modalityValues.push(conversion);
                            } else {
                              missingField = true;
                            }
                          }
                        } else {
                          modalityValues.push(modEl.value);
                        }
                      }
                    });
                    const modalityObject = {
                      id: randomId(),
                      modal: modalityValues[0],
                      emergence: modalityValues[1],
                      disparition: modalityValues[2],
                      attestation: modalityValues[3],
                      certainty: modalityValues[4],
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
        normalForm: true,
        headword: headwordInput.value,
        etymology: etymologicalData,
        dataFormat: dateSpec.value,
        meanings: definitions,
      };
      if (!missingField) {
        localStorage.setItem('map', JSON.stringify(data));
        console.log(JSON.parse(localStorage.getItem('map')));
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'The form was submitted without errors!',
        });
      } else {
        swal.fire({
          icon: 'error',
          title: 'Error!',
          text:
            'Please fill in all the mandatory fields and make sure the emergence dates are encoded according to the documentation!',
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
      return false;
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
          mandatory(element);
          return false;
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Date encoding error!',
          text:
            'Dates are not encoded correctly. Please make sure you format decades as follows: "200s BC", "50s BC", "10s", "1920s".',
        });
        mandatory(element);
        return false;
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
      mandatory(element);
      return false;
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
    mandatory(element);
    return false;
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
  let decade = Number(year);
  while (decade % 10 != 0) {
    if (decade < 0) {
      decade--;
    } else {
      decade++;
    }
  }
  return decade;
}

function randomId() {
  return Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '')
    .substr(2, 10);
}

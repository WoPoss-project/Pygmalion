/* DOM constants definition */
const headwordInput = document.getElementById('headwordInput');
const dateSpec = document.getElementById('dateSpec');
const addSense = document.getElementById('addSense');
const newSenses = document.getElementById('newSenses');
const etmyologyArea = document.getElementById('etymology');
const etymologicalStep = document.getElementById('etymologicalStep');

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
    dateElement.placeholder = 'Decade or Year';
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
  deleteModalLabel.addEventListener('click', deleteModal);

  const modalTestimony = document.createElement('input');
  modalTestimony.type = 'text';
  modalTestimony.placeholder = "Modality's first testimony";

  const smalls = [
    'Modality type',
    'Modality/Sense emergence date',
    'Modality testimony',
  ];

  smalls.forEach((el) => {
    const small = document.createElement('small');
    small.innerHTML = el;
    smalls[smalls.indexOf(el)] = small;
  });

  const confidenceCheckbox = document.createElement('input');
  confidenceCheckbox.type = 'checkbox';
  confidenceCheckbox.name = 'certitude';
  confidenceCheckbox.value = 'certitude';
  confidenceCheckbox.className = 'certitude';
  confidenceCheckbox.checked = true;

  const confidenceLabel = document.createElement('label');
  confidenceLabel.innerHTML = 'Confidence in the modality';

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
      modalTestimony,
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
      modalTestimony,
      confidenceCheckbox,
      confidenceLabel
    );

    modalitiesDiv.appendChild(div);
    modalitiesRowDiv.appendChild(modalitiesDiv);

    const newModalButton = document.createElement('button');
    newModalButton.innerHTML = 'Add a modality';
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

// General function to generate a select-type input with the modal types
function createModalSelect() {
  const modalSelect = document.createElement('select');
  const options = [
    ['Not modal', 'notModal'],
    ['Modal: deontic', 'deontic'],
    ['Modal: dynamic', 'dynamic'],
    ['Modal: epistemic', 'epistemic'],
    ['Premodal', 'premodal'],
    ['Postmodal: futurity', 'postmodal'],
  ];

  for (optionIndex in options) {
    const option = document.createElement('option');
    option.innerHTML = options[optionIndex][0];
    option.value = options[optionIndex][1];
    modalSelect.appendChild(option);
  }
  return modalSelect;
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
  senseInput.placeholder = 'Please enter a definition for the headword...';

  senseInputDiv.appendChild(senseInput);

  definitionRow.appendChild(senseLabelDiv);
  definitionRow.appendChild(senseInputDiv);

  const groupRow = document.createElement('div');
  groupRow.className = 'row';

  const groupLabelDiv = document.createElement('div');
  groupLabelDiv.className = 'col-25';
  const groupLabel = document.createElement('label');
  groupLabel.innerHTML = 'Group';

  groupLabelDiv.appendChild(groupLabel);

  const groupSelectDiv = document.createElement('div');
  groupSelectDiv.className = 'col-75';
  const groupSelect = document.createElement('select');
  groupSelect.className = 'group';
  const existingSelect = document.querySelector('.group');
  let groups;
  if (!existingSelect) {
    groups = ['None', 'Add a group...'];
  } else {
    groups = [];
    existingSelect.childNodes.forEach((el) => groups.push(el.innerHTML));
  }
  groups.forEach((t) => {
    const option = document.createElement('option');
    option.value = t;
    option.innerHTML = t;
    groupSelect.appendChild(option);
  });

  groupSelect.addEventListener('change', changeGroup);

  groupSelectDiv.appendChild(groupSelect);

  groupRow.appendChild(groupLabelDiv);
  groupRow.appendChild(groupSelectDiv);

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
  definition.appendChild(groupRow);
  definition.appendChild(createModality());

  newSenses.appendChild(definition);
}

// Function to delete a modality
function deleteModal(event) {
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
  etymologyDelete.addEventListener('click', deleteModal);

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

  etmyologyArea.appendChild(div);
}

// Function to handle the changes of the selects elements for group selection
function changeGroup(event) {
  let selectedValue;
  if (event) {
    event.preventDefault();
    selectedValue = event.target.value;
  } else {
    selectedValue = 'Add a group...';
  }

  if (selectedValue === 'Add a group...') {
    Swal.fire({
      title: 'Please type a name for the new group',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off',
      },
      confirmButtonText: 'Confirm',
      showCancelButton: true,
      preConfirm: (value) => {
        if (value != '') {
          addGroup(value, event.target);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Failed',
            text: 'Please make sure the field is not empty',
            preConfirm: () => {
              changeGroup((event = event));
            },
          });
        }
      },
    });
  }
}

// Adds the new group to every select element for group selection
function addGroup(group, select) {
  const selects = document.getElementsByClassName('group');

  for (let i = 0; i < selects.length; i++) {
    const option = document.createElement('option');
    option.value = group;
    option.innerHTML = group;
    selects[i].options.add(option, selects[i].length - 1);
  }

  select.value = group;
}

/* DOM constants definition */
const headwordInput = document.getElementById('headwordInput');
const dateSpec = document.getElementById('dateSpec');
const addSense = document.getElementById('addSense');
const newSenses = document.getElementById('newSenses');

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

// Largest function of the form :
// Allows us to create the modality part of the form
function createModality(event) {
  // Definition of the global elements
  let div = document.createElement('div');
  div.className = 'modal';

  const modalityLabel = document.createElement('label');
  modalityLabel.innerHTML = 'Modality';

  const deleteModalLabel = document.createElement('label');
  deleteModalLabel.innerHTML = 'Delete modality';
  deleteModalLabel.className = 'deleteModal';
  deleteModalLabel.addEventListener('click', deleteModal);

  const modalTestimony = document.createElement('input');
  modalTestimony.type = 'text';
  modalTestimony.placeholder = "Modality's first testimony";

  smalls = createSmalls();

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

  const row = document.createElement('div');
  row.className = 'row';

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

  row.appendChild(senseLabelDiv);
  row.appendChild(senseInputDiv);

  definition.appendChild(row);
  definition.appendChild(createModality());

  newSenses.appendChild(definition);
}

// General function to create a list of smalls: DOM elements for UI
function createSmalls() {
  const smalls = [
    'Modality type',
    'Modality/Sense emergence date',
    'Modality testimony',
  ];

  const smallElements = [];
  for (smallIndex in smalls) {
    const small = document.createElement('small');
    small.innerHTML = smalls[smallIndex];
    smallElements.push(small);
  }
  return smallElements;
}

// Function to delete a modality
function deleteModal(event) {
  const modal = event.target.parentNode;
  const parent = modal.parentNode;
  // Will not work if the user is about to delete the only modality for a definition
  if (parent.childNodes.length > 1) {
    while (modal.firstChild) {
      modal.removeChild(modal.firstChild);
    }
    parent.removeChild(modal);
  } else {
    alert('At least one modality is required per definition');
  }
}

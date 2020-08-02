const relationships = document.getElementById('relationships');
const newRelationship = document.getElementById('newRelationship');
const submitForm = document.getElementById('submitForm');
let data;

if (localStorage.getItem('card')) {
  data = JSON.parse(localStorage.getItem('card'));
  addRelationship();
  newRelationship.addEventListener('click', addRelationship);
  submitForm.addEventListener('click', submit);
} else {
  window.location.replace('http://127.0.0.1:5500/generated-maps/index.html');
}

function addRelationship(event) {
  if (event) {
    event.preventDefault();
  }

  const relationship = document.createElement('div');
  relationship.className = 'relationship';

  const xRow = document.createElement('div');
  xRow.className = 'row';
  const xDiv = document.createElement('div');
  xDiv.className = 'col-100';
  const x = document.createElement('span');
  x.innerHTML = 'x';
  x.className = 'deleteDefinition';
  x.addEventListener('click', deleteRelationship);
  xDiv.appendChild(x);
  xRow.appendChild(xDiv);
  relationship.appendChild(xRow);

  const inputsRow = document.createElement('div');
  inputsRow.className = 'row';

  const smalls = createSmalls();

  const selectOriginDiv = createColDiv();
  const selectOrigin = createSelect(data.meanings);
  selectOrigin.className = 'origin';
  selectOriginDiv.appendChild(selectOrigin);
  selectOriginDiv.appendChild(smalls[0]);

  const selectDirectionDiv = createColDiv();
  const selectDirection = document.createElement('select');
  selectDirection.className = 'direction';
  const options = ['unspecified', 'from', 'to'];
  for (let i = 0; i < options.length; i++) {
    const option = document.createElement('option');
    option.innerHTML = options[i];
    option.value = options[i];
    selectDirection.appendChild(option);
  }
  selectDirectionDiv.appendChild(selectDirection);
  selectDirectionDiv.appendChild(smalls[1]);

  const selectDestDiv = createColDiv();
  const selectDest = createSelect(data.meanings);
  selectDest.className = 'dest';
  selectDestDiv.appendChild(selectDest);
  selectDestDiv.appendChild(smalls[2]);

  const checkBoxDiv = createColDiv();
  const checkBox = document.createElement('input');
  checkBox.type = 'checkbox';
  checkBox.className = 'certitude';
  checkBox.checked = true;
  const checkBoxLabel = document.createElement('label');
  checkBoxLabel.innerHTML = 'Relationship is certain';
  checkBoxDiv.appendChild(checkBox);
  checkBoxDiv.appendChild(checkBoxLabel);

  inputsRow.appendChild(selectOriginDiv);
  inputsRow.appendChild(selectDirectionDiv);
  inputsRow.appendChild(selectDestDiv);
  inputsRow.appendChild(checkBoxDiv);

  relationship.appendChild(inputsRow);

  relationships.appendChild(relationship);
}

function createSelect(meanings) {
  const select = document.createElement('select');
  for (let i = 0; i < meanings.length; i++) {
    if (meanings[i].modalities.length > 1) {
      for (let j = 0; j < meanings[i].modalities.length; j++) {
        const option = document.createElement('option');
        option.innerHTML = `${meanings[i].definition} - ${meanings[i].modalities[j].modal}`;
        option.value = meanings[i].modalities[j].id;
        select.appendChild(option);
      }
    } else {
      const option = document.createElement('option');
      option.innerHTML = meanings[i].definition;
      option.value = meanings[i].modalities[0].id;
      select.appendChild(option);
    }
  }
  return select;
}

function createColDiv() {
  const div = document.createElement('div');
  div.className = 'col-25';
  return div;
}

function deleteRelationship(event) {
  event.preventDefault();

  const col100 = event.target.parentNode;
  const xRow = col100.parentNode;
  const relationship = xRow.parentNode;

  while (relationship.firstChild) {
    const rows = relationship.firstChild;
    while (rows.firstChild) {
      const cols = rows.firstChild;
      while (cols.firstChild) {
        const element = cols.firstChild;
        cols.removeChild(element);
      }
      rows.removeChild(cols);
    }
    relationship.removeChild(rows);
  }

  relationship.parentNode.removeChild(relationship);
}

function createSmalls() {
  const smalls = ['First definition', 'Direction', 'Second definition'];
  const smallsToReturn = [];
  for (let i = 0; i < smalls.length; i++) {
    const small = document.createElement('small');
    small.innerHTML = smalls[i];
    smallsToReturn.push(small);
  }
  return smallsToReturn;
}

function submit(event) {
  event.preventDefault();

  const final = [];

  const semanticRelationships = document.querySelectorAll('.relationship');

  if (semanticRelationships.length > 0) {
    for (let i = 0; i < semanticRelationships.length; i++) {
      const dataCols = semanticRelationships[i].childNodes[1].childNodes;
      const values = [];
      for (let j = 0; j < dataCols.length; j++) {
        const value =
          dataCols[j].firstChild.type === 'checkbox'
            ? dataCols[j].firstChild.checked
            : dataCols[j].firstChild.value;
        values.push(value);
      }
      final.push({
        origin: values[0],
        direction: values[1],
        destination: values[2],
        certitude: values[3],
      });
    }

    for (let i = 0; i < final.length; i++) {
      data.meanings.forEach((meaning) => {
        if (meaning.modalities.length > 1) {
          meaning.modalities.forEach((modality) => {
            modality = addRelationships(modality);
            if (modality.id === final[i].origin) {
              modality = editModality(modality, final[i]);
            }
          });
        } else {
          let modality = meaning.modalities[0];
          modality = addRelationships(modality);
          if (modality.id === final[i].origin) {
            modality = editModality(modality, final[i]);
          }
        }
      });
    }
    localStorage.setItem('card', JSON.stringify(data));
    console.log(JSON.parse(localStorage.getItem('card')));
  }
}

function addRelationships(modality) {
  if (!('relationships' in modality)) {
    modality['relationships'] = {
      origins: [],
      destinations: [],
      unspecified: [],
    };
  }
  return modality;
}

function editModality(modality, final) {
  final.direction === 'unspecified'
    ? !modality.relationships.unspecified.includes(final.destination)
      ? modality.relationships.unspecified.push(final.destination)
      : modality
    : final.direction === 'to'
    ? !modality.relationships.destinations.includes(final.destination)
      ? modality.relationships.destinations.push(final.destination)
      : modality
    : !modality.relationships.origins.includes(final.destination)
    ? modality.relationships.origins.push(final.destination)
    : modality;
  return modality;
}

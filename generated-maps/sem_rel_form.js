const relationships = document.getElementById('relationships');
const newRelationship = document.getElementById('newRelationship');
startUp();

function startUp() {
  if (localStorage.getItem('card')) {
    const parsedData = JSON.parse(localStorage.getItem('card'));
    addRelationship(false, parsedData);
    newRelationship.addEventListener('click', function (event) {
      addRelationship(event, parsedData);
    });
    return parsedData;
  } else {
    window.location.replace('http://127.0.0.1:5500/generated-maps/index.html');
  }
}

function addRelationship(event, elements) {
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

  const selectOriginDiv = createColDiv();
  const selectOrigin = createSelect(elements.meanings);
  selectOrigin.className = 'origin';
  selectOriginDiv.appendChild(selectOrigin);

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

  const selectDestDiv = createColDiv();
  const selectDest = createSelect(elements.meanings);
  selectDest.className = 'dest';
  selectDestDiv.appendChild(selectDest);

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
        option.value = `${meanings[i].definition} - ${meanings[i].modalities[j].modal}`;
        select.appendChild(option);
      }
    } else {
      const option = document.createElement('option');
      option.innerHTML = meanings[i].definition;
      option.value = meanings[i].definition;
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

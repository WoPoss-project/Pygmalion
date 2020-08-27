// General DOM selections
const relationships = document.getElementById('relationships');
const newRelationship = document.getElementById('newRelationship');
const submitForm = document.getElementById('submitForm');
let data;

// Ensures data exists into the localStorage
if (localStorage.getItem('map')) {
  data = JSON.parse(localStorage.getItem('map'));
  newRelationship.addEventListener('click', addRelationship);
  submitForm.addEventListener('click', submit);

  let createOriginalRel = true;
  const existingRelationships = [];
  if (data.normalForm) {
    data.meanings.forEach((meaning) => {
      if (meaning.modalities.length > 1) {
        meaning.modalities.forEach((modality) => {
          if ('relationships' in modality) {
            existingRelationships.concat(
              extractValues(modality, existingRelationships)
            );
            createOriginalRel = false;
            delete modality['relationships'];
          }
        });
      } else {
        const modality = meaning.modalities[0];
        if ('relationships' in modality) {
          existingRelationships.concat(
            extractValues(modality, existingRelationships)
          );
          createOriginalRel = false;
          delete modality['relationships'];
        }
      }
    });
  } else {
    data.meanings.forEach((meaning) => {
      if ('relationships' in meaning) {
        existingRelationships.concat(
          extractValues(meaning, existingRelationships)
        );
        createOriginalRel = false;
        delete meaning['relationships'];
      }
    });

    if (createOriginalRel) addRelationship();
    if (existingRelationships.length > 0) {
      existingRelationships.forEach((rel) => {
        addRelationship();
        const relationships = [...document.querySelectorAll('.relationship')];
        const relationship = relationships[relationships.length - 1];
        relationship.childNodes.forEach((row) => {
          const cols = row.childNodes;
          if (cols.length > 1) {
            cols.forEach((col) => {
              const element = col.childNodes[0];
              if (element.className === 'origin') {
                element.value = rel.origin;
              } else if (element.className === 'direction') {
                element.value = rel.direction;
              } else if (element.className === 'dest') {
                element.value = rel.destination;
              } else if (element.className === 'certitude') {
                element.checked = rel.certitude;
              }
            });
          }
        });
      });
    }
  }

  existingRelationships.forEach((rel) => {});
} else {
  // TODO: redirect user to 1st form or home page
}

// Adds a relationship block to the form
function addRelationship(event) {
  // Verify if it has been called by an event or not
  if (event) {
    event.preventDefault();
  }

  // Main elements for relationship block
  // 1. Main div
  const relationship = document.createElement('div');
  relationship.className = 'relationship';

  // 1. x row: holds the 'x' button to delete the entry
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

  // 2. inputs row: holds all of the inputs
  const inputsRow = document.createElement('div');
  inputsRow.className = 'row';

  // 2.1. Creation of small elements
  const smalls = createSmalls();

  // 2.2 Origin div: contains text input and corresponding small element
  const selectOriginDiv = createColDiv();
  const selectOrigin = createSelect(data.meanings);
  selectOrigin.className = 'origin';
  selectOriginDiv.appendChild(selectOrigin);
  selectOriginDiv.appendChild(smalls[0]);

  // 2.3 Direction div: contains text input and corresponding small element
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

  // 2.3 Destination div: contains text input and corresponding small element
  const selectDestDiv = createColDiv();
  const selectDest = createSelect(data.meanings);
  selectDest.className = 'dest';
  selectDestDiv.appendChild(selectDest);
  selectDestDiv.appendChild(smalls[2]);

  // 2.3 Checkbox div: contains checkbox input and label
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

// Function handling the creation of select elements
function createSelect(meanings) {
  const select = document.createElement('select');
  // Create as many options as there are meanings
  for (let i = 0; i < meanings.length; i++) {
    // Checks which form was used for the main data gathering
    if (data.normalForm) {
      // Handles creation for complex form (with modalities)
      if (meanings[i].modalities.length > 1) {
        // Handles meanings which hold more than 1 modality
        for (let j = 0; j < meanings[i].modalities.length; j++) {
          const option = document.createElement('option');
          option.innerHTML = `${meanings[i].definition} - ${
            meanings[i].modalities[j].modal
          } ${
            meanings[i].group != 'None' ? '(' + meanings[i].group + ')' : ''
          }`;
          option.value = meanings[i].modalities[j].id;
          select.appendChild(option);
        }
      } else {
        // Handles meanings which hold only 1 modality
        const option = document.createElement('option');
        option.innerHTML = `${meanings[i].definition} ${
          meanings[i].group != 'None' ? '(' + meanings[i].group + ')' : ''
        }`;
        option.value = meanings[i].modalities[0].id;
        select.appendChild(option);
      }
    } else {
      // Handles creation for simple form (without modalities)
      const option = document.createElement('option');
      option.innerHTML = `${meanings[i].definition} ${
        meanings[i].group != 'None' ? '(' + meanings[i].group + ')' : ''
      }`;
      option.value = meanings[i].id;
      select.appendChild(option);
    }
  }
  return select;
}

// Function to create a div with class 'col-25'
function createColDiv() {
  const div = document.createElement('div');
  div.className = 'col-25';
  return div;
}

// Function handling event for the 'x' button
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

// Function that creates small elements
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

// Function handling form submit
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

    // Adds relationship info to either modalities (complex form) or meanings (simple form)
    for (let i = 0; i < final.length; i++) {
      data.meanings.forEach((meaning) => {
        if (data.normalForm) {
          // Complex form
          if (meaning.modalities.length > 1) {
            // More than 1 modality
            meaning.modalities.forEach((modality) => {
              modality = addRelationships(modality);
              if (modality.id === final[i].origin) {
                modality = editModality(modality, final[i], 'og');
              } else if (modality.id === final[i].destination) {
                modality = editModality(modality, final[i], 'de');
              }
            });
          } else {
            // Only 1 modality
            let modality = meaning.modalities[0];
            modality = addRelationships(modality);
            if (modality.id === final[i].origin) {
              modality = editModality(modality, final[i], 'og');
            } else if (modality.id === final[i].destination) {
              modality = editModality(modality, final[i], 'de');
            }
          }
        } else {
          // Simple form
          meaning = addRelationships(meaning);
          if (meaning.id === final[i].origin) {
            meaning = editModality(meaning, final[i], 'og');
          } else if (meaning.id === final[i].destination) {
            meaning = editModality(meaning, final[i], 'de');
          }
        }
      });
    }

    // Pass data to localStorage
    localStorage.setItem('map', JSON.stringify(data));
    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: 'The form was successfully submitted',
    });
    console.log(JSON.parse(localStorage.getItem('map')));
  } else {
    Swal.fire({
      icon: 'warning',
      title: 'Proceed with no data',
      text: 'You are about to preceed without relationship data',
      preConfirm: () => {
        // TODO: redirect to map
      },
    });
  }
}

// Function adding 'relationships' key to data
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

// Function adding the correct realtionship data to the correct elements
function editModality(modality, final, type) {
  let direction;
  type === 'de'
    ? final.direction === 'to'
      ? (direction = 'origins')
      : final.direction === 'from'
      ? (direction = 'destinations')
      : (direction = 'unspecified')
    : final.direction === 'to'
    ? (direction = 'destinations')
    : final.direction === 'from'
    ? (direction = 'origins')
    : (direction = 'unspecified');

  const arr = modality.relationships;
  let check = false;
  for (rel in arr) {
    check = arr[rel].some(
      (el) => el.rel === (type === 'og' ? final.destination : final.origin)
    );
  }
  !check
    ? modality.relationships[direction].push({
        rel: type === 'og' ? final.destination : final.origin,
        cert: final.certitude,
      })
    : modality;
  return modality;
}

function extractValues(modality, existingRelationships) {
  for (relationship in modality.relationships) {
    if (relationship === 'destinations') {
      modality.relationships[relationship].forEach((rel) =>
        existingRelationships.push({
          origin: modality.id,
          direction: 'to',
          destination: rel.rel,
          certitude: rel.cert,
        })
      );
    } else if (relationship === 'unspecified') {
      modality.relationships[relationship].forEach((rel) => {
        const found = existingRelationships.some(
          (el) =>
            (el.origin === modality.id &&
              el.direction === 'unspecified' &&
              el.destination === rel.rel &&
              el.certitude === rel.cert) ||
            (el.origin === rel.rel &&
              el.direction === 'unspecified' &&
              el.destination === modality.id &&
              el.certitude === rel.cert)
        );
        if (!found) {
          existingRelationships.push({
            origin: modality.id,
            direction: 'unspecified',
            destination: rel.rel,
            certitude: rel.cert,
          });
        }
      });
    }
  }
  return existingRelationships;
}

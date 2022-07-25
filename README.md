# Pygmalion

Pygmalion, a tool to visualise the diachronic description of meaning.
Copyright (C) 2000 WoPoss. All rights reserved.  Use is subject to license terms.

Pygmalion was created by Francesca Dell’Oro (conceptualisation, general supervision, testing), Loris Rimaz (conceptualisation, main development, testing), Helena Bermúdez Sabel (conceptualisation, development, testing) & Paola Marongiu (testing) in the framework of the WoPoss project. 

## Table of contents
- [Quick introduction](#quick-introduction)
- [Step by step development](#step-by-step-development)
     - [First form](#first-form)
     - [Second form](#second-form)
     - [Data structure](#data-structure)
     - [Visualisations](#visualisations)
- [How to cite](#how-to-cite)

## Quick introduction

[Pygmalion](http://woposs.unil.ch/pygmalion.php) allows users to create a semantic map of any word by simply filling two forms. The first form has two versions, the 'modal' version (Pygmalion-modal) and the 'simplified' version which drops the notion of modality (Pygmalion-simple). The second form allows the user to specify the relationships between the different meanings.

The resulting visualisation is also separated in two parts: the semantic map itself and a network graph. The semantic map holds all the information from the first form: it displays all the definitions, it generates arrows whose colour corresponds to the different types of modality, it renders meaning arrows according to the emergence and, if there is any, the disappearance dates. The meaning arrows can be sorted by chronology, by collocations or by groups. Clicking on a meaning arrow will display all relationships of that meaning with other meanings. That is, relevant meanings _relative to_ the clicked one will be displayed while irrelevant ones will be removed. Then, relationship arrows will be displayed on the right, showing the directionality of the relationship.

The network graph is a quick and efficient way to visualise all relationships of each meaning with the other ones. The graph is interactive: each node can be dragged around and this will in turn rearrange the visualisation. Please note that moving nodes around will move the other nodes further away.

For more information about the tool, including a tutorial, please visit the [website of the project](http://woposs.unil.ch/pygmalion.php).

## Step by step development

### First form

The first form (`index.html`) is one of the most important part of this project. In fact, an unreliable, imperfect, or inadaptive form would lead to an obsolete tool.

The two versions of the form act similarly:

- Users must specify a headword and choose a date format (centuries, decades or specific years).
- The etymology field allows the user to add as many etymological steps as needed. Importantly, etymology can also be flagged as either unwanted (proceed without etymology) or unknown. Each etymological step is deletable if users wish to correct themselves.
- Users are then able to add as many 'meanings/fonctions/uses' (in the following this group of possibilities will be called 'definition') as they see fit. They are then invited to fill the definition for the headword inside a `<input type="text">` element. The following `<select>` elements can be completed with the users' own inputs, simply by selecting the 'add new...' option. Users have then the possibility to specify a  collocation or group of any kind. Here lies the main difference between the two versions : the 'modal' version will now invite users to specify a modal reading - which includes choosing (or adding a new) modal reading through a `<select>` element, then specifying an emergence date, a disappearance date (if any), the first attestation of a modal reading, and finally the confidence in the description of the modal reagding. The 'simplified' version will only require the emergence dates as well as the first attestation, the disappearance date remaining optional in both versions of the tool. In the 'modal' version, users can add as many modal descriptions as they want to a definition.
- Once the form is completed, the form can be submitted. The main operation that happen is a conversion of the emergence/disappearance dates into easy-to-process formats depending on the users' date format choice. If every mandatory field have been filled, the data is stored into the `localStorage`.
- The form can be generated automatically if compatible data is found stored in the `localStorage`. This allows users to go back and edit the data.

### Second form

The second form (`sem_rel_form.html`) if fairly straightforward:

- Users can add as many relationships as they want.
- Each relationship has an origin `<input type="text">`, a direction (unspecified/to/from) `<select>`, a destination `<input type="text">` and a (binary degree of) confidence `<input type="checkbox">`.
- Submitting the form will add the relationship data to all the specified elements. **Important:** symmetric data - e.g. "definition 1" to "definition 2" and "definition 2" from "definition 1" - will be stored automatically with only one of the two. In other words, **if users fill a relationship as "definition 1" to "definition 2", "definition 2" from "definition 1" will be implied and stored without any need for the users to specify or add such relationship**. Two definitions **can only have _one_ relationship**.
- The form can be generated if compatible date is found in the `localStorage`, which allows users to edit the form and submit it again.

### Data structure

The two forms result in two distinct data structures. The 'modal' version will generate:

```JSON
{
  "normalForm": true,
  "headword": "Example headword",
  "etymology": "unknown", //would be false is etymology was unwanted
  "dataFormat": "dec",
  "meanings": [
    {
      "definition": "First definition",
      "construct": "My construct/collocation",
      "group": "None",
      "modalities": [
        {
          "id": "dkzfmti",
          "modal": "Not modal",
          "emergence": -200,
          "disparition": "None",
          "attestation": "1",
          "certainty": true,
          "relationships": {
            "origins": [],
            "destinations": [
              { "rel": "dcynkvm", "cert": true },
              { "rel": "zapnlh", "cert": false }
            ],
            "unspecified": [{ "rel": "osam1iaa", "cert": false }]
          }
        },
        // any other modality ...
      ]
    },
    // any other definition ...
```

The 'simplified' version will generate:

```JSON
{
  "normalForm": false,
  "headword": "Example headword",
  "etymology": [
    {
      "certitude": true,
      "def": "definition",
      "form": "form",
      "period": "PI",
    },
    // any other etymological steps
  ],
  "dataFormat": "y",
  "meanings": [
    {
      "id": "malfipl",
      "definition": "Definition 1",
      "construct": "None",
      "group": "My group 1",
      "emergence": 1237,
      "disparition": "None",
      "attestation": "bontate: Canzone",
      "relationships": {
        "origins": [{ "rel": "rypfbdku", "cert": true }],
        "destinations": [{ "rel": "rypfbdku", "cert": true }],
        "unspecified": [
          { "rel": "malfipl", "cert": true },
          { "rel": "jbjj", "cert": true }
        ]
      }
    },
    // any other definition ...
```

### Visualisations

To see the generated visualisations, open `map.html`. The visualisations start by preparing the data:

```js
function prepareDefinitions() {
  const meanings = data.meanings;
  const definitions = [];
  if (data.normalForm) {
    meanings.forEach((meaning) => {
      if (meaning.modalities.length > 1) {
        meaning.modalities.forEach((modalitiy) => {
          definitions.push(modalityFormatting(meaning, modalitiy));
        });
      } else {
        definitions.push(modalityFormatting(meaning, meaning.modalities[0]));
      }
    });
  } else {
    meanings.forEach((meaning) =>
      definitions.push(simpleModalityFormatting(meaning))
    );
  }
  return definitions;
}
```

The resulting standardized data structure looks like:

```JSON
[
  {
    "attestation": "1",
    "certainty": true,
    "construct": "My construct/collocation",
    "disparition": -1,
    "emergence": 10,
    "group": "None",
    "id": "dkzfmti",
    "meaning": "First definition",
    "modal": "Not modal",
    "relationships": {
      "origins": [],
      "destinations": [
        { "rel": "dcynkvm", "cert": true },
        { "rel": "zapnlh", "cert": false }
      ],
      "unspecified": [{ "rel": "osam1iaa", "cert": false }]
    }
  },
  // other definitions
]
```

The emergence and disappearance dates have been converted to their index in an `Array` containing all the possible dates between the earliest and latest dates of the data. If the disappearance is `"None"` it will be converted to `-1`.

In order, the following elements are drawn:

- The legend: rendered according to the selected modal reading and the form's version???.
- The etymology: rendered according to its value (either `false`, `"unknown"`, or `Array`).
- The collocation/group displays on the left-hand side of the visualisation.
- The definitions: rendered according to the emergence and disappearance dates, as well as the modal readings (color) and the degree of??? confidence in the modal descriptions.
- The diachronic line: it is always rendered by using centuries as main divisions. The length of the arrow is adapted depending on dates???.
- once a definition is clicked, the relationship arrows: they are generated with a fairly simple calculation for the `[[x0, y0], [x1, y0], [x1, y1], [x2, y1]]` coordinates.

For the network graph, the data is converted again:

```js
function extractDefinitionData() {
  const obj = { nodes: [], links: [] };
  definitions.forEach((def, i) => {
    // Created nodes data
    obj.nodes.push({
      id: def.id,
      name: def.meaning,
      emergence: def.emergence,
      modal: def.modal,
    });
    // Create links data
    for (rel in def.relationships) {
      if (rel === 'destinations' || rel === 'unspecified') {
        def.relationships[rel].forEach((r) => {
          if (rel === 'unspecified') {
            let add = true;
            if (obj.links.length > 0) {
              obj.links.forEach((l) => {
                if (l.source === r.rel && l.target === def.id) {
                  add = false;
                }
              });
              if (add) {
                obj.links.push({
                  source: def.id,
                  target: r.rel,
                  hasDest: false,
                  isCert: r.cert,
                });
              }
            } else {
              obj.links.push({
                source: def.id,
                target: r.rel,
                hasDest: false,
                isCert: r.cert,
              });
            }
          } else {
            obj.links.push({
              source: def.id,
              target: r.rel,
              hasDest: true,
              isCert: r.cert,
            });
          }
        });
      }
    }
  });
  return obj;
}
```

The resulting data structure looks like:

```JSON
{
  "nodes": [
    {
      "id": "dkzfmti",
      "name": "First definition",
      "emergence": 10,
      "modal": "Not modal",
    },
    // other nodes...
  ],
  "links": [
    {
      "source": "dkzfmti",
      "target": "dcynkvm",
      "hasDest": true,
      "isCert": true,
    },
    // other links...
  ],
}
```

The rest is handled by D3's automatic methods for force simulated network graphs:

```js
const simulation = d3
  .forceSimulation()
  .force(
    'link',
    d3
      .forceLink()
      .id((d) => d.id)
      .distance(75)
  )
  .force('charge', d3.forceManyBody().strength(-100))
  .force('center', d3.forceCenter(networkWidth / 2, networkHeight / 2));

simulation.nodes(dataset.nodes).on('tick', ticked);
simulation.force('link').links(dataset.links);
```

The result is a network graph showing all the definitions with their relationships. Moreover, each relationship will be displayed the same way as by the relationship arrows:

- Uncertain relationships will be displayed as dashed lines.
- "To" relationships will be displayed with an arrow going from the origin node to the target node.

## How to cite

- Dell’Oro, Francesca - Rimaz, Loris - Bermúdez Sabel, Helena & Marongiu, Paola (2020). _Pygmalion-simple 1.0. A tool to draw interactive and diachronic semantic maps_. WoPoss. A World of Possibilities. Swiss National Science Foundation. 

- Dell’Oro, Francesca - Rimaz, Loris - Bermúdez Sabel, Helena & Marongiu, Paola (2020). _Pygmalion-modal 1.0. A tool to draw interactive and diachronic semantic maps of modality_. WoPoss. A World of Possibilities. Swiss National Science Foundation

- Dell’Oro, Francesca - Rimaz, Loris - Bermúdez Sabel, Helena & Marongiu, Paola (2021). _Pygmalion-colour 1.0. A tool to draw interactive and diachronic semantic maps_. WoPoss. A World of Possibilities. Swiss National Science Foundation. 

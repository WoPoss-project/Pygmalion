# Semantic Maps
- [Information requirements](#information-requirements)
- [Current design](#current-design)
- [Future work](#future-work)

## Information requirements 
Each map must include the following contents:
<ol type="a">
  <li>the different senses of a headword</li>
  <li>the first attestation(s) of each sense</li>
  <li>the etymology</li>
  <li>for each sense, the type of meaning in terms of modality: premodal, modal (with three subcategories), postmodal</li>
  <li>chronology of the different meanings: when a sense is first attested and when it “ends”</li>
  <li>relations between senses with different degrees of certainty</li>
</ol>

## Current design
The existent mock-up (see _CERTUS_ in the [HTML version](https://github.com/WoPoss/semantic_maps/blob/master/drawn-maps/semantic-modal-maps.html) of this repo or the published version available on [our website](http://woposs.unil.ch/semantic-modal-maps.php)) has the following functionalities:
- A timeline provides the chronologic information: the time (expressed in centuries) works as the x axis (requirement _e_). In the y axis the different senses are displayed ordered by two parameters: chronology and the organization of the entry of the headword in the dictionary of reference (requirement _a_). Expressions that contain the headword are also registered (a label left to the sense indicates the expression under analysis).
- The first attestation is visible when hovering over a sense (requirement _b_; see section [Tooltips](#tooltips)).
- Colors indicate the type of modality (requirement _d_).
- By clicking on a sense, the relations between senses are visible and non-related senses disappear (requirement _f_). The visualization is reset by double-clicking (see section [Show/hide effect](#show/hide-effect)).
- Language selection: together with the bilingual map (English-Latin), a monolingual Latin version is available by user demand (see section [Languages](#languages)).

### Development
The maps were manually drawn using [Inkscape](https://inkscape.org/). During the drawing process, IDs are added to each `<g>` element that contains a sense.

The SVG sources were then edited to include `@class` attributes that enable the animation effects described in the section [Features](#some-details-about-implemented-features). Two types of `@class` attributes are added: one to define the language and the other to established the relations between the senses.

The SVG files are available on [this folder](https://github.com/WoPoss/semantic_maps/tree/master/drawn-maps/svg).

### Known Issues
List of shortcomings of the current design, including features that have not be implemented yet:
- Lack of a collapse effect. When a sense is selectd, in order to highlight its semantic path, not related senses disappear and lines depicting the relations become visible. However, senses keep their original position instead of coming close together. In a long map like that of _CERTUS_, this defficiency becomes clear. 
- The double click to reset the visualization is less intuitive than a normal click event.
- Lack of direction in the relations between the senses. The current design does not create a hierarquization among the relations: all of them are at the same level and based on the chronology, the user infers the direction (that is, if a sense is related to a more recent one, the first one is the source –or one of the sources– of the second one).
- Lack of accessibility: currently, color is the only visual means of conveying the type of modality, which breaks a few [accessibility principles](https://www.w3.org/WAI/fundamentals/accessibility-principles/).

### Some details about implemented features

#### Tooltips
The first attestations appear when hovering over a sense. Each “sense” is grouped in a SVG element `<g>` that contains the arrow box and the text. This element contains a `<title>` with the first attestation and the tooltip with its contents is created using pure CSS (see [maps.css](https://github.com/WoPoss/semantic_maps/blob/master/drawn-maps/css/maps.css)).

#### Languages
Currently, you can toggle the visualization of the senses between English and Latin, although the Latin version is not yet complete.

The text of each sense (`<text>`) contains an element `<tspan>` with a `@class` attribute indicating the language. A simple JavaScript code (see [language.js](https://github.com/WoPoss/semantic_maps/blob/master/drawn-maps/js/language.js)) hides/shows the correct spans according to the user’s selection in a small menu that precedes each map.

#### Show/hide effect
When clicking on a sense, senses not related to it are hidden and lines depicting the relations become visible. The effect is done with a JavaScript program that toggles the value ’@class="show"’ depending on whether the `@id` of the selected sense is present as a value of a `@class` attribute in the other senses and links (see [paths-hide.js](https://github.com/WoPoss/semantic_maps/blob/master/drawn-maps/js/paths-hide.js))

## Future work
### Form
In order to create an automatic visualization of a semantic map from user input, a form must be design. Following the specifications detailed [above](#information-requirements), the form must ask for:
- The headword
- The etymology of the word with as many steps as needed. Each step has to account for:
    - historical form
    - language
    - chronology
    - meaning and/or translation
    - possibility to include comments to describe a particular feature of the diachronic change
- The different senses of the headword. For each sense, the following information must be included:
    - definition (in at least two languages)
    - when the sense is first attested
    - when the sense is last used
    - its first attestation(s)    
    - the modal classification of the sense:
        - premodal/not modal
        - modal (with subcategories that can be defined by the user. A maximum number of possible categories can be established in four)
        - postmodal
    - in terms of the modal classification, it should be possible to encode 
        - the degree of certainty in the assignation of a modal meaning (a scale of two is sufficient: certain vs uncertain)
        - the possibility of a sense to adquire the modal meaning after its first attestation (that it, a sense “begins” as premodal and adquires a modal meaning later in time)
    - its relation(s) with other senses, including 
        - the direction (or not) of the relation (there must be the possibility to express both source --> target associations and undirected relations)
        - the degree of certainty of the association (a scale of two is sufficient: certain vs uncertain)
- Expressions that contain the headword. A expression may have one of more senses. For the information required for each sense, see the previous item.

### Visualization
As detailed above, the semantic maps contain a lot of information. Thus, the visual cues that depict each piece of information must be clear and part of the contents of the map must be displayed by user demand.

The current design is relatively efficient to hold all the information, but enhancements are needed (see [Issues](#issues)). Also, the attractiveness of the design could be increased by adding other animation effects like motion (to be completed).




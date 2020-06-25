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

A more detailed list is presented in the subsection [Form](#form).

## Current design
The existent mock-up (see _CERTUS_ in the [HTML version](https://github.com/WoPoss/semantic_maps/blob/master/drawn-maps/semantic-modal-maps.html) of this repo or the published version available on [our website](http://woposs.unil.ch/semantic-modal-maps.php)) has the following functionalities:
- A timeline provides the chronological information: the time (expressed in centuries) works as the x axis (requirement _e_ above). In the y axis the different senses are displayed ordered by two parameters: chronology, and the organization of the entry of the headword in the dictionary of reference (requirement _a_). Expressions that contain the headword are also registered (a label left to the sense indicates the expression under analysis).
- The first attestation is visible when hovering the mouse over a sense (requirement _b_; see section [Tooltips](#tooltips)).
- Colors indicate the type of modality (requirement _d_).
- By clicking on a sense, the relations between senses are visible and unrelated senses disappear (requirement _f_). The visualization is reset by double-clicking (see section [Show/hide effect](#show/hide-effect)).
- Language selection: together with the bilingual map (English-Latin), a monolingual Latin version is available on user demand (see section [Languages](#languages)).

### Development
The maps were manually drawn using [Inkscape](https://inkscape.org/). During the drawing process, IDs were added to each `<g>` element that contains a sense.

The SVG sources were then edited to include `@class` attributes that enable the animation effects described in the section [Features](#some-details-about-implemented-features). Two types of `@class` attributes were added: one to define the language and the other to establish the relations between the senses.

The SVG files are available in [this folder](https://github.com/WoPoss/semantic_maps/tree/master/drawn-maps/svg).

### Known Issues
List of shortcomings of the current design, including features that have not been implemented yet:
- Lack of a collapse effect. When a sense is selected, in order to highlight its semantic path, unrelated senses disappear and lines depicting the relations become visible. However, senses keep their original position instead of coming close together. In a long map like that of _CERTUS_, this deficiency becomes clear. 
- The double click to reset the visualization is less intuitive than a normal click event.
- Lack of direction in the relations between the senses. The current design does not create a hierarchy among the relations: all of them are at the same level. Based on the chronology, the user infers the direction (that is, if a sense is related to a more recent one, the first one is understood to be the source –or one of the sources– of the second one).
- Lack of accessibility: currently, color is the only visual means of conveying the type of modality, which breaks a few [accessibility principles](https://www.w3.org/WAI/fundamentals/accessibility-principles/).

### Some details about implemented features

#### Tooltips
The first attestations appear when hovering the mouse over a sense. Each “sense” is grouped in a SVG element `<g>` that contains the arrow box and the text. This element contains a `<title>` with the first attestation and the tooltip with its contents is created by using pure CSS (see [maps.css](https://github.com/WoPoss/semantic_maps/blob/master/drawn-maps/css/maps.css)).

#### Languages
Currently, a user can toggle the visualization of the senses between English and Latin, although the Latin version is not yet complete (therefore, some senses are blank).

The definition of each sense (a `<text>` element) contains `<tspan>` elements with a `@class` attribute indicating the language. A simple JavaScript code (see [language.js](https://github.com/WoPoss/semantic_maps/blob/master/drawn-maps/js/language.js)) hides/shows the correct spans according to the user’s selection in a small menu that precedes each map.

#### Show/hide effect
When clicking on a sense, senses not related to it are hidden and lines depicting the relations become visible. The effect is done by changing the values of the CSS property `display` depending on whether the `@id` of the selected sense is present as a value of a `@class` attribute in the other senses and links (see [paths-hide.js](https://github.com/WoPoss/semantic_maps/blob/master/drawn-maps/js/paths-hide.js)). A click on the senses fires the hidding of unrelated senses and the display of the connections, and a double-click on the senses displays all the senses again (and hides the connections).

At first, the effect was done with a JavaScript program that toggled the value ’@class="show"’. That way, the same event (clicking on a sense) would show/hide the senses accordingly without needing a second function to reset the visualization. However, the show/hide effect was not very smooth, thus the change.

## Future work
### Form
In order to create an automatic visualization of a semantic map from user input, a form must be designed. Following the specifications detailed [above](#information-requirements), the form must ask for:
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
    - the reference to its first attestation(s)
    - the modal classification of the sense:
        - premodal/not modal
        - modal (with subcategories that can be defined by the user. A maximum number of possible categories could be established to be four)
        - postmodal
    - in terms of the modal classification, it should be possible to encode 
        - the degree of certainty in the assignation of a modal meaning (a scale of two is sufficient: certain vs uncertain)
        - the possibility of a sense to acquire the modal meaning after its first attestation (that it, a sense “begins” as premodal and acquires a modal meaning later in time)
    - its relation(s) with other senses, including 
        - the direction (or not) of the relation (there must be the possibility to express both source --> target associations and undirected relations)
        - the degree of certainty of the association (a scale of two is sufficient: certain vs uncertain)
- Expressions that contain the headword. A expression may have one of more senses. For the information required for each sense, see the previous item.

### Visualization
As detailed above, the semantic maps contain a lot of information. Thus, the visual cues that depict each piece of information must be clear and part of the contents of the map must be displayed on user demand.

The current design is relatively efficient to hold all the information, but enhancements are needed (see [Issues](#issues)). Also, the attractiveness of the design could be increased by adding other animation effects like motion (to be completed).

The possibility to create a “rich” version and a even more synoptic one could be consider.




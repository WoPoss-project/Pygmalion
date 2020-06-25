# Semantic Maps

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
- A timeline provides the chronologic information: the time (expressed in centuries) works as the x axis (requirement _e_). In the y axis the different senses are displayed ordered by two parameters: chronology and the organization of the entry of the headword in the dictionary of reference (requirement _a_). Expressions that contain the headword are also registered 
- The first attestation is visible when hovering over a sense (requirement _b_; see section [Tooltips](#tooltips)).
- Colors indicate the type of modality (requirement _d_).
- By clicking on a sense, the relations between senses are visible and non-related senses disappear (requirement _f_). The visualization is reset by double-clicking (see section [Show/hide effect](#show/hide-effect)).
- Language selection: together with the bilingual map (English-Latin), a monolingual Latin version is available by user demand (see section [Languages](#languages)).

### Development
The maps were manually drawn using [Inkscape](https://inkscape.org/). 

The SVG sources were then edited to include `@class` elements that enable the animation effects described in the section [Features](#some-details-about-implemented-features). 

### Known issues
- Lack of a collapse effect:
- The double click to reset the visualization is less intuitive than a normal click event.


### Some details about implemented features

#### Tooltips
The first attestations appear when hovering over a sense. Each “sense” is grouped in a SVG element `<g>` that contains the arrow box and the text. This element contains a `<title>` with the first attestation and the tooltip with its contents is created using pure CSS (see [maps.css](https://github.com/WoPoss/semantic_maps/blob/master/drawn-maps/css/maps.css)).

#### Languages
Currently, you can toggle the visualization of the senses between English and Latin, although the Latin version is not yet complete.

The text of each sense (`<text>`)contains an element `<tspan>` with a `@class` attribute indicating the language. A simple JavaScript code (see [language.js](https://github.com/WoPoss/semantic_maps/blob/master/drawn-maps/js/language.js)).

#### Show/hide effect
(see [paths-hide.js](https://github.com/WoPoss/semantic_maps/blob/master/drawn-maps/js/paths-hide.js))

## Future work

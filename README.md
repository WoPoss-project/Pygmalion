# Semantic Maps
- [Information requirements](#information-requirements)
- [Current design](#current-design)
- [Future work](#future-work)

## Information requirements 
Each map must include the following contents:
<ol type="a">
<li>the etymology of the headword</li>
  <li>the different meanings of the headword</li>
  <li>the first attestation of each meaning</li>
  <li>for each meaning, it must be specified whether there is or not a modal reading. Modal readings can belong to three different types: dynamic, deontic or epistemic. If no modal reading is attested, the meaning can be pre-modal (i.e. the meaning belongs to a cross-linguistic group of meanings from which a modal sense developed), post-modal (i.e. the meaning belongs to a cross-linguistic group of meanings into which a modal sense developed). It is possible that a sense is not modal nor pre-/post-modal</li>
  <li>chronology of the different meanings: when a sense is first attested (century or decade) and, if reliable data is available, when a meaning stops to be attested</li>
  <li>the relations between the meanings. It is indicated the degree of certainty with which such relations can be reconstructed</li>
</ol>

A more detailed list is presented in the subsection [Form](#form).

## Current design
The existent mock-up (see _CERTUS_ in the [HTML version](https://github.com/WoPoss/semantic_maps/blob/master/drawn-maps/semantic-modal-maps.html) of this repo or the published version available on [our website](http://woposs.unil.ch/certus.php)) has the following functionalities:
- A scrollable timeline provides the chronological information: the time (here expressed through a segmentation in centuries) works as the x axis (requirement _e_ above; see section [Scrollable timeline](#scrollable-timeline)). In the y axis the different meanings are displayed and ordered according to the organization of the description of the headword in the dictionary of reference, i.e. according to semantic groups (requirement _a_). Expressions containing the headword are also registered (they appear on the left outside the arrow).
- The first attestation is visible when hovering the mouse over a sense (requirement _c_; see section [Tooltips](#tooltips)).
- Colors indicate the type of modality (requirement _d_).
- By clicking on a sense, semantic relations between meanings are visible (while loosely related meanings disappear) (requirement _f_). The visualization is reset by double-clicking (see section [Show/hide effect](#show/hide-effect)).
- Language selection: together with the bilingual map (English-Latin), a monolingual Latin version is available on user demand (see section [Languages](#languages)).

### Development
The maps were manually drawn using [Inkscape](https://inkscape.org/). During the drawing process, IDs were added to each `<g>` element that contains a meaning.

The SVG sources were then edited to include `@class` attributes that enable the animation effects described in the section [Features](#some-details-about-implemented-features). Two types of `@class` attributes were added: one to define the language and the other to establish the relations between the meanings.

The SVG files are available in [this folder](https://github.com/WoPoss/semantic_maps/tree/master/drawn-maps/svg).

### Known Issues
List of shortcomings of the current design, including features that have not been implemented yet:
- Lack of a collapse effect. When a meaning is selected, in order to highlight its semantic path, “unrelated” meanings disappear and lines depicting the relations become visible. However, senses keep their original position instead of coming closer together. In a long map like that of _CERTUS_, this deficiency becomes clear.
- Need to increase the visibility of related meanings. The visualisation of the relations through lines on the right is not very efficient: the relations would be clearer if the line could appear “inside” the map and not on the side. 
- The double click to reset the visualization is less intuitive than a normal click event.
- Need to “highlight” the modal meanings. A feature that has not been yet implemented is the possibility to click on the legend with the types of modality and focus the map around that particular type (e.g. click on “Epistemic modality” and the only meanings visible in the semantic map are those related to epistemicity –green color–).
- Lack of direction in the relations between the senses. The current design does not create a hierarchy among the relations: all of them are at the same level. Based on the chronology, the user infers the direction (that is, if a sense is related to a more recent one, the first one is understood to be the source –or one of the sources– of the second one).
- Lack of accessibility: currently, color is the only visual means of conveying the type of modality, which breaks a few [accessibility principles](https://www.w3.org/WAI/fundamentals/accessibility-principles/).

### Some details about implemented features

#### Tooltips
The first attestations appear when hovering the mouse over a meaning. Each “meaning” is grouped in a SVG element `<g>` that contains the arrow box and the text. This element contains a `<title>` with the first attestation and the tooltip with its contents is created by using pure CSS (see [maps.css](https://github.com/WoPoss/semantic_maps/blob/master/drawn-maps/css/maps.css)).

#### Languages
Currently, a user can toggle the visualization of the meanings between English and Latin, although the Latin version is not yet complete (therefore, some senses are blank).

The definition of each meaning (a `<text>` element) contains `<tspan>` elements with a `@class` attribute indicating the language. A simple JavaScript code (see [language.js](https://github.com/WoPoss/semantic_maps/blob/master/drawn-maps/js/language.js)) hides/shows the correct spans according to the user’s selection in a small menu that precedes each map.

#### Show/hide effect
When clicking on a sense, senses not related to it are hidden and lines depicting the relations become visible. The effect is done by changing the values of the CSS property `display` depending on whether the `@id` of the selected sense is present as a value of a `@class` attribute in the other senses and links (see [paths-hide.js](https://github.com/WoPoss/semantic_maps/blob/master/drawn-maps/js/paths-hide.js)). A click on the senses fires the hidding of unrelated senses and the display of the connections, and a double-click on the senses displays all the senses again (and hides the connections).
When clicking on a meaning, meanings not (specifically) related to it are hidden and lines depicting the relations become visible on the right side. The effect is done with a JavaScript program that toggles the value `@class="show"` depending on whether the `@id` of the selected meaning is present as a value of a `@class` attribute in the other meanings and links (see [paths-hide.js](https://github.com/WoPoss/semantic_maps/blob/master/drawn-maps/js/paths-hide.js))

At first, the effect was done with a JavaScript program that toggled the value `@class="show"`. That way, the same event (clicking on a sense) would show/hide the senses accordingly without needing a second function to reset the visualization. However, the show/hide effect was not very smooth, thus the change.

#### Scrollable timeline
In order to follow the chronology in a long map, the timeline with the centuries is scrollable. This was done by using jQuery (see [timeline.js](https://github.com/WoPoss/semantic_maps/blob/master/drawn-maps/js/timeline.js)).

## Future work
### Form
In order to create an automatic visualization of a semantic map from user input, a form must be designed. Following the specifications detailed [above](#information-requirements), the form must ask for:
- The headword
- The etymology of the word with as many phases as needed. Each phase has to account for:
    - reconstructed/previously attested form (in the case of Latin there are usually the Proto-Indo-European phase and the Proto-Italic phase. For none of them do we have any direct attestations and we use an asterisk before the form / For other languages, e.g. French, the situation is different.)
    - language(s) to which the reconstructed or previously attested forms belong 
    - chronology (not currently illustrated in the available maps)
    - meaning and/or translation
    - possibility to include comments to describe a particular feature of the diachronic change
- The different meanings of the headword. For each sense, the following information must be included:
    - definition (in at least two languages)
    - when the sense is first attested
    - when the sense is last used
    - the reference to its first attestation(s)
    - the passage in which the first attestation appear
    - the type of modal meaning:
        - not modal
        - premodal
        - modal (with subcategories that can be defined by the user. A maximum number of possible categories could be established to be eight)
        - postmodal
    - in terms of the modal classification, it should be possible to encode 
        - the degree of certainty in the assignation of a modal meaning (a scale of two is sufficient: certain vs uncertain)
        - the possibility for a meaning to acquire the modal reading after its first attestation (that it, a meaning “begins” as premodal and acquires a modal meaning later in time)
    - its relation(s) with other senses, including 
        - the direction (or not) of the relation (there must be the possibility to express both source --> target associations and undirected relations)
        - the degree of certainty of the association (a scale of two is sufficient: certain vs uncertain)
- Expressions that contain the headword. A expression may have one of more meanings. For the information required for each meaning, see the previous item.

### Visualization
As detailed above, the semantic maps contain a lot of information. Thus, the visual cues that depict each piece of information must be clear and part of the contents of the map must be displayed on user demand.

The current design is relatively efficient to hold all the information, but enhancements are needed (see [Issues](#issues)). Also, the attractiveness of the design could be increased by adding other animation effects like motion.

The possibility to create a “rich” version and a even more synoptic one could be consider.




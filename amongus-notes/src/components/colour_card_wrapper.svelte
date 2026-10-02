<script>
  import ColourCard from "./colour_card.svelte";
  import { alignmentColours } from "../colours";

  // shared states
  import {counts} from "../sharedStates/counts.svelte";

  let {
    colour = $bindable(), // needs to be made bindable for the bind to be passed from app.svelte
    handleDragStart,
    handleDrop,
    gridName = "noted",
    openNotes = null,
    selectedMod
  } = $props();

  // changes colour of colour card and alignment item buttons along with the alignment value of the colour
  // replaces old binding behaviour that no longer worked through a component
  function changeCardColour(e, colour, shade){
    let wrapper

    if (shade) {
        // it's the alignment grid
        wrapper = e.currentTarget.parentElement.parentElement
    } else {
      wrapper = e.currentTarget.parentElement;
    }

    const alignmentGrid = wrapper.querySelector(".alignment-grid");
    const alignmentItemBase = alignmentGrid.querySelector(".alignment-item-base");
    const alignmentItemDark = alignmentGrid.querySelector(".alignment-item-dark");
    const card = wrapper.querySelector(".colour-card");


    // get alignment 
    let alignment
    if (!shade){ // if there's no shade argument then get alignment from status select
      alignment = e.currentTarget.value 
      colour.alignment = alignment

    } else { // get the existing alignment 
      alignment = colour.alignment
    }

    // change BG colour of card based on alignment
    if (card){
      if (colour.alignment != "none"){

        if (shade){
          card.style.backgroundColor = alignmentColours[colour.alignment]?.[shade];
          alignmentGrid.style.backgroundColor = alignmentColours[colour.alignment]?.[shade];
        } else {
          card.style.backgroundColor = alignmentColours[colour.alignment]?.base;
          alignmentGrid.style.backgroundColor = alignmentColours[colour.alignment]?.base;
        }

      } else {
        card.style.backgroundColor = "#2a2a2a"
      }
    }

    // change BG colour of alignment grid items
    if (alignmentGrid){
  
      if (colour.alignment != "none"){
        alignmentItemBase.style.backgroundColor = alignmentColours[colour.alignment]?.base;
        alignmentItemDark.style.backgroundColor = alignmentColours[colour.alignment]?.dark;


      } else {
        alignmentItemBase.style.backgroundColor = "black"
        alignmentItemDark.style.backgroundColor = "black"
        alignmentGrid.style.backgroundColor = "black";
      }
    }
  }
</script>

<div class="grid image-wrapper">

  <!-- Colour card -->
  <ColourCard
    {colour}
    {handleDragStart}
    {handleDrop}
    {gridName}
    {openNotes}
  />

  <!-- Venter -->
  <img
    src={colour.vented
      ? "/assets/icons/venter.png"
      : "/assets/icons/venter_false.png"}
    alt=""
    draggable="false"
    style="height: 32px; width: 32px; justify-self: center;"

    onclick={() => {
      if (colour.vented) {
        colour.vented = false;
        counts.venters -= 1;
      } else {
        colour.vented = true;
        counts.venters += 1;
      }
    }}
  >

  <!-- the binding of colour.alignment doesn't work inside the component-->

  <!-- Alignment dropdown -->
  <select
    class="status-select"
    style="grid-area: dropdown-box"


    onchange={(event) => {
      changeCardColour(event, colour)
    }}
  >
    <option value="none">None</option>
    <option value="crew">Crewmate</option>

    {#if selectedMod !== "none"}
      <option value="neutral">Neutral</option>
    {/if}

    <option value="imposter">Imposter</option>
  </select>

  <!-- Alignment colours -->
  <div
    class="grid alignment-grid"
    style="grid-area: box-alignment"
  >

    <div class="alignment-item alignment-item-base"
      style="border-bottom-left-radius: 1rem;"
      onclick={(event) => {
        changeCardColour(event, colour, "base")
      }}
    >
    </div>

    <div class="alignment-item alignment-item-dark"
      style="border-top-left-radius: 1rem;"

      onclick={(event) => {
        changeCardColour(event, colour, "dark")
      }}
    >
    </div>

  </div>

</div>
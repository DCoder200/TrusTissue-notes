<script>
  // lists for creating repeated buttons
  import {roles, maps, setting_toggle } from "./data.js";

  // all the colour objects
  import {base_colours, tor_colours, tou_colours} from "./colours.js"

  // functions to highlight role in roles panel, map select, and reset 
  import {selectMap, activateRole, reset} from "./misc_functions.js"

  // functions for taking notes in the note area
  import {openNotes, writeNote} from "./noteFunctions.js"

  // drag and drop functions
  import {handleDragStart, handleDragEnd, handleDrop, handleMouseMove} from "./dragging/dragging.js"

  // shared states 
  import {dragState} from "./dragging/dragState.svelte.js";
  import {notedColours} from "./sharedStates/notedColours.svelte.js"

  // components 
  import ColourCard from "./components/colour_card.svelte";
  import ColourCardWrapper from "./components/colour_card_wrapper.svelte"
  import Spacer from "./components/spacer.svelte";
  import RoleImg from "./components/role_img.svelte";
  import Role from "./components/role.svelte";
  import OptionsButton from "./components/options_button.svelte"; 
  import LobbySetting from "./components/lobby_setting.svelte";
  import LobbySettingDumb from "./components/lobby_setting_dumb.svelte";
  import MapButton from "./components/map_button.svelte";
  import NoteArea from "./components/note_area.svelte";

  // Generate final colour array based on user selected value, reactive
  let selectedMod = "none"

  // set colours to = result of this if statement block's return
  // this is good because it makes the variable 100% derived from the bound value with no outside initialisation
  $: colours = (() => {
    if (selectedMod === "tor") {
      return [...base_colours, ...tor_colours];
    }

    if (selectedMod === "tou") {
      return [...base_colours, ...tou_colours];
    }

    return base_colours;
  })();

  // detect mouse movements and mouse releases globally for the whole window, mounts just once 
  import { onMount } from "svelte";
  onMount(() => {
    window.addEventListener("mouseup", handleDragEnd);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mouseup", handleDragEnd);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  });
</script>


<!-- start of markdown-->
<!-- main grid containing multiple grids -->
<div class="main-layout">

  <!-- Render ghost images of dragged colours-->
  {#if dragState.draggedColour && dragState.dragging}
    <div
      class="colour-card drag-ghost"
      style="left: {dragState.mouse_x}px; top: {dragState.mouse_y}px;"
    >
      <img src={dragState.draggedColour.src} alt="" />
    </div>
  {/if}

  <!-- Spacer to separate the two colour grids and improve coherency-->
  <Spacer></Spacer>

  <!-- need to pass arguments to be able to reduce venter count-->
  <div 
    class="left-layout"
    style="grid-area: left;"
  >

    <h2 style="grid-area: colour-picker-header;">Colour Picker</h2>

    <div 
      class="grid colour-grid"
      style="grid-area: colour-picker"
      on:dragover={(event) => event.preventDefault()}
    >
    
      <!-- Uses colour card component-->
      {#each colours as colour}
        <ColourCard 
          {colour} 
          {handleDragStart} 
          gridName="colourGrid" 
          {handleDrop}>
        </ColourCard>
      {/each}
    </div>
  </div>

  <!--noted colours-->
  <div 
    class="middle-layout"
    style="grid-area: middle;"
  >

    <h1 style="grid-area: noted-header; border-left-style: none; border-right-style: none;">Noted</h1>

    <div 
      class="grid noted-grid"
      style="grid-area: noted"
      on:dragover={(event) => event.preventDefault()}
      on:drop={(event) => handleDrop(event, 'noted')}
    >
          
      <!-- Uses image wrapper component-->
      <!-- Make sure to pass the bind for colour and venters-->
      {#each notedColours.noted as colour}
        <ColourCardWrapper
          bind:colour
          {handleDragStart}
          {handleDrop}
          gridName="noted"
          {openNotes}
          {selectedMod}
        >
        </ColourCardWrapper>
      {/each}

      <div class="insert-visual"></div>
    </div>

    <div 
      class="grid notes-grid"
      style="grid-area: notes"
    >

      <h1 style="border-left-style: none; border-right-style: none; font-size: 24px;">Notes for {notedColours.selectedColour?.name || 'Colour'}</h1>

      <!-- Uses note_area component-->
      <NoteArea {writeNote}></NoteArea>
    </div>
  </div> <!-- close middle-->

  <!-- Right panels-->
  <div 
    class="right-layout"
    style="grid-area: right;"
  >

    <div
      class="grid lobby-settings-grid"
      style="grid-area: box-4"
    >
      <h2 style="grid-area: lobby-settings-label">Lobby Settings</h2>

        <!-- LobbySettings use lobby_setting component-->
        <!-- Imposters-->
        <LobbySetting setting = "imposters"></LobbySetting>

        <!-- Each of the dumb toggles -->
        {#each setting_toggle as toggle}
          <!-- Uses lobby_setting_dumb component-->
          <LobbySettingDumb {toggle}></LobbySettingDumb>
        {/each}

        <!-- Taskbar Updates -->
        <LobbySetting setting = "taskbar_updates"></LobbySetting>

        <!-- Vent cooldown-->
        <LobbySetting setting = "vent-cooldown"></LobbySetting>
    </div>


    <div
      class="grid roles-grid"
      style="grid-area: box-6"
    >
      <h2>Roles</h2>

      <!-- Uses role component-->
      <!-- Remember that this is the way to feed a bound value to a component and have it propogate-->
      <Role role = "engineer"></Role>
      <Role role = "venter"></Role>

      <!-- The rest are dumb toggles just to visually display that the roles are ingame-->
      <!-- Uses role_img component-->
      {#each roles as role}
        <RoleImg {role} {activateRole}></RoleImg>
      {/each} 

    </div>
    <div 
      class="grid map-grid"
      style="grid-area: box-5"
    >
      <h2>Map</h2>

      <!-- Button of each map from list-->
      {#each maps as map}
      <!-- Uses map_button component-->
        <MapButton {map} {selectMap}></MapButton>
      {/each}
    </div>

    <!-- Uses options_button component-->
    <OptionsButton bind:selectedMod {reset}></OptionsButton>
  </div> <!-- close right panel-->
</div>


<script>
  // lists for creating repeated buttons
  import {roles, maps, setting_toggle } from "./data.js";

  // all the colour objects
  import {base_colours, tor_colours, tou_colours, alignmentColours} from "./colours.js"

  // function to highlight role in roles panel and map select
  import {selectMap, activateRole} from "./misc_functions.js"

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

  // track number of people seen venting to compare against engineer count
  let venters = 0
  let engineers = 0

  // dynamic lists for grids
  let noted = []

  // track dragged colour and source grid
  let draggedColour = null
  let draggedGrid = null

  let start_x = 0
  let start_y = 0
  let mouse_down = false

  function handleDragStart(event, colour, sourceGrid) {

    // take note of starting mouse pos
    start_x = event.clientX
    start_y = event.clientY

    mouse_down = true

    draggedGrid = sourceGrid
    draggedColour = colour
  }

  // droppint into grids
  function handleDrop(targetGrid) {

    // exit if no dragged colour or source grid is the same as destination grid
    if (!draggedColour || draggedGrid === targetGrid) return;

    // need distinct ID for copy of dragged colour or all colours are treated as the same 
    // this means dragging one colour back into the colour picker would get rid of all noted colours
    const copy = {
      ...draggedColour,
      id: crypto.randomUUID()
    };

    // remove from source grid
    if (draggedGrid === 'noted') {
      noted = noted.filter(function(colour) {
        return colour.id !== draggedColour.id;
      });
    }

    // add to target grid
    if (targetGrid === 'noted') {

      // check that the dragged colour name is not in the noted array before inserting
      if (!noted.some(colour => colour.name === draggedColour.name)) {
        noted = [...noted, copy];
      }
    }

    // reduce venter count if dragged colour was someone who vented
    if (targetGrid === 'colourGrid') {
      if (draggedColour.vented) {
        venters -= 1
      }
    }
  }

  // colour notes
  let selectedColour = null
  function openNotes(colour){
    selectedColour = colour

    // change text of text area to stored note if colour has any
    let storedNote = selectedColour.note
    document.getElementById('noteText').value = storedNote;   // plain JavaScript
  }

  function writeNote(){
    if (selectedColour == null) return
    selectedColour.note = document.getElementById("noteText").value
  }

  // resets positions, clears notes, returns text area placeholder text, unselects colour
  function reset(){
    noted = []
    document.getElementById("noteText").value = ""
    selectedColour = null
    venters = 0
  }

  // detect mouse up events
  function handleDragEnd(event) {
    const element = event.target

    mouse_down = false

    // only drop if mouse handler detected enough movement
    if (dragging){
      // see which string the target class contains and pass simple strings to original drop function
      if (element?.classList.contains("noted-grid") || element?.classList.contains("insert-visual")) {
        handleDrop("noted")
      } else {
        handleDrop("colourGrid")
      }
    }

    dragging = false
    draggedGrid = null
    draggedColour = null

    // reset starting positions
    start_x = 0
    start_y = 0
  }

  // handle mouse movements
  let mouse_x = 0
  let mouse_y = 0
  let dragging = false
  function handleMouseMove(event) {
    if (!mouse_down){return}

    mouse_x = event.clientX
    mouse_y = event.clientY

    // indicate drag is happening if mouse moves far enough from start pos 
    const dx = mouse_x - start_x
    const dy = mouse_y - start_y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance > 5){
      dragging = true
    }
  }

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
  {#if draggedColour && dragging}
    <div
      class="colour-card drag-ghost"
      style="left: {mouse_x}px; top: {mouse_y}px;"
    >
      <img src={draggedColour.src} alt="" />
    </div>
  {/if}

    <!-- Spacer to separate the two colour grids and improve coherency-->
    <div 
      class="grid spacer"
      style="grid-area: box-spacer"
    >
      <div class="filler" style="border-top-style: solid; border-left-style: solid"></div>
      <div class="filler" style="border-left-style: solid; border-right-style: solid;"></div>
      <div class="filler" style="border-left-style: solid;"></div>
      <div class="filler" style="border-style: solid; border-top-style: none"></div>
    </div>

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
    
      {#each colours as colour}
        <div class="colour-card">
          <img 
          src={colour.src} 
          draggable="false"
          alt={colour.name}
        
          on:mousedown={(event) => handleDragStart(event, colour, 'colourGrid')}
            />
        </div>
      {/each}
    </div>
  </div>

  <!--noted colours-->
  <div 
    class="middle-layout"
    style="grid-area: middle;"
  >

    <h1 style="grid-area: noted-header; border-left-style: none;">Noted</h1>

    <div 
      class="grid noted-grid"
      style="grid-area: noted"
      on:dragover={(event) => event.preventDefault()}
      on:drop={(event) => handleDrop(event, 'noted')}
    >
          
      {#each noted as colour}
      <div class="grid image-wrapper">
        <div class="colour-card">
            <img 
              style="grid-area: img-box"
              src={colour.src} 
              draggable="false"
              on:mousedown={(event) => handleDragStart(event, colour, 'noted')}
              on:click={() => openNotes(colour)}
            />
          </div>

          <!-- can't put {#if} directly into image opening tag -->
          <!-- do it like this with ternary expression instead-->
          <img 
            src={!colour.vented 
              ? "/assets/icons/venter_false.png"
              : "/assets/icons/venter.png"}
            alt=""
            draggable="false"
            style="height: 32px; width: 32px; justify-self: center;"

            on:click={() => {
              if (colour.vented){
                colour.vented = false;
                venters -= 1;
              } else {
                colour.vented = true;
                venters += 1;
              }
            }}
          >

          <!-- bound to role alignment of card, will automatically change background to base colour-->
          <select
            class="status-select"
            style="grid-area: dropdown-box"
            bind:value={colour.alignment}

            on:change={(event) => {
              const wrapper = event.currentTarget.parentElement;
              const card = wrapper.querySelector('.colour-card');

              card.style.backgroundColor = alignmentColours[colour.alignment]?.base;
            }}
          >
            <option value="none">None</option>
            <option value="crew">Crewmate</option>

            <!-- Only display neutral if mod is being used-->
            {#if selectedMod != "none"}
              <option value="neutral">Neutral</option>
            {/if}

            <option value="imposter">Imposter</option>
          </select>

        <div 
          class="grid alignment-grid"
          style="grid-area: box-alignment"
        >
          <div
            class="alignment-item"
            style:background-color={alignmentColours[colour.alignment]?.base ?? "black"}

            on:click={(event) => {
              const wrapper = event.currentTarget.parentElement?.parentElement
              const card = wrapper.querySelector('.colour-card')

              card.style.backgroundColor = alignmentColours[colour.alignment]?.base
            }}
          >
          </div>

          <div
            class="alignment-item"
            style:background-color={alignmentColours[colour.alignment]?.dark ?? "black"}

            on:click={(event) => {
            const wrapper = event.currentTarget.parentElement?.parentElement
            const card = wrapper.querySelector('.colour-card')

            card.style.backgroundColor = alignmentColours[colour.alignment]?.dark
          }}
          >
          </div>
        </div>
      </div> <!--close image wrapper-->
      {/each}

      <div class="insert-visual"></div>
    </div>

    <div 
      class="grid notes-grid"
      style="grid-area: notes"
    >

      <h1 style="border-left-style: none; font-size: 24px;">Notes for {selectedColour?.name || 'Colour'}</h1>

        <!-- automatically writes changes with event-->
        <!-- also saves and exits by intercepting return-->
        <!-- doesn't accept default drag and drop behaviour-->
        <textarea
          class="notes-input"
          placeholder={`Select colour in noted panel to start typing...`}
          id="noteText"
          spellcheck="false"
          on:change={() => writeNote()}
          on:drop={(e) => e.preventDefault()}

          on:keydown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            writeNote();
            event.currentTarget.blur(); // exit typing
          }
        }}
        ></textarea>
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

        <!-- Imposters-->
        <label 
          style="grid-area: imp-label"
          for="imposters">Imposters
        </label>

        <input 
          style="grid-area: imp-input; width: 64px"
          type="number" id="imposters" name="imposters" min="0" max="5"
        >

        <!-- Each of the dumb toggles -->
        {#each setting_toggle as toggle}
          <!-- Anonymous Votes-->
          <label 
            style="grid-area: {toggle.id}-label"
            for=toggle>{toggle.text}
          </label>

          <input 
            style="grid-area: {toggle.id}-input"
            type="checkbox" id={toggle.id} name= {toggle.id}
          >
        {/each}

        <!-- Taskbar Updates -->
        <label
          style="grid-area: tasks-label"
          for="tasks"
        >
          Taskbar Updates
        </label>
        

        <select
          style="grid-area: tasks-input"
          id="tasks" name="tasks"
        >
          <option value="always">Always</option>
          <option value="never">None</option>
          <option value="meetings">Meetings</option>
        </select>

        <!-- Vent cooldown-->
        <label 
          style="grid-area: vent-cooldown-label"
          for="vent-cooldown">Vent Cooldown
        </label>

        <input 
          style="grid-area: vent-cooldown-input; width: 64px"
          type="number" id="vent-cooldown" name="vent-cooldown" min="5" max="60" step="5"
          disabled={engineers === 0}
        >
    </div>


    <div
      class="grid roles-grid"
      style="grid-area: box-6"
    >
      <h2>Roles</h2>

      <!-- Engineer-->
      <!-- automatically becomes 1 if image is clicked and back to 0 if clicked again-->
      <!-- background colour fully derived from whether there are engineers or not-->
      <img 
        src="/assets/icons/engineer.png"
        alt=""
        style="
          width: 64px;
          height: 64px;
          background-color: {engineers !== 0 ? 'rgb(69, 127, 126)' : 'transparent'};
        "
        on:click={() => engineers = engineers === 0 ? 1 : 0}

        draggable="false"
        >

      <!--bound to change engineer count-->
      <input
        type="number" id="engineers" name="engineers" min="0" max="15"
        bind:value={engineers}
        style="font-size:xx-large; text-align: center; background-color: {engineers != 0 ? 'rgb(69, 127, 126)' : 'transparent'}; border-style: none"
      >

      <!-- Venters-->
      <!-- turns red if there are more venters spotted than there are engineers set-->
      <div
        style="
          padding-top: 8px;
          background-color: {venters > engineers ? 'rgb(125, 13, 17)' : '#3a3a3a'};
          color: white;
          font-size: xx-large;
          text-align: center;
        "
      >
        {venters}
      </div>

      <!-- also change background colour of the image for the same condition-->
      <img 
        class="venter-icon"
        src={venters === 0 ? "/assets/icons/venter_false.png" : "/assets/icons/venter.png"} 
        alt=""
        style="
          width: 64px; 
          height: 64px;
          background-color: {venters > engineers ? 'rgb(125, 13, 17)' : '#3a3a3a'};
        "
        draggable="false"
      >

      <!-- The rest are dumb toggles just to visually display that the roles are ingame-->
      {#each roles as role}
        <img 
          class="role-img"
          src="/assets/icons/{role.id}.png"
          alt=""
          draggable="false"
          
          on:click={(event) => {
            activateRole(event, [role.side])
          }}
        >
      {/each}

    </div>
    <div 
      class="grid map-grid"
      style="grid-area: box-5"
    >
      <h2>Map</h2>

      <!-- Button of each map from list-->
      	{#each maps as map}
        <img 
          class="map-btn"
          src="/assets/icons/{map}.png" alt=""
          on:click={() => selectMap(map)}
          draggable="false"
        >
        {/each}
    </div>

    <div 
      class="grid options-grid"
      style="grid-area: box-7;"
    >
      <h2>Opt</h2>

      <img 
        class="option-btn"
        src="/assets/icons/reset.png" alt=""
        on:click={() => reset()}

        draggable="false"
      >

      <select
        class="option-btn mod-options"
        bind:value={selectedMod}
        on:change={() => reset()}
      >
        <img src="/assets/icons/add_mod.png" alt="">

        <option value="none">None</option>
        <option value="tor">TOR</option>
        <option value="tou">TOU:M</option>
      </select>
    </div>
  </div> <!-- close right panel-->
</div>


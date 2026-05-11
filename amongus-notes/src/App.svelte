<script>
  import 'bootstrap/dist/css/bootstrap.min.css';

  // import all colour images as a meta glob
  const colourImages = import.meta.glob(
	  './assets/colours/*.png',
	  { eager: true }
  )

  // TOR colours 
  const torColourImages = import.meta.glob(
    './assets/tor_colours/*.png',
    { eager: true }
  );

  // TOU colours 
  const touColourImages = import.meta.glob(
    './assets/tou_colours/*.png',
    { eager: true }
  );

  // create easily indexable array of colours 
  // map file name and source to name and path for each colour within array
  let base_colours = Object.entries(colourImages).map(([path, module]) => {
    const name = path.split('/').pop().replace('.png', '');

    // each colour will have a name and source file path
    return {
      name,
      src: module.default,
      alignment: "none",
      note: "",
      vented: false
    };
  });

  // The Other Roles colours
  const tor_colours = Object.entries(torColourImages).map(([path, module]) => {
    const name = path.split('/').pop().replace('.png', '');

    // each colour will have a name and source file path
    return {
      name,
      src: module.default,
      alignment: "none",
      note: "",
      vented: false
    };
  });

  // Town Of Us colours
  const tou_colours = Object.entries(touColourImages).map(([path, module]) => {
    const name = path.split('/').pop().replace('.png', '');

    // each colour will have a name and source file path
    return {
      name,
      src: module.default,
      alignment: "none",
      note: "",
      vented: false
    };
  });

  // Generate final colour array based on user selected value, reactive
  let selectedMod = "none"

  // set colours to = result of this if statement block return
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

  // Alignment colours 
  // becomes the correct colour for whatever argument is added
  const alignmentColours = {
    imposter: {
      base: "red",
      dark: "rgb(125, 13, 17)"
    },
    crew: {
      base: "rgb(138, 254, 252)",
      dark: "rgb(69, 127, 126)"
    },
    neutral: {
      base: "rgb(255, 0, 255)",
      dark: "rgb(128, 0, 128"
    }
  };

  // track number of people seen venting to compare against engineer count
  let venters = 0
  let engineers = 0

  // track dragged colour and source grid 
  let draggedColour = null
  let draggedGrid = null

  // dynamic lists for grids
  let noted = []

  function handleDragStart(colour, sourceGrid) {
    // colour corresponds to the element
    draggedGrid = sourceGrid
    draggedColour = colour
  }

  function handleDragEnd() {
    draggedGrid = null
    draggedColour = null
  }

  // droppint into grids
  function handleDrop(event, targetGrid) {

    // exit if no dragged colour or source grid is the same as destination grid
    if (!draggedColour || draggedGrid === targetGrid) return;

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

    // add to target grid, max of 16 set
    if (targetGrid === 'noted' && noted.length < 16) {

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

  // map selection
  function selectMap(mapName){
    console.log(mapName)
  }

  // function to highlight/un-highlight roles in the role panel 
  function activateRole(event, alignment){
    let bg_colour;
    if (alignment == "evil"){
      bg_colour = "red"
    } else {
      bg_colour = "rgb(69, 127, 126)"
    }

    event.currentTarget.style.backgroundColor =
      event.currentTarget.style.backgroundColor === bg_colour
        ? "transparent"
        : bg_colour;
  }
</script>

<!-- start of markdown-->
<!-- main grid containing multiple grids -->
<div class="main-layout">

    <!-- Spacer to separate the two colour grids and improve coherency-->
    <div 
      class="grid spacer"
      style="grid-area: box-spacer"
    >
      <div class="filler" style="border-top-style: inset; border-left-style: inset"></div>
      <div class="filler" style="border-left-style: inset;"></div>
      <div class="filler" style="border-left-style: inset; border-right-style: inset;"></div>
      <div class="filler" style="border-left-style: inset;"></div>
      <div class="filler" style="border-style: inset; border-top-style: none"></div>
    </div>

  <!-- Specified header grid areas for scrollable grids-->
  <h2 style="grid-area: colour-picker-header;">Colour Picker</h2>
  <h1 style="grid-area: noted-header; border-left-style: none;">Noted</h1>

  <!-- need to pass arguments to be able to reduce venter count-->
  <div 
    class="grid colour-grid"
    style="grid-area: box-1"
    on:dragover={(event) => event.preventDefault()}
    on:drop={(event) => handleDrop(event, 'colourGrid')}
  >
  
    {#each colours as colour}
      <div class="colour-card">
        <img 
        src={colour.src} 
        draggable="true"
        alt={colour.name}
        on:dragstart={() => handleDragStart(colour, 'colourGrid')}
        on:dragend={handleDragEnd}
          />
      </div>
    {/each}
  </div>

  <!--noted colours-->
  <div 
    class="grid noted-grid"
    style="grid-area: box-2"
    on:dragover={(event) => event.preventDefault()}
    on:drop={(event) => handleDrop(event, 'noted')}
  >
  
    {#each noted as colour}
    <div class="grid image-wrapper">
      <div class="colour-card">
          <img 
            style="grid-area: img-box"
            src={colour.src} 
            draggable="true"
            on:dragstart={() => handleDragStart(colour, 'noted')}
            on:dragend={handleDragEnd}
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
    style="grid-area: box-3"
  >

    <h1 style="border-left-style: none">Notes for {selectedColour?.name || 'Colour'}</h1>

      <!--automatically writes changes with event-->
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

      <!-- Anonymous Votes-->
      <label 
        style="grid-area: anonymous-label"
        for="anonymous">Anonymous Votes
      </label>

      <input 
        style="grid-area: anonymous-input"
        type="checkbox" id="anonymous" name="anonymous"
      >

      <!-- Confirm Ejects-->
      <label 
        style="grid-area: ejects-label"
        for="ejects">Confirm Ejects
      </label>

      <input 
        style="grid-area: ejects-input"
        type="checkbox" id="ejects" name="ejects"
      >

      <!-- Visual tasks-->
      <label 
        style="grid-area: visuals-label"
        for="visuals">Visual Tasks
      </label>

      <input 
        style="grid-area: visuals-input"
        type="checkbox" id="visuals" name="visuals"
      >

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
        background-color: {venters > engineers ? 'red' : '#3a3a3a'};
        color: white;
        font-size: xx-large;
        text-align: center;
      "
    >
      {venters}
    </div>

    <!-- also change background colour of the image for the same condition-->
    <img 
      src={venters === 0 ? "/assets/icons/venter_false.png" : "/assets/icons/venter.png"} 
      alt=""
      style="
        width: 64px; 
        height: 64px;
        background-color: {venters > engineers ? 'red' : '#3a3a3a'};
      "
    >

    <!-- The rest are dumb toggles just to visually display that the roles are ingame-->
    <!-- Guardian Angel-->
    <img 
      class="role-img"
      src="/assets/icons/guardian.png"
      alt=""
      
      on:click={(event) => {
        activateRole(event, "good")
      }}
    >

    <!-- Trackers-->
    <img 
      class="role-img"
      src="/assets/icons/tracker.png"
      alt=""

      on:click={(event) => {
        activateRole(event, "good")
      }}
    >

    <!-- Viper-->
    <img 
      class="role-img"
      src="/assets/icons/viper.png"
      alt=""
      
      on:click={(event) => {
        activateRole(event, "evil")
      }}
    >

    <!-- Shapeshifter-->
    <img 
      class="role-img"
      src="/assets/icons/shapeshifter.png"
      alt=""
      
      on:click={(event) => {
        activateRole(event, "evil")
      }}
    >

    <!-- Scientist-->
    <img 
      class="role-img"
      src="/assets/icons/scientist.png"
      alt=""
      
      on:click={(event) => {
        activateRole(event, "good")
      }}
    >

    <!-- Detective-->
    <img 
      class="role-img"
      src="/assets/icons/detective.png"
      alt=""
      
      on:click={(event) => {
        activateRole(event, "good")
      }}
    >

    <!-- Noisemaker-->
    <img 
      class="role-img"
      src="/assets/icons/noisemaker.png"
      alt=""

      on:click={(event) => {
        activateRole(event, "good")
      }}
    >

    <!-- Phantom-->
    <img 
      class="role-img"
      src="/assets/icons/phantom.png"
      alt=""
      
      on:click={(event) => {
        activateRole(event, "evil")
      }}
    >

  </div>
  <div 
    class="grid interface-grid"
    style="grid-area: box-5"
  >
    <h2>Map</h2>
      <img 
        class="skeld-btn"
        src="/assets/icons/skeld.png" alt=""
        on:click={() => selectMap("skeld")}
      >

      <img 
        class="polus-btn"
        src="/assets/icons/polus.png" alt=""
        on:click={() => selectMap("polus")}
      >

      <img 
        class="mira-btn"
        src="/assets/icons/mira.png" alt=""
        on:click={() => selectMap("mira")}
      >

      <img 
        class="airship-btn"
        src="/assets/icons/airship.png" alt=""
        on:click={() => selectMap("airship")}
      >

      <img 
        class="fungle-btn"
        src="/assets/icons/fungle.png" alt=""
        on:click={() => selectMap("fungle")}
      >

      <img 
        class="submerged-btn"
        src="/assets/icons/submerged.png" alt=""
        on:click={() => selectMap("submerged")}
      >
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
</div>

<style>
/* can't move this to app.css for some reason */
h1 {
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  color: white;
  background-color: black;

  border-style:inset;
  border-width: 5px;
  border-color: #3a3a3a;
  
  font-family: "VCR_OSD_MONO";
  src: url("/assets/fonts/VCR_OSD_MONO.tff") format("truetype");
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.5px;

  text-transform: uppercase;
}

h2 {
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  color: white;
  background-color: #3a3a3a;
  
  font-family: "VCR_OSD_MONO";
  src: url("/assets/fonts/VCR_OSD_MONO.tff") format("truetype");
  font-size: medium;
  font-weight: 600;
  letter-spacing: 0.5px;

  text-transform: uppercase;
}

/* written to take up whole 1st row of a grid */
.grid h2 {
  margin-top: 0;
  grid-column: 1 / -1;
}
</style>
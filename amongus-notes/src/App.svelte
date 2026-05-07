<script>
  import 'bootstrap/dist/css/bootstrap.min.css';
	import 'bootstrap-icons/font/bootstrap-icons.min.css';

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
      note: "",
      vented: false
    };
  });

  // Generate final colour array based on user selected value
  // reacts automatically
  let selectedMod = "none"

  // set colours to = result of this if statement block return
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

  // track roles
  let guardians = false
  let scientists = false
  let detectives = false
  let noisemakers = false
  let trackers = false
  let shapeshifters = false
  let vipers = false
  let phantoms = false

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
    console.log("reseting")
    noted = []
    document.getElementById("noteText").value = ""
    selectedColour = null
    venters = 0
  }

  // map selection
  function selectMap(mapName){
    console.log(mapName)
  }
</script>

<!-- start of markdown-->
<!-- main grid containing multiple grids -->
<div class="main-layout">

  <!-- need to pass arguments to be able to reduce venter count-->
  <div 
    class="grid colour-grid"
    style="grid-area: box-1"
    on:dragover={(event) => event.preventDefault()}
    on:drop={(event) => handleDrop(event, 'colourGrid')}
  >

    <h3>Colour Picker</h3>
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
    <h3>Noted</h3>
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
            ? "/assets/icons/engineer_false.png"
            : "/assets/icons/engineer.png"}
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

        <select
        class="status-select"
        style="grid-area: dropdown-box"
        on:change={(event) => {
          const value = event.target.value;
          const wrapper = event.currentTarget.parentElement;
          const card = wrapper.querySelector('.colour-card');

          if (value === 'sus') {
            card.style.backgroundColor = '#5a3a3a';
          } else if (value === 'soft-clear') {
            card.style.backgroundColor = 'rgb(190, 220, 80)';
          } else if (value === 'hard-clear') {
            card.style.backgroundColor = 'rgb(0, 255, 0)';
          } else if (value === 'imposter') {
            card.style.backgroundColor = 'rgb(255, 0, 0';
          } else {
            card.style.backgroundColor = '';
          }
        }}
      >
        <option value="">None</option>
        <option value="sus">Suspect</option>
        <option value="soft-clear">Soft Clear</option>
        <option value="hard-clear">Hard Clear</option>
        <option value="imposter">Imposter</option>
      </select>
    </div>
    {/each}
  </div>

  <div 
    class="grid notes-grid"
    style="grid-area: box-3"
  >

    <h3>Notes for {selectedColour?.name || 'Colour'}</h3>

      <!--automatically writes changes with event-->
      <textarea
        class="notes-input"
        placeholder={`Select colour in noted panel to start typing...`}
        id="noteText"
        spellcheck="false"
        on:change={() => writeNote()}
      ></textarea>
  </div>

  <div
    class="grid lobby-settings-grid"
    style="grid-area: box-4"
  >
    <h3 style="grid-area: lobby-settings-label">Lobby Settings</h3>

      <!-- Imposters-->
      <label 
        style="grid-area: imp-label"
        for="imposters">Imposters
      </label>

      <input 
        style="grid-area: imp-input; width: 64px"
        type="number" id="imposters" name="imposters" min="0" max="3"
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
    <h3>Roles</h3>

    <!-- Engineer-->
    <!-- automatically becomes 1 if image is clicked and back to 0 if clicked again-->
    <img 
      src={engineers === 0 ? "/assets/icons/engineer_false.png" : "/assets/icons/engineer.png"} 
      alt=""
      on:click={() => engineers = engineers === 0 ? 1 : 0}
      style="width: 64px; height: 64px; background-color: blue"
    >

    <input
      type="number" id="engineers" name="engineers" min="0" max="15"
      bind:value={engineers}
      style="border-bottom-right-radius: 1rem; font-size:xx-large; text-align: center; background-color: blue"
    >

    <!-- Venters-->
    <!-- turns red if there are more venters spotted than there are engineers set-->
    <div
      style="
        padding-top: 8px;
        background-color: {venters > engineers ? 'red' : '#3a3a3a'};
        color: white;
        border-bottom-left-radius: 1rem;
        font-size: xx-large;
        text-align: center;
      "
    >
      {venters}
    </div>

    <img 
      src={venters === 0 ? "/assets/icons/venter_false.png" : "/assets/icons/venter.png"} 
      alt=""
      on:click={() => engineers = engineers === 0 ? 1 : 0}
      style="width: 64px; height: 64px; background-color: #3a3a3a"
    >

    <!-- Phantom-->
    <img 
      src={!phantoms ? "/assets/icons/phantom_false.png" : "/assets/icons/phantom.png"} 
      alt=""
      on:click={() => phantoms = !phantoms}
    >

    <!-- Viper-->
    <img 
      src={!vipers ? "/assets/icons/viper_false.png" : "/assets/icons/viper.png"} 
      alt=""
      on:click={() => vipers = !vipers}
    >

    <!-- Guardian Angel-->
    <img 
      src={!guardians ? "/assets/icons/guardian_false.png" : "/assets/icons/guardian.png"} 
      alt=""
      on:click={() => guardians = !guardians}
    >

    <!-- Shapeshifter-->
    <img 
      src={!shapeshifters ? "/assets/icons/shapeshifter_false.png" : "/assets/icons/shapeshifter.png"} 
      alt=""
      on:click={() => shapeshifters = !shapeshifters}
    >

    <!-- Scientist-->
    <img 
      src={!scientists ? "/assets/icons/scientist_false.png" : "/assets/icons/scientist.png"} 
      alt=""
      on:click={() => scientists = !scientists}
    >


    <!-- Detective-->
    <img 
      src={!detectives ? "/assets/icons/detective_false.png" : "/assets/icons/detective.png"} 
      alt=""
      on:click={() => detectives = !detectives}
    >

    <!-- Noisemaker-->
    <img 
      src={!noisemakers ? "/assets/icons/noisemaker_false.png" : "/assets/icons/noisemaker.png"} 
      alt=""
      on:click={() => noisemakers = !noisemakers}
    >

    <!-- Tracker-->
    <img 
      src={!trackers ? "/assets/icons/tracker_false.png" : "/assets/icons/tracker.png"} 
      alt=""
      on:click={() => trackers = !trackers}
    >

  </div>
  <div 
    class="grid interface-grid"
    style="grid-area: box-5"
  >
    <h3>Map</h3>
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
    <h3>Opt</h3>

    <img 
      src="/assets/icons/play_again.png" alt=""
      style="width: 64px; height: 64px; border-style: inset; border-color: white"
      on:click={() => reset()}
    >


    <select
      bind:value={selectedMod}
      style="width: 64px; height: 64px; border-style: inset; border-color: white"
    >
      <option value="none">None</option>
      <option value="tor">TOR</option>
      <option value="tou">TOU</option>
    </select>
  </div>
</div>

<style>
/* can't move this to app.css for some reason */
h3 {
  margin-top: 1rem;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  color: white;
  background-color: black;

  border-style:inset;
  
  font-family: "VCR_OSD_MONO";
  src: url("/assets/fonts/VCR_OSD_MONO.tff") format("truetype");
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
}

/* written to take up whole 1st row of a grid */
.grid h3 {
  margin-top: 0;
  grid-column: 1 / -1;
}
</style>
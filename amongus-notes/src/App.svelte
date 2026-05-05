<script>
  import 'bootstrap/dist/css/bootstrap.min.css';
	import 'bootstrap-icons/font/bootstrap-icons.min.css';

  // import all colour images as a meta glob
  const colourImages = import.meta.glob(
	  './assets/colours/*.png',
	  { eager: true }
  )

  // create easily indexable array of colours 
  // map file name and source to name and path for each colour within array
  const colours = Object.entries(colourImages).map(([path, module]) => {
    const name = path.split('/').pop().replace('.png', '');

    // each colour will have a name and source file path
    return {
      name,
      src: module.default,
      note: ""
    };
  });

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
  }

  // map selection
  function selectMap(mapName){
    console.log(mapName)
  }
</script>

<!-- start of markdown-->
<!-- main grid containing multiple grids -->
<div class="main-layout">

  <!-- don't need to pass anything for drop here, just let it happen with no arguments to clear from source-->
  <div 
    class="grid colour-grid"
    style="grid-area: box-1"
    on:dragover={(event) => event.preventDefault()}
    on:drop={() => handleDrop()}
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

        <img 
          src="/assets/icons/vented_default.png" alt=""
          style="height: 32px; width: 32px; justify-self:center"
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
        placeholder={`Select colour in noted panel to start typing \n \nYour notes for ${selectedColour?.name || 'Colour'}...`}
        id="noteText"
        spellcheck="false"
        on:change={() => writeNote()}
      ></textarea>
  </div>

  <div
    class="grid lobby-settings-grid"
    style="grid-area: box-4"
  >
    <h3>Lobby Settings</h3>

    <div>
      <label for="imposters">Imposters:</label>
      <input type="number" id="imposters" name="imposters" min="1" max="3">
    </div>
    <div>
      <label for="anonymous">Anonymous Votes:</label>
      <input type="checkbox" id="anonymous" name="anonymous">
    </div>
    <div>
      <label for="confirmations">Confirm Ejects:</label>
      <input type="checkbox" id="confirmations" name="confirmations">
    </div>
    <div>
      <label for="visuals">Visual Tasks:</label>
      <input type="checkbox" id="visuals" name="visuals">
    </div>
    <div>
      <label for="engineers">Engineers:</label>
      <input type="number" id="engineers" name="engineers" min="1" max="15">
    </div>
    <div>
      <label for="shapeshifters">Shapeshifters:</label>
      <input type="number" id="shapeshifters" name="shapeshifters" min="1" max="15">
    </div>
    <div>
      <label for="vipers">Vipers:</label>
      <input type="number" id="vipers" name="vipers" min="1" max="15">
    </div>
    <div>
      <label for="guardians">Guardian Angles:</label>
      <input type="number" id="guardians" name="guardians" min="1" max="15">
    </div>
    <div>
      <label for="scientists">Scientists:</label>
      <input type="checkbox" id="scientists" name="scientists">
    </div>
    <div>
      <label for="detectives">Detectives:</label>
      <input type="checkbox" id="detectives" name="detectives">
    </div>
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
</div>

  <div 
    class="grid map-grid"
    style="grid-area: box-5"
  >


      <img src="/assets/maps/skeld_layout.png" alt="">
  </div>

        <button class="reset-btn"
      on:click={() => reset()}>
      Reset
    </button>




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

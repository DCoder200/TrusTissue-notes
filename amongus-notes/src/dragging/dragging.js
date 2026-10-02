// JS for drag and drop system

// import shared states 
import {dragState} from "./dragState.svelte.js"
import {notedColours} from "../sharedStates/notedColours.svelte.js"
import {counts} from "../sharedStates/counts.svelte";

export function handleDragStart(event, colour, sourceGrid) {
    //console.log("dragging started")

    // take note of starting mouse pos
    dragState.start_x = event.clientX
    dragState.start_y = event.clientY

    dragState.mouse_down = true

    dragState.draggedGrid = sourceGrid
    dragState.draggedColour = colour
}


// dropping into grids
export function handleDrop(targetGrid) {
    //console.log("dropping started")

    // exit if no dragged colour or source grid is the same as destination grid
    if (!dragState.draggedColour || dragState.draggedGrid === targetGrid) return;

    // need distinct ID for copy of dragged colour or all colours are treated as the same 
    // this means dragging one colour back into the colour picker would get rid of all noted colours
    const copy = {
        ...dragState.draggedColour,
        id: crypto.randomUUID()
    };

    // remove from source grid
    if (dragState.draggedGrid === 'noted') {
        notedColours.noted = notedColours.noted.filter(function(colour) {
        return colour.id !== dragState.draggedColour.id;
        });
    }

    // add to target grid
    if (targetGrid === 'noted') {

        // check that the dragged colour name is not in the noted array before inserting
        if (!notedColours.noted.some(colour => colour.name === dragState.draggedColour.name)) {
        notedColours.noted = [...notedColours.noted, copy];
        }
    }

    // reduce venter count if dragged colour was someone who vented
    if (targetGrid === 'colourGrid') {
        if (dragState.draggedColour.vented) {
        counts.venters -= 1
        }
    }
}


// detect mouse up events
export function handleDragEnd(event) {
    //console.log("dragging ended")
    const element = event.target

    dragState.mouse_down = false

    // only drop if mouse handler detected enough movement
    if (dragState.dragging){
        // see which string the target class contains and pass simple strings to original drop function
        if (element?.classList.contains("noted-grid") || element?.classList.contains("insert-visual")) {
        handleDrop("noted")
        } else {
        handleDrop("colourGrid")
        }
    }

    dragState.dragging = false
    dragState.draggedGrid = null
    dragState.draggedColour = null

    // reset starting positions
    dragState.start_x = 0
    dragState.start_y = 0
}



// handle mouse movements
export function handleMouseMove(event) {
    if (!dragState.mouse_down){return}

    dragState.mouse_x = event.clientX
    dragState.mouse_y = event.clientY

    // indicate drag is happening if mouse moves far enough from start pos 
    const dx = dragState.mouse_x - dragState.start_x
    const dy = dragState.mouse_y - dragState.start_y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance > 5){
        dragState.dragging = true
    }
}



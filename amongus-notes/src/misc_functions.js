  import {notedColours} from "../sharedStates/notedColours.svelte.js"
import {counts} from "../sharedStates/counts.svelte";
  
  
  
  // map selection
  export function selectMap(mapName){
    console.log(mapName)
  }

  // function to highlight/un-highlight roles in the role panel 
  export function activateRole(event, alignment){
    let bg_colour;
    if (alignment == "evil"){
      bg_colour = "rgb(125, 13, 17)"
    } else {
      bg_colour = "rgb(69, 127, 126)"
    }

    event.currentTarget.style.backgroundColor =
      event.currentTarget.style.backgroundColor === bg_colour
        ? "transparent"
        : bg_colour;
  }


  // resets positions, clears notes, returns text area placeholder text, unselects colour
  export function reset(){
    notedColours.noted = []
    document.getElementById("noteText").value = ""
    notedColours.selectedColour = null
    counts.venters = 0
  }
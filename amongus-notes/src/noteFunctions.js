import {notedColours} from "./sharedStates/notedColours.svelte.js"

// colour notes
export function openNotes(colour){
    notedColours.selectedColour = colour

    // change text of text area to stored note if colour has any
    let storedNote = notedColours.selectedColour.note
    document.getElementById('noteText').value = storedNote;   // plain JavaScript
}

export function writeNote(){
    if (notedColours.selectedColour == null) return
    notedColours.selectedColour.note = document.getElementById("noteText").value
}
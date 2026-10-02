// shared state file 
/* 
this means app.svelte can import and modify these values and any other file that imports 
this file will have those changes propogate
*/ 

export const notedColours = $state({
    noted: [],
    selectedColour: null
})
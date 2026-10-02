// shared state file 
/* 
this means app.svelte can import and modify these values and any other file that imports 
this file will have those changes propogate
*/ 

export const dragState = $state({
    dragging: false,
    draggedColour: null,
    draggedGrid: null,
    mouse_down: false,
    start_x: 0,
    start_y: 0,
    mouse_x: 0,
    mouse_y: 0
})
<script>
    // let this info be fed in from app.svelte
    let { colour, handleDragStart, handleDrop, gridName, openNotes = null } = $props();
</script>

<!-- openNotes event will only trigger if the function was passed-->
<div class="colour-card">
        <img 
        src={colour.src} 
        draggable="false"
        alt={colour.name}
    
        on:mousedown={(event) => handleDragStart(event, colour, gridName)}
        on:drop={(event) => handleDrop(event, gridName)}
        on:click={openNotes ? () => openNotes(colour) : undefined}
        />
</div>



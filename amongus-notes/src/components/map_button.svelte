<script>
    // let this info be fed in from app.svelte
    let {map, selectMap} = $props();
</script>


<img 
    class="map-btn"
    src="/assets/icons/{map}.png" alt=""
    on:click={() => selectMap(map)}
    draggable="false"
>
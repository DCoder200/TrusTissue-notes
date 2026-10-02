<script>
    // let this info be fed in from app.svelte
    let {selectedMod = $bindable(), reset} = $props();
</script>


<div 
    class="grid options-grid"
    style="grid-area: box-7;"
>
    <h2>Opt</h2>

    <img 
        class="option-btn"
        src="/assets/icons/reset.png" alt=""
        on:click={() => reset()}

        draggable="false"
    >

    <select
        class="option-btn mod-options"
        bind:value={selectedMod}
        on:change={() => reset()}
    >

    <img src="/assets/icons/add_mod.png" alt="">

    <option value="none">Vanilla</option>
    <option value="tor">TOR</option>
    <option value="tou">TOU:M</option>
    </select>
</div>
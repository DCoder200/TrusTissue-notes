<script>
    // let this info be fed in from app.svelte
    let {role} = $props();
    import {counts} from "../sharedStates/counts.svelte";
</script>

<!-- Engineer-->
<!-- automatically becomes 1 if image is clicked and back to 0 if clicked again-->
<!-- background colour fully derived from whether there are engineers or not-->

{#if role == "engineer"}
    <img 
        src="/assets/icons/engineer.png"
        alt=""
        style="
            width: 64px;
            height: 64px;
            background-color: {counts.engineers !== 0 ? 'rgb(69, 127, 126)' : 'transparent'};
        "
        on:click={() => counts.engineers = counts.engineers === 0 ? 1 : 0}

        draggable="false"
    >

    <!--bound to change engineer count-->
    <input
        type="number" id="engineers" name="engineers" min="0" max="15"
        bind:value={counts.engineers}
        style="font-size:xx-large; text-align: center; background-color: {counts.engineers != 0 ? 'rgb(69, 127, 126)' : 'transparent'}; border-style: none"
    >

{:else}
    <!-- Venters-->
    <!-- turns red if there are more venters spotted than there are engineers set-->
    <div
    style="
        padding-top: 8px;
        background-color: {counts.venters > counts.engineers ? 'rgb(125, 13, 17)' : '#3a3a3a'};
        color: white;
        font-size: xx-large;
        text-align: center;
    "
    >
    {counts.venters}
    </div>

    <!-- also change background colour of the image for the same condition-->
    <img 
    class="venter-icon"
    src={counts.venters === 0 ? "/assets/icons/venter_false.png" : "/assets/icons/venter.png"} 
    alt=""
    style="
        width: 64px; 
        height: 64px;
        background-color: {counts.venters > counts.engineers ? 'rgb(125, 13, 17)' : '#3a3a3a'};
    "
    draggable="false"
    >
{/if}
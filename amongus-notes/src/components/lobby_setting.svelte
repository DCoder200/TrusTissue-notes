<script>
    // let this info be fed in from app.svelte
    let {setting} = $props();

    import {counts} from "../sharedStates/counts.svelte";
</script>


{#if setting == "imposters"}
    <!-- Imposters-->
    <label 
        style="grid-area: imp-label"
        for="imposters">Imposters
    </label>

    <input 
        style="grid-area: imp-input; width: 64px"
        type="number" id="imposters" name="imposters" min="0" max="5"
    >

{:else if setting == "taskbar_updates"}
    <!-- Taskbar Updates -->
    <label
        style="grid-area: tasks-label"
        for="tasks"
    >
        Taskbar Updates
    </label>


    <select
        style="grid-area: tasks-input"
        id="tasks" name="tasks"
    >
        <option value="always">Always</option>
        <option value="never">None</option>
        <option value="meetings">Meetings</option>
    </select>

{:else}
    <!-- Vent cooldown-->
    <label 
        style="grid-area: vent-cooldown-label"
        for="vent-cooldown">Vent Cooldown
    </label>

    <input 
        style="grid-area: vent-cooldown-input; width: 64px"
        type="number" id="vent-cooldown" name="vent-cooldown" min="5" max="60" step="5"
        disabled={counts.engineers === 0}
    >
{/if}

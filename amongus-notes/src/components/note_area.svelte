
<script>
    // let this info be fed in from app.svelte
    let {writeNote} = $props();
</script>

<!-- automatically writes changes with event-->
<!-- also saves and exits by intercepting return-->
<!-- doesn't accept default drag and drop behaviour-->
<textarea
    class="notes-input"
    placeholder={`Select colour in noted panel to start typing...`}
    id="noteText"
    spellcheck="false"
    on:change={() => writeNote()}
    on:drop={(e) => e.preventDefault()}

    on:keydown={(event) => {
    if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    writeNote();
    event.currentTarget.blur(); // exit typing
    }
}}
></textarea>
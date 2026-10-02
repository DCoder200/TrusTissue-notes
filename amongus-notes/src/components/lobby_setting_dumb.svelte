
<script>
    // let this info be fed in from app.svelte
    let {toggle} = $props();
</script>

<label 
style="grid-area: {toggle.id}-label"
for=toggle>{toggle.text}
</label>

<input 
style="grid-area: {toggle.id}-input"
type="checkbox" id={toggle.id} name= {toggle.id}
>
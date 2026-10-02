        
<script>
      let {role, activateRole} = $props(); 
</script>

<img 
  class="role-img"
  src="/assets/icons/{role.id}.png"
  alt=""
  draggable="false"
  
  on:click={(event) => {
    activateRole(event, [role.side])
  }}
>
<script lang="ts">
  import { onDestroy } from "svelte";

  import { height } from "./stores.js";
  export let path;
  export let color: string;
  $: pathString = pathToString(path);

  function pathToString(path) {
    let pathString = "";
    for (let i = 0; i < path.length; i++) {
      let point = path[i];
      pathString += `${point[0]},${$height - point[1]} `;
    }
    return pathString;
  }
</script>

<polyline points={pathString} fill="none" stroke={color} />

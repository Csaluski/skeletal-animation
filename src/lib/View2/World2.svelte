<script lang="ts">
  export let viewHeight;
  export let viewWidth;
  import { width, height } from "../stores";
  import Figure from "./Figure.svelte";
  import Path from "../Path.svelte";

  let originPoints = [
    [-1000000, 0],
    [1000000, 0],
    [0, -1000000],
    [0, 1000000],
  ];

  let degrees = 0;
  $: theta = degrees * Math.PI / 180;
</script>
<div class="row">

<div class="col-sm-9">
<svg
  viewBox="{-viewWidth} {-viewHeight} {viewWidth*2} {viewHeight * 2}"
  width="100%"
  height="200"
  style="background-color:lightgray"
>
  <Path path={[originPoints[0], originPoints[1]]} color="grey" />
  <Path path={[originPoints[2], originPoints[3]]} color="grey" />
  <Figure {theta} />
</svg>
</div>
<!-- style="position: absolute; right: 5em;" -->
<div class="rounded bg-dark col-sm-3 text-light" >
  <label>
    Angle=<input type="number" bind:value={degrees} min="-180" max="180" />
    <input type="range" bind:value={degrees} min="-180" max="180" />
  </label>
</div>
</div>
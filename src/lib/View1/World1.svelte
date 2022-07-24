<script lang="ts">
  import { width, height } from "../stores";
  import Figure from "./Figure.svelte";
  import Path from "../Path.svelte";

  export let viewHeight;
  export let viewWidth;

  let originPoints = [
    [-1000000, 0],
    [1000000, 0],
    [0, -1000000],
    [0, 1000000],
  ];

  let xOffset = 0;
  let yOffset = 0;
  $: translateVec = [xOffset, yOffset];
</script>

<div class="row">
  <div class="col-lg-9">
    <svg
      viewBox="0 {-viewHeight} {viewWidth} {viewHeight * 1.5}"
      width="100%"
      height="200"
      style="background-color:lightgray"
    >
      <Path path={[originPoints[0], originPoints[1]]} color="grey" />
      <Path path={[originPoints[2], originPoints[3]]} color="grey" />
      <Figure {translateVec} />
    </svg>
  </div>
  <!-- style="position: absolute; right: 5em;" -->
  <div class="rounded bg-dark col-lg-3 text-light">
    <label>
      X=<input type="number" bind:value={xOffset} min="-100" max="100" />
      <input type="range" bind:value={xOffset} min="-100" max="100" />
    </label>

    <div class="w-100" />
    <label>
      Y=<input type="number" bind:value={yOffset} min="-50" max="50" />
      <input type="range" bind:value={yOffset} min="-50" max="50" />
    </label>
    <p>Translate = [{xOffset}, {yOffset}]</p>
  </div>
</div>

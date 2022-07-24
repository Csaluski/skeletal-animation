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

  let xShear = 0;
  let yShear = 0;
  let shearVec; 
  $: shearVec = [xShear, yShear];
</script>

<div class="row">
  <div class="col-sm-9">
    <svg
      viewBox="{-viewWidth} {-viewHeight} {viewWidth * 2} {viewHeight * 2}"
      width="100%"
      height="300"
      style="background-color:lightgray"
    >
      <Path path={[originPoints[0], originPoints[1]]} color="grey" />
      <Path path={[originPoints[2], originPoints[3]]} color="grey" />
      <Figure {shearVec} />
    </svg>
  </div>
  <div class="rounded bg-dark col-lg-3 text-light">
    <label>
      xShear=<input
        type="number"
        step=".1"
        bind:value={xShear}
        min="-3"
        max="3"
      />
      <input type="range" step=".1" bind:value={xShear} min="-3" max="3" />
    </label>

    <div class="w-100" />
    <label>
      yShear=<input
        type="number"
        step=".1"
        bind:value={yShear}
        min="-3"
        max="3"
      />
      <input type="range" step=".1" bind:value={yShear} min="-3" max="3" />
    </label>
    <p>Shear = [{shearVec[0]}, {shearVec[1]}]</p>
  </div>
</div>

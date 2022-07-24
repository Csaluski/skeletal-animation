<script lang="ts">
  export let viewHeight;
  export let viewWidth;
  import Figure from "./Figure.svelte";
  import Path from "../Path.svelte";

  let originPoints = [
    [-1000000, 0],
    [1000000, 0],
    [0, -1000000],
    [0, 1000000],
  ];

  let xScale = 1;
  let yScale = 1;
  let preserveAspectRatio = false;
  let scaleVec;
  $: scaleVec = preserveAspectRatio ? [xScale, xScale] : [xScale, yScale];
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
      <Figure {scaleVec} />
    </svg>
  </div>
  <div class="rounded bg-dark col-lg-3 text-light">
    <label>
      xScale=<input
        type="number"
        step=".1"
        bind:value={xScale}
        min="-3"
        max="3"
      />
      <input type="range" step=".1" bind:value={xScale} min="-3" max="3" />
    </label>

    <div class="w-100" />
    <label>
      yScale=<input
        type="number"
        step=".1"
        bind:value={yScale}
        min="-3"
        max="3"
        disabled={preserveAspectRatio}
      />
      <input disabled={preserveAspectRatio} type="range" step=".1" bind:value={yScale} min="-3" max="3" />
    </label>
    <label >Preserve Aspect Ratio<input type="checkbox" bind:checked={preserveAspectRatio}></label>
    <p>Scale = [{scaleVec[0]}, {scaleVec[1]}]</p>
  </div>
</div>

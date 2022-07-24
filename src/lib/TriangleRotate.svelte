<script lang="ts">
  import Path from "./Path.svelte";
  import Point from "./Point.svelte";

  export let viewHeight;
  export let viewWidth;

  let originPoints = [
    [-1000000, 0],
    [1000000, 0],
    [0, -1000000],
    [0, 1000000],
  ];

  let xOriginal = 30;
  let yOriginal = 40;

  let degree = 90;
  $: theta = degree * Math.PI / 180;

  $: xRot = xOriginal * Math.cos(theta) - yOriginal * Math.sin(theta);
  $: yRot = xOriginal * Math.sin(theta) + yOriginal * Math.cos(theta);
</script>

<div class="row">
  <div class="col-xl-8">
    <svg
      viewBox="{-viewWidth} {-viewHeight} {viewWidth * 2} {viewHeight * 2}"
      width="100%"
      height="400"
      style="background-color:lightgray"
    >
      <Path path={[originPoints[0], originPoints[1]]} color="grey" />
      <Path path={[originPoints[2], originPoints[3]]} color="grey" />

      <circle
        r={Math.sqrt(Math.pow(xOriginal, 2) + Math.pow(yOriginal, 2))}
        fill="none"
        stroke="grey"
      />

      <Path
        path={[
          [0, 0],
          [xOriginal, 0],
        ]}
        color="black"
      />
      <Path
        path={[
          [xOriginal, 0],
          [xOriginal, yOriginal],
        ]}
        color="black"
      />
      <Path
        path={[
          [0, 0],
          [xOriginal, yOriginal],
        ]}
        color="black"
      />

      <Point point={[xOriginal, yOriginal]} fill="red" />

      <Path
        path={[
          [0, 0],
          [xRot, 0],
        ]}
        color="black"
      />
      <Path
        path={[
          [xRot, 0],
          [xRot, yRot],
        ]}
        color="black"
      />
      <Path
        path={[
          [0, 0],
          [xRot, yRot],
        ]}
        color="black"
      />

      <Point point={[xRot, yRot]} fill="blue" />
    </svg>
  </div>
  <div class="rounded bg-dark col-xl-4 text-light">
    <label>
      X=<input type="number" bind:value={xOriginal} min="-100" max="100" />
      <input type="range" bind:value={xOriginal} min="-100" max="100" />
    </label>

    <div class="w-100" />
    <label>
      Y=<input type="number" bind:value={yOriginal} min="-100" max="100" />
      <input type="range" bind:value={yOriginal} min="-100" max="100" />
    </label>
    <p>Point = [{xOriginal}, {yOriginal}]</p>

    <div class="w-100" />
    <label>
      Degrees=<input
        type="number"
        bind:value={degree}
        min="-180"
        max="180"
      />
      <input
        type="range"
        bind:value={degree}
        min="-180"
        max="180"
        step="1"
      />
    </label>

    <p>
      Rotated X = {xOriginal} * {Math.cos(theta).toPrecision(3)} - {yOriginal} *
      {Math.sin(theta).toPrecision(3)} = {xRot.toPrecision(3)}
    </p>

    <p>
      Rotated Y = {xOriginal} * {Math.sin(theta).toPrecision(3)} + {yOriginal} *
      {Math.cos(theta).toPrecision(3)} = {yRot.toPrecision(3)}
    </p>

  </div>
</div>

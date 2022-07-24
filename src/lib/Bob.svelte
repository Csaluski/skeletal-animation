<script lang="ts">
  import Path from "./Path.svelte";
  import Point from "./Point.svelte";
  import { width, height } from "./stores";
  import { Matrix } from "ml-matrix";

  let points = [
    [0, 0], // left foot
    [10, 10], // pelvis
    [20, 0], // right foot
    [10, 20], // chest
    [10, 30], // head
    [0, 20], // left hand
    [20, 20], // right hand
  ];
  let pointsMat: Matrix = new Matrix(points);

  let boundBox = [
    [0, 0], // lower left
    [0, 0], // upper right
  ];

  for (const point of points) {
    if (point[0] < boundBox[0][0]) {
      boundBox[0][0] = point[0];
    }
    if (point[0] > boundBox[1][0]) {
      boundBox[1][0] = point[0];
    }
    if (point[1] < boundBox[0][1]) {
      boundBox[0][1] = point[1];
    }
    if (point[1] > boundBox[1][1]) {
      boundBox[1][1] = point[1];
    }
  }

  let connections = [
    [points[0], points[1]],
    [points[1], points[2]],
    [points[1], points[3]],
    [points[3], points[4]],
    [points[3], points[5]],
    [points[3], points[6]],
  ];

  let boundConnections = [
    [boundBox[0], [boundBox[1][0], boundBox[0][0]]],
    [boundBox[0], [boundBox[0][0], boundBox[1][1]]],
    [boundBox[1], [boundBox[0][0], boundBox[1][1]]],
    [boundBox[1], [boundBox[1][0], boundBox[0][1]]],
  ]

  let transformedPoints = pointsMat.to2DArray();
</script>


{#each boundConnections as connection}
  <Path path={connection} color="grey" />
{/each}
{#each connections as connection}
  <Path path={connection} color="black"/>
{/each}
{#each points as point}
  <Point {point} />
{/each}

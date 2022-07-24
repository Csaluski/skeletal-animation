<script lang="ts">
  import Path from "../Path.svelte";
  import Point from "../Point.svelte";
  import { width, height } from "../stores";
  import { Matrix } from "ml-matrix";

  export let theta = 0;

  let points = [
    [0, 0], // left foot
    [10, 10], // pelvis
    [20, 0], // right foot
    [10, 20], // chest
    [10, 30], // head
    [0, 20], // left hand
    [20, 20], // right hand
  ];

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
  ];

  let pointsMat: Matrix = new Matrix(points);

  let rotateConnections;
  $: rotatePoints = rotateTransform(pointsMat.to2DArray(), theta);
  $: rotateConnections = [
    [rotatePoints[0], rotatePoints[1]],
    [rotatePoints[1], rotatePoints[2]],
    [rotatePoints[1], rotatePoints[3]],
    [rotatePoints[3], rotatePoints[4]],
    [rotatePoints[3], rotatePoints[5]],
    [rotatePoints[3], rotatePoints[6]],
  ];

  let rotBoundBox;
  $: {
    rotBoundBox = [
      [0, 0], // lower left
      [0, 0], // upper right
    ];

    for (const point of rotatePoints) {
      if (point[0] < rotBoundBox[0][0]) {
        rotBoundBox[0][0] = point[0];
      }
      if (point[0] > rotBoundBox[1][0]) {
        rotBoundBox[1][0] = point[0];
      }
      if (point[1] < rotBoundBox[0][1]) {
        rotBoundBox[0][1] = point[1];
      }
      if (point[1] > rotBoundBox[1][1]) {
        rotBoundBox[1][1] = point[1];
      }
    }
  }

  $: rotBoundConnections = [
    [rotBoundBox[0], [rotBoundBox[1][0], rotBoundBox[0][1]]],
    [rotBoundBox[0], [rotBoundBox[0][0], rotBoundBox[1][1]]],
    [rotBoundBox[1], [rotBoundBox[0][0], rotBoundBox[1][1]]],
    [rotBoundBox[1], [rotBoundBox[1][0], rotBoundBox[0][1]]],
  ];

  function rotateTransform(points: number[][], theta: number) {
    let rotatedPoints = [];
    for (const point of points) {
      let x = point[0] * Math.cos(theta) - point[1] * Math.sin(theta);
      let y = point[0] * Math.sin(theta) + point[1] * Math.cos(theta);
      rotatedPoints.push([x, y]);
    }
    return rotatedPoints;
  }
</script>

{#each boundConnections as connection}
  <Path path={connection} color="grey" />
{/each}
{#each connections as path}
  <Path {path} color="black" />
{/each}
{#each points as point}
  <Point {point} />
{/each}


{#each rotBoundConnections as connection}
  <Path path={connection} color="grey" />
{/each}

{#each rotateConnections as newPath}
  <Path path={newPath} color="orange" />
{/each}

{#each rotatePoints as point}
  <Point fill="blue" {point} />
{/each}

<script>
  import {height} from "./stores"
  export let point;
  export let fill = "red"
</script>

<circle cx={point[0]} cy={$height - point[1]} r="2" {fill} />

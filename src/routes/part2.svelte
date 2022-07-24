<svelte:head>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
	/>
</svelte:head>

<script lang="ts">
	import { onMount } from 'svelte';

	onMount(() => {
		let script = document.createElement('script');
		script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js';
		document.head.append(script);

		script.onload = () => {
			let MathJax = {
				tex: {
					inlineMath: [
						['$', '$'],
						['\\(', '\\)']
          ]
				},
				svg: { fontCache: 'global' }
			};
		};
	});
</script>


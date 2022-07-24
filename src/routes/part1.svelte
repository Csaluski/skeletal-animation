<svelte:head>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
	/>
</svelte:head>

<script lang="ts">
	import { onMount } from 'svelte';

	import World0 from '$lib/View0/World0.svelte';
	import World1 from '$lib/View1/World1.svelte';
	import World2 from '$lib/View2/World2.svelte';
	import World3 from '$lib/View3/World3.svelte';
	import World4 from '$lib/View4/World4.svelte';
	import TriangleRotate from '$lib/TriangleRotate.svelte';

	let rotEq = `$$ rot(x,y,\\theta) = (x \\cos( \\theta) - y \\sin (\\theta), x \\sin (\\theta) + y \\cos (\\theta)) $$`;

	let rot90Eqs = `
			$$ rot(x,y,0) = (x\\cos(0)-y\\sin(0), x\\sin(0)+y\\cos(0)) $$ 
			$$ = (x(1) - y(0), x(0) + y(1)) = (x,y)$$ 
			$$ rot(x,y,90) = (x\\cos(90) - y\\sin(90), x\\sin(90) + y\\cos(90)) $$
			$$ = (x(0) - y(-1), x(1) + y(0)) = (-y,x)$$ 
			
			$$ rot(x,y,180) = (x\\cos(180) - y\\sin(180), x\\sin(180) + y\\cos(180)) $$
			$$ = (x(-1) - y(0), x(0) + y(-1)) = (-x,-y)$$ 
			$$ rot(x,y,270) = (x\\cos(270) - y\\sin(270), x\\sin(270) + y\\cos(270)) $$
			$$ = (x(0)  - y(1), x(-1) + y(0)) = (y,-x)$$ 
`;

	let rot45Eq = `
			$$ rot(x,y,45) = (x\\cos(45)-y\\sin(45), x\\sin(45)+y\\cos(45)) $$ 
			$$ = (x(\\frac{\\sqrt{2}}{2}) - y(\\frac{\\sqrt{2}}{2}), x(\\frac{\\sqrt{2}}{2}) + y(\\frac{\\sqrt{2}}{2}))$$ `;

	let simplifyRot45Eq = `
	$$(x(\\frac{\\sqrt{2}}{2}) - y(\\frac{\\sqrt{2}}{2}))^2 + (x(\\frac{\\sqrt{2}}{2}) + y(\\frac{\\sqrt{2}}{2}))^2$$
	$$ = (\\frac{\\sqrt{2}}{2}(x-y))^2 + (\\frac{\\sqrt{2}}{2}(x+y))^2 $$ 
	$$ = \\frac{(x - y)^2}{2} +  \\frac{(x + y)^2}{2}$$
	$$ = \\frac{x^2-2xy+y^2}{2} +  \\frac{x^2+2xy+y^2}{2}$$
	$$ = \\frac{x^2-2xy+y^2+x^2+2xy+y^2}{2}$$
	$$ = \\frac{2x^2+2y^2}{2}$$
	$$ = x^2+y^2$$
	`;

	let rEq = `$$ \\sqrt{x^2+y^2} = \\sqrt{r^2} = r $$`;

	let polarAngle = `
	$$ \\theta = \\arctan(\\frac{y}{x}) = \\arctan(\\frac{\\sin(\\theta)}{cos(\\theta)}) \\implies \\tan(\\theta) = \\frac{y}{x} = \\frac{\\sin(\\theta)}{\\cos(\\theta)} $$ 
	$$ (x, y) = (\\cos(\\theta), \\sin(\\theta)) $$
	`;
	let rotationCompletion =
		`
	$$ \\theta' = \\theta+\\beta \\implies (\\cos(\\theta'), \\sin(\\theta')) =
	(\\cos(\\theta + \\beta), \\sin(\\theta + \\beta)) $$
	$$ = (\\cos(\\theta)\\cos(\\beta)-\\sin(\\theta)\\sin(\\beta), \\sin(\\theta)\\cos(\\beta)+\\sin(\\theta)\\sin(\\beta)) $$
	$$ = (x\\cos(\\beta)-y\\sin(\\beta), y\\cos(\\beta)+x\\sin(\\beta)) $$
	` + rotEq;

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


<main class="container-md">
	<div class="row justify-content-center">
		<div class="rounded bg-light col-8">
			<p class="h1">Let's build a keyframed skeletal animation system</p>
			<p class="lead">Some setup</p>
			<p>
				I'm choosing to write this blog using
				<a href="http://https://svelte.dev/">Svelte</a>
				, an interesting language based on Javascript that heavily relies on reactive programming. I'm
				hopeful that this reactive approach will let me put less focus on writing event handlers and
				more on writing code. I'm also using
				<a href="https://mljs.github.io/matrix/">ml-matrix</a>
				for matrix representation and operations. We are using this library instead of
				<a href="https://glmatrix.net/">glMatrix</a>
				because it is intentionally lower level, and will require that we build some of its
				abstractions ourselves. We also use
				<a href="https://www.mathjax.org/">MathJax</a>
				for inline equation rendering. The code for this blog is available on
				<a href="https://github.com/csaluski/skeletal-animation">Github</a>.
			</p>

			<p>
				If you're already familiar with linear algebra you'll notice that I'm not using a matrix
				approach for these transformations in this post, and you'll also more than likely know them
				as affine transformations. In the next parts of this we'll change these into matrix
				operations, but for now I think it's most clear to think of them in terms of functions
				instead.
			</p>

			<p>
				We'll start with making a figure to draw to the screen, then we'll apply some basic
				transformations to it and see where that leaves us. We'll define this figure as a set of
				points and a set of lines that connect any two of those points together. These points will
				be defined as arrays with two elements, with the first element being the x coordinate, and
				the second the y. This will make the programming fairly straightforward, and makes the
				application of transformation matrices we'll look at later more intuitive as well. We'll
				render to SVG, since it's entirely text and DOM based and is easy to inspect in the browser
				to see what's going on. However, we don't use any of SVG's built in transformation
				functions, because we want to implement those ourselves by transforming points and drawing
				the updated lines from those. We'll also draw a bounding box, this will help visualize some
				of our transformations, especially as we move to a hierarchy of transformations.
			</p>
			<World0 viewHeight="60" viewWidth="40" />
			<p>
				Great, we have our figure standing on the origin. This position at the origin is not
				significant at this point, but in future steps we'll see that it's important to define each
				element in terms of its offset from its local origin. Now let's start with the easiest
				transformations, translating along the x and y plane. Because our figure is already defined
				in terms of (x, y) points, all we have to do is add the components to each of the entries
				our point array. We'll render the transformed figure with blue points, so that we can
				clearly see what's happened to it.
			</p>
			<World1 viewHeight="100" viewWidth="80" />
			<p>
				Now we have to deal with the more complicated transformations. We'll start with rotation,
				because it will be one of the most important for implementing animation later on. We'll
				rotate around the origin, and not worry about rotating around a given point, because this
				will be solved for free once we start working with chains of transformations. The easiest
				way to think about rotation is in terms of polar coordinates, where we think of each point
				as a radius and theta value. Unfortunately we're working with planar coordinates, and the
				tools we're going to need to use to solve this problem come from trigonometry. Indeed, the
				formula isn't bad, but it's not immediately obvious why it works.
				{rotEq}
				Let's implement it in this next slide to make sure it works, then see if we can derive it and
				create a more intuitive understanding of how it works after that.
			</p>
			<TriangleRotate viewHeight="100" viewWidth="100" />
			<p class="lead">An aside into trigonometry</p>
			<p>
				Looking good! So, let's get into how this actually works. First let's consider the trivial
				cases of rotation, which are rotating in 90 degree increments. Let's look at each of these
				cases.
				{rot90Eqs}
				We see that we get outputs that have the same x and y components, but moved around a bit. That
				makes sense, since sines and cosines of 90 degree angles are always 1 or 0. Let's look at a 45
				degree angle and see what that looks like.
				{rot45Eq}
				That's not a nice simple equation, but we do see something key in this representation. The sum
				of the components of each coordinate don't sum to x and y, but if we square each component, and
				add them together, we'll have the sum of their squares.
				{simplifyRot45Eq}
				This is true of any rotation, and is a key point of the rotation. What we've actually done here
				is begin to derive polar coordinates, where a point's location is defined by its radius from
				the center and its angle from zero. The radius of a point is a direct application of the Pythagorean
				theorem, where we replace a, b, and c, with x, y, and r, giving us what we just saw.
				{rEq}
				The other portion of polar coordinates, the angle, is obtained from finding the angle of the
				point from the origin. The arctan function takes a tangent value and returns an angle from it,
				which is what we'll use. The tangent of a point can be defined as y over x, but it can also be
				defined as the sine of &theta over the cosine of &theta. That sounds a bit like the rotation
				equation, so let's see if we can do some manipulation to get us there.
				{polarAngle}
				So now we have x and y's relationships with sine and cosine, the radius, and the &theta. We know
				we want the radius to stay the same and that we just want to change the angle, so we're going
				to have our given &theta and add some extra angle, which we'll call &beta. Now we can apply the
				sum of angles formulae and use a few substitutions to get the equation we're expecting.
				{rotationCompletion}
				That was a long aside to prove that this transformation works and to get a sense for how it works,
				but now we can be fairly certain that it works. Let's finish up by implementing the rotation
				for our figure. Note that the bounding box changes its dimensions and area fairly considably
				during the transformation.
			</p>
			<World2 viewHeight="50" viewWidth="50" />
			<p>
				Now we can move on to scaling, which will be very simple by comparison.Scaling takes the
				point's x and y components and a scale factor for both x and y, and multiplies each
				component by the matching scale factor. $$ scale(x, y, xScale, yScale) = (x * xScale, y *
				yScale) $$ Since we see that this one is really simple we're not going to beat around the
				bush doing any sort of derivation, and instead just skip to implementing it in this next
				slide.
				<World3 viewHeight="100" viewWidth="100" />
				This also gives us reflection around the x and y axes for free.
			</p>

			<p>
				There's one last transformation that will be included for completeness, but isn't often used
				in animation, that being shear. Shearing is similar to scaling, except instead of the point
				being moved along the axis based on its position along the selected axis, it is translated
				based on the magnitude of its position away from the selected axis. In 2D we can express
				this as $$ shear(x, y, xShear, yShear) = (x + (y*xShear), y +(x*yShear)) $$ Simple enough,
				and simple to implement.
				<World4 viewHeight="100" viewWidth="100" />
			</p>

			<p>
				These are all the transformations that we'll need, and in fact all of these type of
				transformation that exist, to implement skeletal keyframe animation. As alluded to at the
				beginning of this post, we'll accomplish this by chaining these transformations together in
				a sequence of heirarchical transforms.
			</p>
		</div>
	</div>
</main>

<style>
</style>

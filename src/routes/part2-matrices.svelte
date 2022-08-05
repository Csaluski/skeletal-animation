<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import Transforms from '$lib/Transformation_Orders/Transforms.svelte'

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

	let trs_transform = `
	$$ (x_t, y_t) = trans(x, y, t_x, t_y) = (x + t_x, y + t_y) $$
	$$ (x_{tr}, y_{tr}) = rot(x_t, y_t, \\theta) = (x_t \\cos( \\theta) - y_t \\sin (\\theta), x_t \\sin (\\theta) + y_t \\cos (\\theta)) $$
	$$ (x_{trs}, y_{trs}) = scale(x_{tr}, y_{tr}, s_x, s_y)  = (x_{tr} s_x, y_{tr} s_y) $$
	$$ \\implies (((x + t_x) \\cos( \\theta) - (y + t_y) \\sin (\\theta)) s_x, ((x + t_x) \\sin (\\theta) + (y + t_y) \\cos (\\theta)) s_y)  $$
	`;

	let matrixish_eqn = `
	$$(((x + t_x) \\cos( \\theta) - (y + t_y) \\sin (\\theta)) s_x, ((x + t_x) \\sin (\\theta) + (y + t_y) \\cos (\\theta)) s_y)$$

	$$\\implies $$
	$$ ((x + t_x) \\cos( \\theta) - (y + t_y) \\sin (\\theta)) s_x $$
	$$((x + t_x) \\sin (\\theta) + (y + t_y) \\cos (\\theta)) s_y $$

	$$ \\implies $$
	$$ x\\cos( \\theta)s_x + t_x\\cos( \\theta)s_x - y\\sin (\\theta) s_x  - t_y\\sin (\\theta) s_x $$
	$$ x\\sin (\\theta)s_y + t_x \\sin (\\theta)s_y + y  \\cos (\\theta) s_y + t_y \\cos (\\theta) s_y $$

	$$ \\implies $$
	$$ x\\cos( \\theta)s_x - y\\sin (\\theta) s_x + (t_x\\cos( \\theta)  - t_y\\sin (\\theta)) s_x $$
	$$ x\\sin (\\theta)s_y  + y  \\cos (\\theta) s_y + (t_x \\sin (\\theta) + t_y \\cos (\\theta)) s_y  $$
	$$ \\implies $$
	$$ x * x_x + y * x_y + 1 * x_c $$
	$$ x * y_x + y * y_y + 1 * y_c $$
	`;

	let dot_eqn = `
	$$ ([x, y, 1] \\cdot [x_x, x_y, x_c], [x, y, 1] \\cdot [y_x, y_y, y_c])$$
	`;

	let matrix_transform = `
	$$ 
	\\begin{bmatrix} 
		x_1 & y_1 & 1 \\\\
		x_2 & y_2 & 1 \\\\
		x_3 & y_3 & 1 \\\\
		x_4 & y_4 & 1 \\\\
		& ... &  
	\\end{bmatrix}
	\\begin{bmatrix} 
		x_x & y_x \\\\ 
		x_y & y_y \\\\ 
		x_c & y_c 
	\\end{bmatrix} 
	= 
	\\begin{bmatrix} 
	x_1x_x + y_1x_y + x_c & x_1y_x + y_1y_y + y_c \\\\
	x_2x_x + y_2x_y + x_c & x_2y_x + y_2y_y + y_c \\\\
	x_3x_x + y_3x_y + x_c & x_3y_x + y_3y_y + y_c \\\\
	x_4x_x + y_4x_y + x_c & x_4y_x + y_4y_y + y_c \\\\
	\\end{bmatrix} $$
	`;

	let homogeneous_matrix = `
	$$ 
	\\begin{bmatrix} 
		x_1 & y_1 & 1 \\\\
		x_2 & y_2 & 1 \\\\
		x_3 & y_3 & 1 \\\\
		x_4 & y_4 & 1 \\\\
		& ... &  
	\\end{bmatrix}
	\\begin{bmatrix} 
		x_x & y_x & 0\\\\ 
		x_y & y_y & 0\\\\ 
		x_c & y_c & 1
	\\end{bmatrix} 
	= 
	\\begin{bmatrix} 
	x_1x_x + y_1x_y + x_c & x_1y_x + y_1y_y + y_c & 0x_1 + 0y_1 + 1\\\\
	x_2x_x + y_2x_y + x_c & x_2y_x + y_2y_y + y_c & 0x_2 + 0y_2 + 1\\\\
	x_3x_x + y_3x_y + x_c & x_3y_x + y_3y_y + y_c & 0x_3 + 0y_3 + 1\\\\
	x_4x_x + y_4x_y + x_c & x_4y_x + y_4y_y + y_c & 0x_4 + 0y_4 + 1\\\\
	\\end{bmatrix} $$
	$$
	= 
	\\begin{bmatrix} 
	x_1x_x + y_1x_y + x_c & x_1y_x + y_1y_y + y_c & 1\\\\
	x_2x_x + y_2x_y + x_c & x_2y_x + y_2y_y + y_c & 1\\\\
	x_3x_x + y_3x_y + x_c & x_3y_x + y_3y_y + y_c & 1\\\\
	x_4x_x + y_4x_y + x_c & x_4y_x + y_4y_y + y_c & 1\\\\
	\\end{bmatrix} $$
	`;

	let basic_matrices = `
	$$ 
	rot(x,y,\\theta) = (x \\cos( \\theta) - y \\sin (\\theta), x \\sin (\\theta) + y \\cos (\\theta))  
	\\implies
	\\begin{bmatrix} 
	cos(\\theta) & \\sin(\\theta) & 0 \\\\
	-sin(\\theta) & \\cos(\\theta) & 0 \\\\
	0 & 0 & 1
	\\end{bmatrix}
	$$
	$$
	scale(x, y, s_x, s_y)  = (x s_x, y s_y)
	\\implies
	\\begin{bmatrix} 
	s_x & 0 & 0 \\\\
	0 & s_y & 0 \\\\
	0 & 0 & 1
	\\end{bmatrix}
	$$
	$$ 
	trans(x, y, t_x, t_y) = (x + t_x, y + t_y)
	\\implies
	\\begin{bmatrix} 
	1 & 0 & 0 \\\\
	0 & 1 & 0 \\\\
	t_x & t_y & 1
	\\end{bmatrix}
	$$
	`;

	let transforms_multiplied = `
	$$
	\\begin{bmatrix} 
	1 & 0 & 0 \\\\
	0 & 1 & 0 \\\\
	t_x & t_y & 1
	\\end{bmatrix}

	\\begin{bmatrix} 
	cos(\\theta) & \\sin(\\theta) & 0 \\\\
	-sin(\\theta) & \\cos(\\theta) & 0 \\\\
	0 & 0 & 1
	\\end{bmatrix}

	\\begin{bmatrix} 
	s_x & 0 & 0 \\\\
	0 & s_y & 0 \\\\
	0 & 0 & 1
	\\end{bmatrix}

	$$
	$$
	=

	\\begin{bmatrix} 
	\\cos(\\theta) & \\sin(\\theta) & 0 \\\\
	-\\sin(\\theta) & \\cos(\\theta) & 0 \\\\
	\\cos(\\theta)t_x-\\sin(\\theta)t_y & \\sin(\\theta)t_x+\\cos(\\theta)t_y & 1\\\\
	\\end{bmatrix}

	\\begin{bmatrix} 
	s_x & 0 & 0 \\\\
	0 & s_y & 0 \\\\
	0 & 0 & 1
	\\end{bmatrix}
	$$
	$$
	= 

	\\begin{bmatrix} 
	s_x\\cos(\\theta) & s_y\\sin(\\theta) & 0 \\\\
	-s_x\\sin(\\theta) & s_y\\cos(\\theta) & 0 \\\\
	s_x(\\cos(\\theta)t_x-\\sin(\\theta)t_y) & s_y(\\sin(\\theta)t_x+\\cos(\\theta)t_y) & 1\\\\
	\\end{bmatrix}

	$$
	`;
</script>

<main class="container-md">
	<div class="row justify-content-center">
		<div class="rounded bg-light col-8 p-4">
			<p>
				In the last post we derived our building blocks for transforming our figure, but we only
				tried using one at a time. To build animations we'll have to use many of them together,
				apply them to different parts of the figure, and use time as an input variable to progress
				through the animation.
			</p>

			<p>
				The first part of this that we'll choose to deal with is composing transformations together,
				as there's some nuance to this that's important to realize. Let's consider our 3 most
				fundamental transforms, rotation, translation, and scaling. When you're laying out a scene
				for animation you'll want to position the figures of the animation into reasonable starting
				positions. You might first make the figure approximately the same size, then move it into
				position, then rotate and scale it precisely from there. Or you might move it first, then
				rotate and scale it from there. What's important is that no matter what order you do these
				in, the end transformation is the same and that the result of modifying any of the
				transformations is not unexpected. There 6 different orders we can put them in, and they're
				all completely valid transformations, but some of them are more or less predictable. Writing
				all 6 out in full in function form would be exhausting, and creating a demo for each one
				would be awkward. Instead, let's look at an arbitrary one, let's say translate, then rotate,
				then scale, and see if we can work toward understanding how they compose together.
			</p>
			<p>
				According to our previous post, that would give us this result.
				{trs_transform}
				Not a terribly complicated result, but not one I think is great to work with. If we had thousands
				of points or a deep series of these transformations, this looks like it could get pretty slow.
				If we look at the component functions of this expression, we can see that the original x and
				y terms will only ever be directly used by translation while the other functions only use them
				as factors. This is true no matter how we order the transformations; we will always end up with
				some value plus a factor of x and a factor of y for each coordinate. This allows us to greatly
				simplify the calculations, as instead of having to repeat these calculations for every point
				we can compute the value and factors and then apply each point to this simple remaining equation.
			</p>
			<p>
				This approach of treating these transformations as ordinary functions clearly works from a
				mathematical standpoint. However; keeping all of these partially evaluated functions around,
				referencing their parent transforms, seems like it could get weird. Since these resulting
				equations will always have the same structure we could use arrays to hold the different
				components, or I could imagine using closures or an object oriented approach, but all of
				these are a little bit removed from the math.
			</p>
			<p>
				Instead, let's try going back to the math, and seeing if we can derive another approach.
				We'll play with the distribution of terms in the equation to get it into a sum of products
				expression, and put the x and y components on different lines, and then regroup the terms
				that don't depend on x or y, and give the terms that aren't factors a new name.
				{matrixish_eqn}
				If you have previous experience with linear algebra this should look very familiar and you're
				welcome to skim the next several sections, but if you haven't then these expressions probably
				seem arbitrary. If we examine their structure, we see that each has an x component multiplied
				by a factor, a y component multiplied by a factor, and a constant component. If we look at all
				of the previous individual transformations we'll see that they also conform to this structure,
				although some of the factors and components were 0. In math as in programming, when we see a
				repeated structure like this, we should want to codify it into an explicit abstraction that we
				can reuse. In this case our abstraction seems to be an operator that would take two ordered sets
				of numbers, multiply every pair and then return the sum of all of these products. Of course this
				is an operator that is already defined, namely the vector dot product. It does exactly what I
				just described, taking two vectors of the same length and returning the sum of products of matched
				components. It's also clearly trivial and fast to implement in code, either as a loop for the
				general form, or as a specific form for our 2D operations. Using this operation, we would write
				a point's transformation like this.
				{dot_eqn}
				Of course, when laid out like this we should immediately say to ourselves, more repetition, and
				another chance for abstraction. This time we want an operation that will take our 3 element position
				vector (or multiple of them) and our two transformation vectors, and dot each position vector
				on to each transformation vector. This is another already existing operator, matrix multiplication.
				Formally, matrix multiplication's definition requires that the inner components of the two matrices
				being multiplied have the same dimensions, which is to say that the left matrix's width be equal
				to the right matrix's height. This gives a resulting matrix the size of the outer dimensions,
				the left matrix's height and the right matrix's width. Since we want an output matrix that changes
				n vectors of three elements each into another n vectors, and I want transformations to go from
				left to right (this is arbitrary, right to left is more common in 3D graphics libraries but here
				we can choose), we will have matrices of this form.
				{matrix_transform}
				As we can see, we can feed any number of point vectors into this transformation matrix and end
				up with an output matrix of point vectors. However; as we see this currently presented, we lose
				the 1 through this multiplication. I've mentioned that we're going to be doing series of these
				transformations in the future, so each matrix along the line would require compatible matrix
				dimensions. To achieve this, we'll need identical matrix dimensions all along the way, and we
				clearly can't achieve that with a 2 column transformation matrix. So what we want is a 3rd column
				that just keeps the 1 around, which sounds almost too simple. That would look like this.
				{homogeneous_matrix}
				It works, but a good question to have at this point would be why does it seem like we're stuck
				with it? Another good question that goes along with that question is that if we can represent
				a composition of transformations as a matrix after composing them, what would happen if we changed
				our basic transformation equations into matrices, then multiplied them together? First we'll
				create the 3 by 3 matrix versions of the equations.
				{basic_matrices}
				There we go, we see that the third row is only present with non-identity terms in the translation.
				This makes some sense, since it's the only translation that doesn't affect a point based on where
				it already is, and is instead completely independent of it. This has some interesting properties
				from a linear algebraic perspective, but for our purposes we just need to know that it works.
				Now we'll see if multiplying translation, rotation, and scaling together gives us the same result
				that we have earlier in the post.
				{transforms_multiplied}
				This is the equivalent matrix form of the function we ended up with earlier, this time derived
				through matrix multiplication. This works because our transformation functions only ever use
				the original x and y positions as factors to the first power, which is the requirement for linear
				algebra. This has been a long aside, but I believe that it's been worth it because its shown
				us how we can think about these transformations, and given us a much more computationally efficient
				way to think about them. Instead of having to calculate a complicated chain of functions for
				every point, every frame, we can calculate a few matrix multiplications and then apply a point
				matrix to that resulting matrix instead. It also gives us a very obvious way to continue composing
				these transformations together, which is what we'll finally get into next.
			</p>
			<p>
				Since we now have this very easy to use method for composing transformations together, let's go back to what we started this post with, figuring out which order of translation, rotation, and scaling gives us the best result. Let's just lay out every order, that way we can see how they behave.
				<Transforms viewHeight={100} viewWidth={100}/>
				I highly encourage you to check out the code for this figure, 
			</p>
		</div>
	</div>
</main>

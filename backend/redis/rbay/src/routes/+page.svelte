<script lang="ts">
	import type { PageData } from './$types';
	import Card from '$lib/components/card.svelte';
	import Carousel from '$lib/components/carousel.svelte';

	export let data: PageData;
</script>

<h1 class="text-3xl">Most Expensive</h1>
<Carousel>
	{#each data.highestPrice as item}
		<div class="flex-1">
			<Card {item} />
		</div>
	{/each}
</Carousel>

<hr class="my-8" />

<h1 class="text-3xl">Ending Soonest</h1>
<Carousel>
	{#each data.endingSoonest as item}
		<div class="flex-1">
			<Card {item} />
		</div>
	{/each}
</Carousel>

<hr class="my-8" />

<h1 class="text-3xl">Most Views</h1>
<Carousel>
	{#each data.mostViews as item}
		<div class="flex-1">
			<Card {item} showViews />
		</div>
	{/each}
</Carousel>

<script lang="ts">
	import Card from '$lib/components/card.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h1 class="text-3xl">{data.username}'s profile</h1>
<hr class="my-4" />

<h3 class="text-xl">Items you <span class="font-bold">both</span> like</h3>
<div class="flex flex-wrap gap-4 justify-start">
	{#each data.sharedItems as item}
		<Card {item} />
	{/each}
</div>

<hr class="my-12" />

<h3 class="text-xl">Items {data.username} likes</h3>
<div class="flex flex-wrap gap-4 justify-start">
	{#each data.likedItems as item}
		<Card {item} />
	{/each}
</div>

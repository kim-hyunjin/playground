<script>
	import { post } from '$lib/fetch';
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/components/button.svelte';
	import Search from '$lib/components/search.svelte';

	async function onClick() {
		await post('/auth/signout');
		await invalidateAll();
		goto('/');
	}
</script>

<div class="w-full p-2 bg-white shadow-xs bg-amber-500 mb-8">
	<div class="container mx-auto flex flex-row items-center justify-between">
		<a href="/">
			<div class="ml-8 text-lg text-white flex">RBay</div>
		</a>
		<Search />
		<div class="flex items-center mr-8 hidden md:flex gap-4">
			{#if $page.data.session && $page.data.session.userId}
				<p>{$page.data.session.username}</p>
				<a href="/dashboard/items/new"><Button>New</Button></a>
				<a href="/dashboard/items"><Button>Dashboard</Button></a>
				<Button role="secondary" on:click={onClick}>Logout</Button>
			{:else}
				<a href="/auth/signin"><Button>Sign In</Button></a>
				<a href="/auth/signup"><Button>Sign Up</Button></a>
			{/if}
		</div>
	</div>
</div>

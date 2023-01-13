<script lang="ts">
	import { useField } from '$lib';

	export let name: string;
	export let type: string = 'text';
	export let disabled: boolean = false;
	export let initialValue: any = '';

	const { error, isSubmitting, value } = useField(name, initialValue);
</script>

<input
	disabled={$isSubmitting || disabled}
	{type}
	value={$value}
	{name}
	id={name}
/>
{#if $error}
	<p class="error">{$error}</p>
{/if}

<style>
	input {
		display: block;
		border: 1px solid #ccc;
		border-radius: 4px;
		padding: 0.3rem 0.5rem;
	}

	.error {
		color: red;
		margin-top: 4px;
	}
</style>

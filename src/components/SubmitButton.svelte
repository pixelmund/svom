<script lang="ts">
	import { useForm } from '$lib';

	const { isSubmitting } = useForm();
</script>

<button disabled={$isSubmitting} type="submit"> Submit </button>

<style>
	button {
		display: block;
		border: 1px solid #ccc;
		border-radius: 4px;
		padding: 0.3rem 0.5rem;
	}

	button:disabled {
		opacity: 0.5;
	}
</style>

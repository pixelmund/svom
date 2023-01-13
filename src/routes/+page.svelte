<script lang="ts">
	import { createForm } from '$lib';
	import SubmitButton from '../components/SubmitButton.svelte';
	import Input from '../components/Input.svelte';
	import { SignInSchema } from './validation';

	const { enhance } = createForm({
		schema: SignInSchema,
		onSubmit: async (data, other) => {
			console.log({ data, other });
		}
	});
</script>

<form action="?/signIn" method="post" use:enhance>
    <Input name="email" type="email" />
    <Input name="password" type="password" />
	<SubmitButton />
</form>

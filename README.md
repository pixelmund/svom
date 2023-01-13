# svom

SvelteKit form validations for the server and client, using zod and zod-form-data

## Getting Started

Install the package:

```bash

npm install svom

```

## Usage

### Server

```ts
// src/routes/register/+page.server.ts
import { z } from 'zod';
import { validate, zfd } from 'svom';
import type { Actions } from './$types';
import db from '$db';

const SignUpSchema = zfd.formData({
	name: zfd.text(z.string().min(1)),
	age: zfd.numeric(z.number().min(18)),
	email: zfd.text(z.string().email()),
	password: zfd.text(z.string().min(8))
});

export const actions = {
	signUp: validate(SignUpSchema, async ({ data, fail }) => {
		const { name, age, email, password } = data;

		if (db.user.exists(email)) {
			return fail({ email: 'Email already exists' });
		}

		// ... do something with the data
	})
} satisfies Actions;
```

### Client

```svelte
<!-- src/routes/register/+page.svelte -->
<script lang="ts">
	import { createForm } from 'svom';
	import SubmitButton from '$lib/SubmitButton.svelte';
	import Input from '$lib/Input.svelte';
	// We're using a shared file for the schema, but you can also define it in this file for custom client validation
	import { SignUpSchema } from './validation';

	const { enhance } = createForm({
		schema: SignUpSchema,
		onSubmit: async (data, { form, action, result }) => {
			console.log({ data, other });
		}
	});
</script>

<form action="?/signUp" method="post" use:enhance>
	<Input name="email" type="email" />
	<Input name="password" type="password" />
	<SubmitButton />
</form>
```

```svelte
<!-- src/lib/Input.svelte -->
<script lang="ts">
	import { useField } from 'svom';

	export let name: string;
	export let type: string = 'text';
	export let disabled: boolean = false;
	export let initialValue: any = '';

	const { error, isSubmitting, value } = useField(name, initialValue);
</script>

<input disabled={$isSubmitting || disabled} {type} value={$value} {name} id={name} />
{#if $error}
	<p class="error">{$error}</p>
{/if}
```

```svelte
<!-- src/lib/SubmitButton.svelte -->
<script lang="ts">
	import { useForm } from '$lib';
	const { isSubmitting } = useForm();
</script>

<button disabled={$isSubmitting} type="submit">Submit</button>

<style>
	button:disabled {
		opacity: 0.5;
	}
</style>
```

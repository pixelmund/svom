import { applyAction, enhance, type MaybePromise } from '$app/forms';
import { page } from '$app/stores';
import type { ActionResult } from '@sveltejs/kit';
import { getContext, setContext } from 'svelte';
import { derived, writable, type Writable } from 'svelte/store';
import type { z, ZodSchema } from 'zod';
import { validateFormdata } from './validate.js';

interface CreateFormInput<Schema extends ZodSchema> {
	onSubmit?: (
		data: z.infer<Schema>,
		other: { form: HTMLFormElement; action: URL; result: ActionResult }
	) => MaybePromise<any>;
	schema: Schema;
	reset?: boolean;
}

export function useForm(): FormState {
	const formState = getContext('__FORM_STATE__') as FormState;

	if (!formState) {
		console.log('No form state found. Did you forget to call createForm()?');
	}

	return formState;
}

export function useField(name: string, defaultValue?: string | number | Date) {
	const formState = useForm();

	const value = derived([formState.values, page], ([values, page]) => {
		if (page.form?.values[name]) return page.form.values[name];
		return values[name] || defaultValue || '';
	});

	const error = derived([formState.errors, page], ([errors, page]) => {
		if (page.form?.errors[name]) return page.form.errors[name];
		return errors[name] || null;
	});

	return {
		value,
		error,
		isSubmitting: formState.isSubmitting
	};
}

interface FormState {
	isSubmitting: Writable<boolean>;
	errors: Writable<Record<string, string | null>>;
	values: Writable<Record<string, string>>;
	schema: ZodSchema;
}

export function createForm<Schema extends ZodSchema>({
	onSubmit,
	schema,
	reset = true
}: CreateFormInput<Schema>) {
	const formState = {
		isSubmitting: writable(false),
		errors: writable({}),
		values: writable({}),
		schema
	} satisfies FormState;

	setContext('__FORM_STATE__', formState);

	return {
		...formState,
		enhance: (form: HTMLFormElement) =>
			enhance(form, ({ data: formData, cancel }) => {
				formState.isSubmitting.set(true);
				formState.errors.set({});

				const { data, errors } = validateFormdata(schema, formData);

				if (errors) {
					formState.errors.set(errors);
					formState.isSubmitting.set(false);
					cancel();
					return;
				}

				return async ({ action, form, result, update }) => {
					if (onSubmit) {
						await onSubmit(data, { form, action, result });
						await applyAction(result);
						await update({ reset });
					} else {
						await applyAction(result);
						await update({ reset });
					}
					formState.isSubmitting.set(false);
				};
			})
	};
}

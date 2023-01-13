import type { z } from 'zod';
import { type ZodSchema, ZodError } from 'zod';
import { fail, type RequestEvent, type Action } from '@sveltejs/kit';

export function validateFormdata<Z extends ZodSchema>(schema: Z, formData: FormData) {
	let data = {};

	try {
		data = schema.parse(formData);

		return {
			data,
			values: Object.fromEntries(formData),
			errors: null
		};
	} catch (err) {
		if (!(err instanceof ZodError)) throw err;
		return {
			data,
			values: Object.fromEntries(formData),
			errors: Object.fromEntries(
				Object.entries(err.formErrors.fieldErrors).map(([key, value]) => [
					key,
					value ? value[0] : null
				])
			)
		};
	}
}

export function validate<Z extends ZodSchema<any, any>>(
	schema: Z,
	action: (
		event: RequestEvent & {
			data: z.infer<Z>;
			fail: (errors: Partial<Record<keyof z.infer<Z>, string | null | undefined>>) => any;
		}
	) => ReturnType<Action>
) {
	return async (event: RequestEvent) => {
		const formData = await event.request.formData();

		const { data, errors, values } = validateFormdata(schema, formData);

		if (errors) return fail(400, { values, errors });

		const result = await action({
			...event,
			data,
			fail: (errors) => fail(400, { values: Object.fromEntries(formData), errors })
		});

		if (result) return result;
	};
}

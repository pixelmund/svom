import { validate } from '$lib';
import type { Actions, PageServerLoad } from './$types';
import { SignInSchema } from './validation';

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

export const actions = {
	signIn: validate(SignInSchema, async (event) => {
		await new Promise((resolve) => setTimeout(resolve, 1000));
	})
} satisfies Actions;

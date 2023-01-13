import { zfd } from "$lib";
import { z } from "zod";

export const SignInSchema = zfd.formData({
    email: zfd.text(z.string().email()),
    password: zfd.text(z.string().min(8))
});
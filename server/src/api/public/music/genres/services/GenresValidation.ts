import z from "zod";
import { PaginationScheme } from "../../shared/SharedValidations";


export type GenreDTO = z.infer<typeof GenreDTO>;
export type GenreRParams = z.infer<typeof GenreRParams>;

export const GenreDTO = z.object({
    id: z.number(),
    genre: z.string(),
})

export const GenreRParams = z.object({
    id: z.coerce.number(),
});
import z from "zod";

// MARK: types
export type BooleanScheme = z.infer<typeof BooleanScheme>;
export type PaginationScheme = z.infer<typeof PaginationScheme>;



// MARK: schemes

export const BooleanScheme = z.string().
    refine(val => (val === "true" || val === "false") ? true : false,
        { error: "The string must be 'true' or 'false'" }).
    transform(val => {
        if (val === "true")
            return true;
        if (val === "false")
            return false;
    });


export const PaginationScheme = z.object({
    limit: z.coerce.number(),
    offset: z.coerce.number()
})
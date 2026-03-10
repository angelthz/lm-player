import { Context, useContext } from "react";

export default function useNonNullableContext<T>(context: Context<T | null>) {
    const state = useContext(context);
    if (!state) {
        const name = context.displayName || "Context";
        throw new Error(`${name} is not provided`);
    }
    return state;
}
import z from "zod";

export abstract class Service<
    TModel,
    TResult extends Record<string, unknown>,
    TrParams,
    TqParams extends Record<string, unknown> | null,
    TbParams
> {
    protected model: TModel;
    constructor(model: TModel) {
        this.model = model;
    }

    abstract runService({ rParams, qParams, bParams }: {
        rParams?: TrParams, qParams?: TqParams, bParams?: TbParams
    }): Promise<TResult | TResult[]>;

    protected hasFilters(filters: TqParams): boolean {
        // console.log(Object.entries(filters!).filter(([k, v]) => k !== "limit" && k !== "offset").length > 0 ? true : false)
        return Object.entries(filters!).filter(([k, v]) => k !== "limit" && k !== "offset").length > 0 ? true : false;
    }

    protected getFilters(qParams: TqParams) {
        return Object.entries(qParams!).filter(([k, v]) => k !== "limit" && k !== "offset");
    }

    /**
     * 
     * @param row 
     * @param filters 
     * @returns 
     * @deprecated
     */
    protected filter(row: TResult, filters: TqParams): Partial<TResult> {
        const validFilters = Object.entries(filters!).filter(([k, v]) => v === true && (k !== "limit" && k !== "offset")).map(([k, v]) => k);
        const filtered = Object.entries(row).filter(([k, v]) => validFilters.includes(k))
        return Object.fromEntries(filtered) as Partial<TResult>;
    }

    protected applyFilters(row: TResult, params: TqParams): Partial<TResult> {
        const filters = Object.entries(params!).filter(([k, v]) => k !== "limit" && k !== "offset");


        if (filters.every(([k, v]) => v)) {
            const filtered = Object.entries(row).filter(([k, v]) => filters.find((v) => v[0] === k))
            return Object.fromEntries(filtered) as Partial<TResult>;
        }
        else if (filters.every(([k, v]) => !v)) {
            const filtered = Object.entries(row).filter(([rk, rv]) => filters.every(([fk, fv]) => rk !== fk))
            // const filtered = Object.entries(row).filter(([rk, rv]) => filters.every((fk, fv) => rk !== fk))
            return Object.fromEntries(filtered) as Partial<TResult>;
        }
        else {
            throw new FilterError("Every filter param should has the same value");
        }

    }
}


export abstract class PaginatedService<
    TModel,
    TResult extends Record<string, unknown>,
    TrParams,
    TqParams extends Record<string, unknown> | null,
    TbParams
> extends Service<TModel, TResult, TrParams, TqParams, TbParams> {
    constructor(model: TModel) {
        super(model);
    }



    protected getPaginationValues(pLimit?: number, pOffset?: number) {
        // let tempLimit = pLimit <= 100 ? pLimit : 25;
        // let tempOffset = pOffset > 0 ? pOffset : 1;
        let l = pLimit ? pLimit : 25;
        let o = pOffset ? pOffset : 1;

        let lim = l <= 100 ? l : 25;
        let off = o > 0 ? o : 1;

        // 5 * (0-1) = 5*(-1) = 0
        // 5 * (1-1) = 5*0 = 0
        // 5 * (2-1) = 5*1 = 5
        // 5 * (3-1) = 5*2 = 10



        return {
            limit: lim,
            offset: (lim * (off - 1)),
        };
    }
}


export class FilterError extends Error {
    constructor(msg: string) {
        super(msg);
    }
}

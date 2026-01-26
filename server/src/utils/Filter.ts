export class Filter<T extends Object, V extends Object> {
    public remove(row: T, queryFilters: V): Partial<T> {
        let filters = Object.keys(queryFilters);
        let filteredData = Object.entries(row).filter(([k, v]) => filters.includes(k));
        return Object.fromEntries(filteredData) as T;
    }
}

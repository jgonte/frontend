import { FetchCallbacks } from "./FetchCallbacks";
export interface ISelectUrlBuilder {
    selectProperty?: string;
}
export interface SelectUrlBuilderBuildConfig {
    url: string;
    select?: string[];
}
export interface FilterUrlBuilder {
    build(): string;
}
export type SortOrder = "asc" | "desc";
export interface SorterUrlBuilder {
    field: string;
    order: SortOrder;
}
export interface ICollectionUrlBuilder {
    filterProperty?: string;
    filterBuilder?: FilterUrlBuilder;
    orderByProperty?: string;
    topProperty?: string;
    skipProperty?: string;
}
export interface CollectionUrlBuilderConfig extends ICollectionUrlBuilder, ISelectUrlBuilder {
}
export interface CollectionUrlBuilderBuildConfig extends SelectUrlBuilderBuildConfig {
    top?: number;
    skip?: number;
    filter?: unknown;
    orderBy?: SorterUrlBuilder[];
    [otherParams: string]: unknown;
}
export interface CollectionLoaderConfig extends FetchCallbacks {
    urlBuilder?: CollectionUrlBuilderConfig;
}
export interface SingleLoaderConfig extends FetchCallbacks {
    urlBuilder?: ISelectUrlBuilder;
}

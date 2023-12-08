import { FetchCallbacks } from "./FetchCallbacks";


/**
 * Builds a query string with the fields to select
 */
export interface ISelectUrlBuilder {

    /**
     * The name of the property to use to build the string of fields to select
     */
    selectProperty?: string;
}

/**
 * Configuration data passed to the build function of SelectableFieldsUrlBuilder
 */
export interface SelectUrlBuilderBuildConfig {

    /**
     * The URL of the back end to get the data from
     */
    url: string;

    /**
     * The array of fields to select
     */
    select?: string[];
}

/**
 * Builds the query string with the filter
 */
export interface FilterUrlBuilder {

    /**
     * The function that builds the OData fragment out of the filter 
     */
    build(): string;
}

/**
 * The sort order of the fields
 */
export type SortOrder = "asc" | "desc";

/**
 * The sorter of the fields
 */
export interface SorterUrlBuilder {

    /**
     * The name of the field to sort
     */
    field: string;

    /**
     * The sort order of the field
     */
    order: SortOrder
}

export interface ICollectionUrlBuilder {

    filterProperty?: string;

    filterBuilder?: FilterUrlBuilder;

    orderByProperty?: string;

    topProperty?: string;

    skipProperty?: string;
}

/**
 * Configuration passed to the constructor of CollectionUrlBuilder
 */
export interface CollectionUrlBuilderConfig extends ICollectionUrlBuilder, ISelectUrlBuilder { }

/**
 * Configuration passed to the build function of CollectionUrlBuilder
 */
export interface CollectionUrlBuilderBuildConfig extends SelectUrlBuilderBuildConfig {

    top?: number;

    skip?: number;

    filter?: unknown;

    orderBy?: SorterUrlBuilder[];

    [otherParams : string]: unknown;
}

/**
 * Configuration passed to the constructor of CollectionLoader
 */
export interface CollectionLoaderConfig extends FetchCallbacks {

    urlBuilder?: CollectionUrlBuilderConfig;
}

/**
 * Configuration passed to the constructor of SingleLoader
 */
export interface SingleLoaderConfig extends FetchCallbacks {

    urlBuilder?: ISelectUrlBuilder;
}
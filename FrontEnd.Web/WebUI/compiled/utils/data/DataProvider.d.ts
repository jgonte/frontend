import { DynamicObject } from "../types";
export interface SingleRecordDataProvider {
    getData(): DynamicObject;
}
export interface CollectionDataProvider {
    getData(): DynamicObject[];
}

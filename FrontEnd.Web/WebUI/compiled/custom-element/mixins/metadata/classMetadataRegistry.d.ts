import { Constructor } from "../../../utils/types";
import CustomElementMetadata from "./types/CustomElementMetadata";
declare const classMetadataRegistry: Map<Constructor<HTMLElement>, CustomElementMetadata>;
export default classMetadataRegistry;

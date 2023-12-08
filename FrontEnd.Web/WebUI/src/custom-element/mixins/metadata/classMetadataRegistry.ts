import { Constructor } from "../../../utils/types";
import CustomElementMetadata from "./types/CustomElementMetadata";

/**
 * Tracks the custom element metadata by the class type
 */
// This is done to bypass weird behaviour with javascript regarding inherited static objects
const classMetadataRegistry = new Map<Constructor<HTMLElement>, CustomElementMetadata>();

export default classMetadataRegistry;
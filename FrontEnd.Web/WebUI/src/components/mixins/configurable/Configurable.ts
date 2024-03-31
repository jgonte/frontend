import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomHTMLElementConstructor from "../../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import { DataTypes } from "../../../utils/data/DataTypes";
import { IComponentDescriptor } from "./models/IComponentDescriptor";

/**
 * Handles configuring the component dynamically from the descriptors supplied
 * @param Base 
 * @returns 
 */
export default function Configurable<TBase extends CustomHTMLElementConstructor>(Base: TBase): TBase {

    return class ConfigurableMixin extends Base {

        static get properties(): Record<string, CustomElementPropertyMetadata> {

            return {
    
                /**
                 * The source to configure from
                 */
                source: {
                    type: [
                        DataTypes.Object,
                        DataTypes.Function
                    ],
                    defer: true, // If it is a function, defer it
                    canChange: function () {
    
                        return true;
                    },
                    afterChange: async function (value: unknown): Promise<void> {
    
                        // Wait for previous updates to complete
                        await (this as unknown as ConfigurableMixin).updateComplete;

                        const descriptor = (typeof value === "function" ?
                            value() :
                            value) as IComponentDescriptor;
                        
                        (this as unknown as ConfigurableMixin).configure(descriptor);
                    }
                }
    
            };
        }

        // abstract configure(descriptor: IComponentDescriptor);
    }
}
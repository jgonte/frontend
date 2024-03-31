export interface IComponentDescriptor {

    id?: string;

    label: string;

    iconName: string;

    /**
     * The name of the field held by the component
     */
    name: string;

    /**
     * The type of the field held by the component
     */
    type: string;   

    /**
     * The descriptors of the children components of this one
     */
    children: IComponentDescriptor[];
}
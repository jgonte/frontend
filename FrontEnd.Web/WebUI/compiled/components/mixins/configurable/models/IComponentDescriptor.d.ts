export interface IComponentDescriptor {
    id?: string;
    label: string;
    iconName: string;
    name: string;
    type: string;
    children: IComponentDescriptor[];
}

import CustomHTMLElementConstructor from "../../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
export interface INavigationContainer extends HTMLElement {
    routerName: string;
    setActiveLink(path: string): void;
}
export default function NavigationContainer<TBase extends CustomHTMLElementConstructor>(Base: TBase): TBase;

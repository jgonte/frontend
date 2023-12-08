export default interface Route {

    /**
     * The module this route belongs to
     */
    module?: string;

    /**
     * The name of the route (Edit Customer, for example)
     */
    name: string;

    /**
     * The path to render the view
     */
    path: string;

    /**
     * The view to render
     */
    view: string;
}
/**
 * Creates a string the name classes if the props keyed by the name of the class
 * has a value that evaluates to true
 * @param props 
 */
 export default function getClasses(props: Record<string, boolean>): string {
    
    const classes: string[] = [];

    for (const key in props) {

        if (props.hasOwnProperty(key)) {

            if (props[key] === true) {

                classes.push(key);
            }          
        }
    }

    return classes.join(' ');
}
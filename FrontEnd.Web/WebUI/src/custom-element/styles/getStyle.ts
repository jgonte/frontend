import { GenericRecord } from "../../utils/types";

export default function getStyle(props: GenericRecord) : string {

    return Object.keys(props).reduce((acc, key) => (
        acc + key.split(/(?=[A-Z])/).join('-').toLowerCase() + ':' + props[key] + ';'
    ), '');
}
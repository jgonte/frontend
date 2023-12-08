import { DataTypes } from "../../utils/data/DataTypes";

/**
 * Label alignment
 */
const labelAlign = {
    attribute: 'label-align',
    type: DataTypes.String,
    value: 'left',
    options: ['left', 'right', 'center', 'justify'],
    reflect: true,
    inherit: true
};

export default labelAlign;
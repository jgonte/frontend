import applyClasses from "../../../custom-element/styles/applyClasses";

describe("applyClass tests", () => {

    it('should apply a literal style single rule', () => {

        const element = document.createElement('div');

        applyClasses(element, {
            'class1': true, // set
            'class2': false // do not set
        });

        expect(element.classList.contains('class1')).toBeTruthy();

        expect(element.classList.contains('class2')).toBeFalsy();

        applyClasses(element, {
            'class1': false, // unset
            'class2': true // set
        });

        expect(element.classList.contains('class2')).toBeTruthy();

        expect(element.classList.contains('class1')).toBeFalsy();
    });

});
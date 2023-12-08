import Observer from "../../../utils/observer/Observer";
const values = [];
beforeEach(() => {
    values.length = 0;
});
class Observed {
    name;
    constructor(name) {
        this.name = name;
    }
    onNotify(...args) {
        values.push({
            name: this.name,
            args
        });
    }
}
describe('Observer test', () => {
    it('without subscribers it notifies nothing', async () => {
        const observer = new Observer();
        observer.notify();
        expect(values).toEqual([]);
    });
    it('subscribes and notify subscribers', async () => {
        const observer = new Observer();
        observer.subscribe(new Observed('observed1'));
        observer.subscribe(new Observed('observed2'));
        observer.notify('arg1', 2, true);
        expect(values).toEqual([
            {
                name: "observed1",
                args: [
                    "arg1",
                    2,
                    true,
                    observer
                ]
            },
            {
                name: "observed2",
                args: [
                    "arg1",
                    2,
                    true,
                    observer
                ]
            }
        ]);
    });
    it('subscribes, unsubscribes and notify subscribers', async () => {
        const observer = new Observer();
        observer.subscribe(new Observed('observed1'));
        const observed = new Observed('observed2');
        observer.subscribe(observed);
        observer.subscribe(new Observed('observed3'));
        observer.unsubscribe(observed);
        observer.notify(true, 3, 'arg3');
        expect(values).toEqual([
            {
                name: "observed1",
                args: [
                    true,
                    3,
                    'arg3',
                    observer
                ]
            },
            {
                name: "observed3",
                args: [
                    true,
                    3,
                    'arg3',
                    observer
                ]
            }
        ]);
    });
});
//# sourceMappingURL=Observer.spec.js.map
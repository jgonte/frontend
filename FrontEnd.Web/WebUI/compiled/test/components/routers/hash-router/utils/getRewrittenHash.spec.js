import getRewrittenHash from "../../../../../components/routers/hash-router/utils/getRewrittenHash";
describe('getRewrittenHash tests', () => {
    it('should return the new route', () => {
        const result = getRewrittenHash('#app/route-1', 'app', '/route-2');
        expect(result).toEqual('#app/route-2');
    });
    it('should append the new route', () => {
        const result = getRewrittenHash('#main/route-1', 'app', '/route-2');
        expect(result).toEqual('#main/route-1#app/route-2');
    });
});
//# sourceMappingURL=getRewrittenHash.spec.js.map
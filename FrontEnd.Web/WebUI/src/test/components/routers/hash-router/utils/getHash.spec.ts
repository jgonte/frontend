import getHash from "../../../../../components/routers/hash-router/utils/getHash";

describe('getHash tests', () => {

	it('should return the whole hash', () => {

		const result = getHash('#app/route1', 'app');

		expect(result).toEqual('#app/route1');
	});

    it('should return the root path /', () => {

		const result = getHash('#app/route1', 'main');

		expect(result).toEqual('/');
	});
	
    it('should return the second sub hash', () => {

		const result = getHash('#main/main-route#app/app-route#sub/sub-route', 'app');

		expect(result).toEqual('#app/app-route');
	});

    it('should return the first sub hash', () => {

		const result = getHash('#main/main-route#app/app-route#sub/sub-route', 'main');

		expect(result).toEqual('#main/main-route');
	});

    it('should return the third sub hash', () => {

		const result = getHash('#main/main-route#app/app-route#sub/sub-route', 'sub');

		expect(result).toEqual('#sub/sub-route');
	});
});
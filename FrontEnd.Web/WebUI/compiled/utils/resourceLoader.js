const cache = {};
export const resourceLoader = {
    async get(path) {
        let content = cache[path];
        if (content !== undefined) {
            return content;
        }
        const response = await fetch(path);
        content = await response.text();
        cache[path] = content;
        return content;
    }
};
//# sourceMappingURL=resourceLoader.js.map
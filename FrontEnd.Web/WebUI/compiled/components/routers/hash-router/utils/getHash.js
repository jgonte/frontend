export default function getHash(hash, name) {
    const marker = `#${name}`;
    const start = hash.indexOf(marker);
    if (start === -1) {
        return '/';
    }
    hash = hash.substring(start);
    const nextHash = hash.indexOf('#', 1);
    return nextHash == -1 ?
        hash :
        hash.substring(0, nextHash);
}
//# sourceMappingURL=getHash.js.map
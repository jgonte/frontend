import getHash from "./getHash";

export default function getRewrittenHash(originalHash: string, name: string, path: string) {

    const newHash = `#${name}${path}`;

    const hash = getHash(originalHash, name);

    if (hash === '/') {

        return originalHash + newHash;
    }
    else {

        return originalHash.replace(hash, newHash);
    }
}
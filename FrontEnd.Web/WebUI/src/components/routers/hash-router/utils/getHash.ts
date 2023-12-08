/**
 * Extracts the sub-hash of the hash that corresponds to the name
 * @param hash The hash to extract the fragment from
 * @param name The name of the fragment to extract
 */
export default function getHash(hash: string, name: string) {

    const marker = `#${name}`;

    const start = hash.indexOf(marker);

    if (start === -1) {

        return '/'; // Not found
    }

    hash = hash.substring(start); // Remove any # before the one with the name of our router

    const nextHash = hash.indexOf('#', 1); // Find the next #

    return nextHash == -1 ? // No # was found
        hash :
        hash.substring(0, nextHash); // Remove the last hash since that belongs to a different router
}
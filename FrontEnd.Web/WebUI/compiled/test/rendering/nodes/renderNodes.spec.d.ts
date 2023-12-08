export type ListenersHolder = Element & {
    _listeners: {
        [k: string]: (() => void)[];
    };
};

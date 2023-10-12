export default class AsyncBlockingQueue {
    _promises = [];
    _resolvers = [];

    constructor() {
        this._resolvers = [];
        this._promises = [];
    }

    _add() {
        this._promises.push(new Promise(resolve => {
            this._resolvers.push(resolve);
        }));
    }

    enqueue(t) {
        if (!this._resolvers.length) this._add();
        const resolve = this._resolvers.shift();
        resolve(t);
    }

    dequeue() {
        if (!this._promises.length) this._add();
        const promise = this._promises.shift();
        return promise;
    }

    isEmpty() {
        return !this._promises.length;
    }

    isBlocked() {
        return !!this._resolvers.length;
    }

    get length() {
        return this._promises.length - this._resolvers.length;
    }
}
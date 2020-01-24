export class StringArray extends Array<string> {
    private _array: Array<string>;
    constructor(array: Array<string>) {
        super();
        this._array = array;
    }
    ;
    get last() {
        return this._array[this._array.length - 1];
    }
    getNth(nth: number) {
        return this._array[nth];
    }
    getNthFromLast(nth: number) {
        return this._array[this._array.length - nth];
    }
    hasEqualLengthStrings() {
        const firstLengthValue = this._array[0].length;
        this._array.forEach(string => {
            if (string.length != firstLengthValue) {
                return false;
            }
        });
        return true;
    }
}

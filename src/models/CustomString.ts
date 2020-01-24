export class CustomString {
    private _input: string;
    constructor(input: string) {
        this._input = input;
    }
    capitalizeFirstLetter() {
        return this._input[0].toUpperCase() + this._input.substring(1);
    }
    getLastArrayItemSplitOnSlashWithASlashAsLastCharacter() {
        var array = this._input.split('\/');
        return array[array.length - 2];
    }
}

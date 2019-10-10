export class ValidationHelper {
    static isValidRaidRequestCommand(input: string) {
        var regExPattern = new RegExp("(!|\\?{1})(raid)( )(start|help)( )([Tt])([1-5]{1})(( \\w+){1,4})( )([0-9]{2})([Uu]|\\:)([0-9]{2})");
        return regExPattern.test(input);
    }
    static isValidHelpRequestCommand(input: string) {
        var regExPattern = new RegExp("(!|\\?{1})(help)(( \\w+){1})");
        return regExPattern.test(input);
    }
    static isValidRankRequestCommand(input: string) {
        var regExPattern = new RegExp("(!|\\?{1})(rank)( )(instinct|Instinct|mystic|Mystic|valor|Valor)");
        return regExPattern.test(input);
    }
}
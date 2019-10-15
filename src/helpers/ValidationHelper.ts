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
        var regExPattern = new RegExp("(!|\\?{1})(register)( )(instinct|Instinct|mystic|Mystic|valor|Valor)( \\w+){2}( )([0-9]{2})");
        return regExPattern.test(input);
    }
    static isValidLevelUpCommand(input: string) {
        return input === "!register levelup"
    }
    static isValidSetTopicCommand(input: string) {
        var regExPattern = new RegExp("(!|\\?{1})(set)( )(topic)( \\w+){1,}");
        return regExPattern.test(input);
    }
    static isValidPinMessageCommand(input: string) {
        var regExPattern = new RegExp("(!|\\?{1})(pin)( )(message)( \\w+){1,}");
        return regExPattern.test(input);
    }

}
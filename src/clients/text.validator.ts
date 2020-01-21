import { StringArray } from "./StringArray";
import moment from "moment"
import { injectable } from "inversify";
import { PokemonStore } from "../stores/pokemon.store";
import { dependencyInjectionContainer } from "../di-container";
import { isNullOrUndefined } from "util";

@injectable()
export class TextValidator {
    private pokemonStore: PokemonStore = dependencyInjectionContainer.get<PokemonStore>(PokemonStore);

    static hasNthOccurencesOf(input: string, match: string) {
        var count = 0;
        for (var i = 0; i < input.length; i++) {
            if (input.charAt(i) === match) {
                count++;
            }
        }
        return count;
    }
    static matchesFourCharacters(input: string) {
        return new RegExp("[a-z]{4,}").test(input);
    }

    async validatePokemonName(lines: string[]) {
        var stringArray = new StringArray(lines);
        var retries = lines.length
        var isValid = false;
        var itemIndex = 0
        var retVal = ""
        while (retries-- > 0 && !isValid && itemIndex++ < lines.length) {
            var selectedItem = stringArray.getNth(itemIndex)
            var databaseResult = await this.pokemonStore.searchByName(selectedItem);
            if(!isNullOrUndefined(databaseResult)) {
                if(!isNullOrUndefined(databaseResult[0])) {
                    retVal = (databaseResult[0][0] as any).name
                    isValid = true
                    console.log("Name from pokemon obj: ", retVal)
                }
            }
            if (!isValid && selectedItem.split(' ').length == 1 && TextValidator.matchesFourCharacters(selectedItem)) {
                retVal = selectedItem
                isValid = true
            }
        }
        return retVal
    }

    validateName(lines: string[]) {
        var stringArray = new StringArray(lines);
        var retries = lines.length
        var isValid = false;
        var itemIndex = 0
        var retVal = ""
        while (retries-- > 0 && !isValid && itemIndex++ < lines.length) {
            var selectedItem = stringArray.getNth(itemIndex)
            if (TextValidator.matchesFourCharacters(selectedItem)) {
                retVal = selectedItem
                isValid = true
            }
        }
        return retVal
    }
    validateTime(lines: string[]) {
        var stringArray = new StringArray(lines)
        var itemIndexFromEnd = 1
        var retries = lines.length
        var isValid = false;
        var date = moment.utc().add(1, 'hours'); // for the belgium local time
        while (retries-- > 0 && !isValid && itemIndexFromEnd++ < 5) {
            var selectedItem = stringArray.getNthFromLast(itemIndexFromEnd)
            console.log(`Validating: ${selectedItem}`)
            if (TextValidator.hasNthOccurencesOf(selectedItem, ':') == 2) {
                var arrayWithTimeNumbers = selectedItem.split(':')
                var hours = Number(arrayWithTimeNumbers[0])
                var minutes = Number(arrayWithTimeNumbers[1])
                var seconds = Number(arrayWithTimeNumbers[2])
                date.add(hours, 'hours')
                date.add(minutes, 'minutes')
                date.add(seconds, 'seconds')
                isValid = true
            }
        }
        var duration = moment.duration(date.diff(moment.utc().add(1, 'hours'))).asMinutes();

        return duration
    }
}

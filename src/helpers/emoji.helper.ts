import { RankEmoji } from "../models/rankemoji.enum";
export class EmojiHelper {
    static getEmoji(name: string) {
        switch (name) {
            case "valor": return RankEmoji.valor;
            case "mystic": return RankEmoji.mystic;
            case "instinct": return RankEmoji.instinct;
        }
    }
}
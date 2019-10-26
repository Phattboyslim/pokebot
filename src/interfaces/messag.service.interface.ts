import { Message } from "discord.js";

export interface IMessageService {
    setMessage(message: Message): any
}
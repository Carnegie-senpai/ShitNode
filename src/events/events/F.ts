import { Message } from "discord.js";
import { Event } from "../Event";
import { Logger } from "../../Logger";

const fLog = new Logger("F/F")
export class F implements Event {
	async trigger(msg: Message) {
		return msg.content.match(/.* f .*chat/gi) !== null;
	};
	async event(msg: Message): Promise<void> {
		fLog.info("Detected somebody saying drop an f in chat")
		await msg.reply("F");
	}
}
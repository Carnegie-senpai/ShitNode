import { Message } from "discord.js";
import { Event } from "../Event";
import { Logger } from "../../Logger";

const eLog = new Logger("E/E")
export class E implements Event {
	async trigger(msg: Message) {
		return msg.content.match(/^e$/gi) !== null;
	}
	
	async event(msg: Message<boolean>): Promise<void> {
		eLog.info("Detected somebody saying e")
		await msg.react("Clout:333845251511025684")
	}
}
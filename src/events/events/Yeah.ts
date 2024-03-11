import { Message } from "discord.js";
import { Event } from "../Event";
import { Logger } from "../../Logger";

const yeahLog = new Logger("Yeah/Yeah")
export class Yeah implements Event {
	async trigger(msg: Message) {
		return msg.content.match(/(yeah. sure)|(yea. sure)/gi) !== null;
	}

	async event(msg: Message<boolean>): Promise<void> {
		yeahLog.info("Detected somebody saying yeah sure")
		await msg.reply("Who's Yassur?");
	};
}
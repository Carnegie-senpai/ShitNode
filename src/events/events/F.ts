import { Message } from "discord.js";
import { Event } from "../Event";

export class F implements Event {
	trigger: RegExp = /.* f .*chat/gi;
	async event(msg: Message<boolean>): Promise<void> {
		await msg.reply("F");
	}
}
import { Message } from "discord.js";
import { Event } from "../Event";
import { randomInsult } from "../../helper/RandomInsult";

export class TestBot implements Event {
	async trigger(msg: Message) {
		return msg.content.match(/.*testbot|.*test.bot|.*<@416768458122985473>/gi) !== null 
	};

	async event(msg: Message) {
		if (!msg.author.bot)
			await msg.reply(`TestBot is a ${randomInsult()}`);
	}
}
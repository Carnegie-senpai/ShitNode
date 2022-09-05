import { Message } from "discord.js";
import { Event } from "../Event";
import { randomInsult } from "../../helper/RandomInsult";

export class TestBot implements Event {
	trigger: RegExp = /.*testbot|.*test.bot|.*<@416768458122985473>/gi;
	async event(msg: Message<boolean>) {
		if (!msg.author.bot)
			await msg.reply(`TestBot is a ${randomInsult()}`);
	}
}
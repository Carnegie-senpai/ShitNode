import { Message } from "discord.js";
import { Command } from "../Command";
import { CommandUtil } from "../CommandUtil";
import { Play } from "./Play";


export class Queue implements Command {
	key: string = "queue";
	async cmd(msg: Message) {
		const content = CommandUtil.getContent(msg);
		if (content == "") {
			let response = "  ===> Queue <===  ";
			for (let i = 0; i < Play.queue.length; i++) {
				response += `\n${i}: ${Play.queue[i].name}`;
			}
			await msg.reply(response);
		} else {
			let index = parseInt(content);
			if (index === NaN) {
				await msg.reply(`"${content}" is not a valid index`);
				return;
			}
				
			let removed = Play.queue.splice(index, 1);
			await msg.reply(`Removed "${removed[0].name}" from the queue`);
		}
	}
}
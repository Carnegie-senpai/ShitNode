import * as commands from "./index";
import { Message } from "discord.js";
export class Commands {
	static commands: { [name: string]: (msg: Message) => Promise<void> } = {};

	static loadCommands() {
		Object.values(commands).forEach((command)=> {
			const commandInstance = new command()
			Commands.commands[commandInstance.key] = commandInstance.cmd
		})
	}

	static isCommand(msg: Message) {
		return msg.content.startsWith("uwu")
	}

	static getCommand(msg: Message) {
		try {
			return Commands.commands[msg.content.trim().split(" ")[1]]
		} catch (e) {
			console.error("Could not get command: ", e)
			return null;
		}
	}
}
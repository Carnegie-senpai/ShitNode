import * as commands from "./index";
import { Message } from "discord.js";
import { REST, Routes } from "discord.js";
export class CommandUtil {
	static commands: { [name: string]: (msg: Message) => Promise<void> } = CommandUtil.loadCommands();

	/**
	 * Returns an object containing all commands
	 */
	private static loadCommands() {
		let allCommands = {}
		Object.values(commands).forEach((command) => {
			const commandInstance = new command()
			allCommands[commandInstance.key] = commandInstance.cmd
		})
		return allCommands
	}

	/**
	 * 
	 * @returns Whether the function is a command
	 */
	static isCommand(msg: Message) {
		return msg.content.startsWith("uwu")
	}

	/**
	 * 
	 * @returns The command function, if any called by this message
	 */
	static getCommand(msg: Message) {
		try {
			return CommandUtil.commands[msg.content.trim().split(" ")[1]]
		} catch (e) {
			console.error("Could not get command: ", e)
			return null;
		}
	}

	/**
	 * 
	 * @returns returns content of the message or an empty string
	 */
	static getContent(msg: Message) {
		const content = msg.content.trim().split(" ")
		if (content.length >= 3)
			return content.slice(2).join(" ");
		return "";
	}

	static async callCommandIfCommand(msg: Message) {
		const messageArray = msg.content.trim().split(" ")
		if (CommandUtil.isCommand(msg)) {
			if (messageArray.length < 2) {
				await msg.reply("Must provide a command")
				return;
			}

			if (!CommandUtil.commands[messageArray[1]]) {
				await msg.reply(`${messageArray[1]} is not a command`)
				return;
			}

			try {
				await CommandUtil.commands[messageArray[1]](msg)
			} catch (e: any) {
				console.log("Caught error while executing command", e)
				await msg.reply(`There was an error while executing this command: + ${e.message}`)
			}

		}	
	}
}


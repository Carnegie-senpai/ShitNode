import * as commands from "./index";
import { Message } from "discord.js";
import { Command } from "./Command";
import { Logger } from "../Logger";

const commandLogger = new Logger("CommandUtil/CommandUtil")
export class CommandUtil {
	static commands: { [name: string]: Command } = CommandUtil.loadCommands();

	/**
	 * Returns an object containing all commands
	 */
	private static loadCommands() {
		commandLogger.info("Loading commands")
		let allCommands = {}
		// Loads the commands from the index file in commands/commands
		Object.values(commands).forEach((command) => {
			const commandInstance = new command()
			commandLogger.info(`Loading command: ${commandInstance.key}`)
			allCommands[commandInstance.key] = commandInstance
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
			commandLogger.info("Getting command")
			return CommandUtil.commands[msg.content.trim().split(" ")[1]]
		} catch (e) {
			commandLogger.error("Could not get command: ", e)
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
			commandLogger.info("Processing a command")

			if (messageArray.length < 2) {
				commandLogger.info("Command trigger was not followed by a command")
				await msg.reply("Must provide a command")
				return;
			}

			if (!CommandUtil.commands[messageArray[1]]) {
				commandLogger.info("Command was not a valid command")
				await msg.reply(`${messageArray[1]} is not a command`)
				return;
			}

			try {
				commandLogger.info("Executing command")
				await CommandUtil.commands[messageArray[1]].cmd(msg)
			} catch (e: any) {
				commandLogger.log("Caught error while executing command", e)
				await msg.reply(`There was an error while executing this command: + ${e.message}`)
			}

		}	
	}
}


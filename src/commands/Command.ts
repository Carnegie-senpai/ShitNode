import { Message } from "discord.js"

export interface Command {
	key: string
	help: string
	cmd(msg: Message): Promise<void>
}
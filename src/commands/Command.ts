import { Message } from "discord.js"

export interface Command {
	key: string
	cmd(msg: Message): Promise<void>
}
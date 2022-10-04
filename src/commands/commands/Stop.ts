import { Message } from "discord.js";
import { Command } from "../Command";
import { Play } from "./Play";

export class Stop implements Command {
	key = "stop"
	async cmd(msg: Message) {
		Play.queue = [];
		Play.audioPlayer?.stop(true);
		Play.disconnect();
	}
}
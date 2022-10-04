import { Message } from "discord.js";
import { Command } from "../Command";
import { Play } from "./Play";

export class Stop implements Command {
	key = "stop"
	help = "`uwu stop`: Command is used to clear queue and stop playback of shit-chan"
	async cmd(msg: Message) {
		Play.queue = [];
		Play.audioPlayer?.stop(true);
		Play.disconnect();
	}
}
import { Message } from "discord.js";
import { Command } from "../Command";
import { Play } from "./Play";
import { Logger } from "../../Logger";

const stopLog = new Logger("Stop/Stop")
export class Stop implements Command {
	key = "stop"
	help = "`uwu stop`: Command is used to clear queue and stop playback of shit-chan"
	async cmd(msg: Message) {
		stopLog.info("Stopping playback")
		Play.queue = [];
		Play.audioPlayer?.stop(true);
		Play.disconnect();
	}
}
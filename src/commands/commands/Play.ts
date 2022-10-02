import { Message } from "discord.js";
import { Command } from "../Command";
import { Guild } from "discord.js";
import { stream } from "../../helper/YoutubeStream";
import { CommandUtil } from "../CommandUtil";
import { StaticClient } from "../../Client";
import { joinVoiceChannel, AudioPlayer, createAudioResource, createAudioPlayer } from "@discordjs/voice";

export class Play implements Command {
	key = "play";
	static audioPlayer: AudioPlayer = createAudioPlayer();
	static queue: string[] = []
	async cmd(msg: Message) {
		if (!msg.guildId)
			return;

		const url = CommandUtil.getContent(msg);

		if ( Play.audioPlayer.state.status != "idle" ) {
			Play.queue.push(url)
			return;
		}
		
		const guild = StaticClient.client.guilds.cache.get(msg.guildId);
		const member = guild?.members.cache.get(msg.author.id);
		const vc = member?.voice.channel;
		if (!vc)
			await msg.reply("You must be in a voice channel to play audio");
		if (guild?.id && vc?.id) {
			const connection = joinVoiceChannel({
				guildId: guild.id,
				channelId: vc.id,
				adapterCreator: guild.voiceAdapterCreator
			});
			try {
				const audioStream = stream(url);
				const audioResource = createAudioResource(audioStream);
				if (audioResource) {
					connection.subscribe(Play.audioPlayer);
					Play.audioPlayer.play(audioResource);
					// Play.audioPlayer.on("stateChange", (state) => {
					// 	if (state.status == "idle") {
					// 		if (Play.queue.length > 0) {
					// 			const url = Play.queue[0];
					// 			const audioStream = stream(url);
					// 			const audioResource = createAudioResource(audioStream);
					// 			Play.queue = Play.queue.slice(1);
					// 			Play.audioPlayer.play(audioResource);
					// 		}
							
					// 	}
					// })
				}
			} catch (e) {
				console.error("Error while attempting to play audio: ", e);
				connection.disconnect();
				connection.destroy();
			}

		}

	}
}
import { Message } from "discord.js";
import { Command } from "../Command";
import { Guild } from "discord.js";
import { stream, getVideo, Video } from "../../helper/YoutubeStream";
import { CommandUtil } from "../CommandUtil";
import { StaticClient } from "../../Client";

import { joinVoiceChannel, AudioPlayer, createAudioResource, createAudioPlayer, VoiceConnection, AudioPlayerStatus } from "@discordjs/voice";

export class Play implements Command {
	key = "play";
	static audioPlayer: AudioPlayer | null = null;
	static connection: VoiceConnection | null = null;
	static queue: Video[] = [];
	async cmd(msg: Message) {
		if (!msg.guildId)
			return;

		// Create player if it does not exist. Only do this once
		if (!Play.audioPlayer) {
			Play.audioPlayer = createAudioPlayer();
			Play.audioPlayer.on("stateChange", async (oldState, newState) => {
				if (newState.status === AudioPlayerStatus.Idle && Play.audioPlayer) {
					if (Play.queue.length > 0) {
						let nextSong = Play.queue.splice(0,1)[0];
						console.log(`Playing ${nextSong.name}`)
						const audioStream = stream(nextSong);
						const audioResource = createAudioResource(audioStream);
						Play.audioPlayer.play(audioResource);
					} else {
						Play.disconnect();
					}

				}
			});
		}

		const url = CommandUtil.getContent(msg);

		// Queue up music if already playing a song
		if (Play.audioPlayer.state.status != "idle") {
			console.log("Already playing something", Play.audioPlayer.state.status);
			Play.queue.push(await getVideo(url));
			console.log(Play.queue);
			return;
		}

		// Get info needed to join voice channel
		const guild = StaticClient.client.guilds.cache.get(msg.guildId);
		const member = guild?.members.cache.get(msg.author.id);
		const vc = member?.voice.channel;

		// Do not play if user is not in a voice channel
		if (!vc)
			await msg.reply("You must be in a voice channel to play audio");

		// Create connection if one does not exist
		if (guild?.id && vc?.id && !Play.connection)
			Play.connection = joinVoiceChannel({
				guildId: guild.id,
				channelId: vc.id,
				adapterCreator: guild.voiceAdapterCreator
			});

		try {
			const audioStream = stream(await getVideo(url));
			const audioResource = createAudioResource(audioStream);
			if (audioResource && Play.connection) {
				Play.connection.subscribe(Play.audioPlayer);
				Play.audioPlayer.play(audioResource);

			}
		} catch (e) {
			console.error("Error while attempting to play audio: ", e);
			Play.disconnect();
		}
	}

	static disconnect() {
		if (Play.connection) {
			Play.connection.disconnect();
			Play.connection.destroy();
			Play.connection = null;
		}
	}
}
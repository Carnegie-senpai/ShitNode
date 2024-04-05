import { Message } from "discord.js";
import { Command } from "../Command";
import { stream, getVideo, Video } from "../../helper/YoutubeStream";
import { CommandUtil } from "../CommandUtil";
import { StaticClient } from "../../Client";
import { joinVoiceChannel, AudioPlayer, createAudioResource, createAudioPlayer, VoiceConnection, AudioPlayerStatus } from "@discordjs/voice";
import { Logger } from "../../Logger";


// TODO better log in this command
const playLog = new Logger("PlayList/PlayList");
export class PlayList implements Command {
    key: string = "playlist";
    help = "`uwu playlist create <PLAYLIST_NAME>`: Create a named playlist with a single word name, with no spaces, such as 'Example_Playlist'\n\
    `uwu playlist add <PLAYLIST_NAME> <VIDEO>`: Add a video to an already existing playlist. Video can be a url or search term\n\
    `uwu playlist display <PLAYLIST_NAME>`: Displays the contents of the playlist\n\
    `uwu playlist remove <PLAYLIST_NAME> <INDEX>`: Removes a video from the playlist at the given index\n\
    `uwu playlist delete <PLAYLIST_NAME>`: Deletes the playlist and its contents";
    async cmd(msg: Message<boolean>): Promise<void> {
        // I want to create a more robust state manager for playing videos. Should be idiot proof and be simple to manage state so it is re-usable across commands. Also may want sub commands as an option? 
        // May be better if everything is its own command, if just for consistency, even if that leads to commands like playlistAdd and playlistDisplay thought the terser add, display, remove, etc are probably better
    }
}
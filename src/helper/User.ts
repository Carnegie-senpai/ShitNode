import { Message } from "discord.js";
import { StaticClient } from "../Client";
import { Logger } from "../Logger";

const userLog = new Logger('User/User');
export class User {
    /**
     * Returns the user if valid. Errors if user cannot be fetched
     * @param msg 
     * @returns 
     */
    static getUser(msg: Message) {
        if (!msg?.guildId)
            throw new Error("Message had no guild id");

        if (!msg?.author?.id)
            throw new Error("Message had no author or author had no id");

        const guild = StaticClient.client.guilds.cache.get(msg.guildId as string);
        const member = guild?.members.cache.get(msg.author.id);

        if (!guild)
            throw new Error("Could not fetch user's guild");

        if (!member)
            throw new Error("Could not fetch user's member");

        return { guild, member };
    }

    /**
     * Returns the user if valid and in a voice channel. Errors if the user is not valid or is not in a voice channel
     * @param msg 
     * @returns 
     */
    static getUserInVoice(msg: Message) {
        const user = User.getUser(msg)
        const vc = user.member.voice.channel
        if (!vc)
            throw new Error("User was not in a voice channel")

        return {...user, vc}
    }
}

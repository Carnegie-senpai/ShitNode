import { readFileSync, writeFileSync } from "fs";
import moment from "moment";
import { Logger } from "../Logger";
import { User } from "discord.js";

const leaderboardLog = new Logger("Leaderboard/Leaderboard");
export class Leaderboard {
	private static cache: { [name: string]: number; } = {};
	static hasReacted = false;
	static checkpoint: moment.Moment = moment();
	static lastReactTimeStamp: { user: User | undefined, timestamp: bigint } = { user: undefined, timestamp: process.hrtime.bigint() }
	static postMessageCB: NodeJS.Timeout
	static load() {
		let json: { [name: string]: number; };
		try {
			leaderboardLog.info("Loading the leaderboard");
			json = JSON.parse(readFileSync(`${process.cwd()}/assets/leaderboard.json`, { encoding: "utf-8" }));
			Leaderboard.checkpoint = moment();
		} catch (e) {
			leaderboardLog.error("Caught an error trying to load leaderboard, defaulting to an empty leaderboard: ", e);
			json = {};
			writeFileSync(`${process.cwd()}/assets/leaderboard.json`, JSON.stringify({}));
		}
		Leaderboard.cache = json;
	}

	static save() {
		try {
			leaderboardLog.info("Saving the leaderboard");
			writeFileSync(`${process.cwd()}/assets/leaderboard.json`, JSON.stringify(Leaderboard.cache));
		} catch (e) {
			leaderboardLog.error("Failed to write leaderboard to file: ", e);
		}
	}

	static givePoint(userName: string) {
		Leaderboard.hasReacted = true;
		if (!Leaderboard.cache[userName])
			Leaderboard.cache[userName] = 1;
		else
			Leaderboard.cache[userName] += 1;
		Leaderboard.save();
	}

	static resetLeaderBoard() {
		Leaderboard.checkpoint = moment();
		Leaderboard.cache = {};
		Leaderboard.save();

	}

	static isNewMonth() {
		const currentMonth = moment().month();
		const checkpointMonth = Leaderboard.checkpoint.month();
		return currentMonth != checkpointMonth;
	}

	/**
	 * 
	 * @returns The current leader of the leaderboard (if there is one) and their score
	 */
	static getFirst(): { name: string, score: number; } | undefined {
		let sortedUsers = Object.keys(Leaderboard.cache).sort((user1, user2) => {
			return Leaderboard.cache[user1] - Leaderboard.cache[user2];
		});
		if (sortedUsers.length > 0)
			return { name: sortedUsers[sortedUsers.length - 1], score: Leaderboard.cache[sortedUsers[sortedUsers.length - 1]] };
		return;
	}

	/**
	 * 
	 * @returns top 5 on leaderboard as a string
	 */
	static stringify() {
		let str = "  ===> Leader Board <===  ";
		let top5 = Object.keys(Leaderboard.cache).sort((user1, user2) => {
			return Leaderboard.cache[user1] - Leaderboard.cache[user2];
		}).reverse();

		if (top5.length > 5)
			top5 = top5.slice(0, 5);

		for (let name of top5) {
			str += `\n ${name}: ${Leaderboard.cache[name]}`;
		}
		return str;
	}
}
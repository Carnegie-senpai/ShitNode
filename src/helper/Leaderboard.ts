import { readFileSync, writeFileSync } from "fs";

export class Leaderboard {
	static cache: {[name: string]: number} = {}
	static hasReacted = false;
	static load() {
		let json: {[name: string]: number};
		try {
			json = JSON.parse(readFileSync(`${process.cwd()}/assets/leaderboard.json`, {encoding: "utf-8"}));

		} catch (e) {
			json = {};
			writeFileSync(`${process.cwd()}/assets/leaderboard.json`, JSON.stringify({}));
		}
		Leaderboard.cache = json;
	}

	static save() {
		try {
			writeFileSync(`${process.cwd()}/assets/leaderboard.json`, JSON.stringify(Leaderboard.cache));
		} catch (e) {
			console.error("Failed to write leaderboard to file: ", e)
		}
	}

	static getFirst() {
		let sortedUsers = Object.keys(Leaderboard.cache).sort((user1, user2)=>{
			return Leaderboard.cache[user1] - Leaderboard.cache[user2]
		});
		if (sortedUsers.length > 0)
			return sortedUsers[sortedUsers.length - 1];
		return null;
	}

	/**
	 * 
	 * @returns top 5 on leaderboard as a string
	 */
	static stringify() {
		let str = "  ===> Leader Board <===  "
		let top5 = Object.keys(Leaderboard.cache).sort((user1, user2)=>{
			return Leaderboard.cache[user1] - Leaderboard.cache[user2]
		}).reverse();

		if (top5.length > 5)
			top5 = top5.slice(0,5);
		
		for(let name of top5) {
			str += `\n ${name}: ${Leaderboard.cache[name]}`
		}
		return str
	}
}
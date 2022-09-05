

const insults = ["cuck", "weeb", "liberal... Prepare to be roasted with FACTS and LOGIC!",
 "absolute muffin", "imbecile",
"literal dried piece of shit on the bottom of my shoe", "cunt", "scallywag",
"dumbass", "boomer", "republican", "troglodyte",
"slice of soggy white bread that's been left out for a few days", "netherwart",
"coward with paper hands", "smelly boi"]

/**
 * 
 * @returns random list of insults defined in constant 
 */
export function randomInsult() {
	return insults[Math.floor(Math.random() * insults.length)];	
}
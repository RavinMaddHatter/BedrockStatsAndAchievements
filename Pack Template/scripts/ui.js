import {ActionFormData, ActionFormResponse } from "@minecraft/server-ui";
import { world, system } from '@minecraft/server';
import {biomeFinder, lightLevel} from "playerDependent"
import {getScoreIfExists} from "helperFunctions.js"
const debugToggle = true;

function capitalize(value){
	let output=""
	value.split(" ").forEach((word)=>{
		if (word.length>1){
			output+=word[0].toUpperCase()+word.slice(1)+" "
		}
	})
	return output.substring(0, output.length - 1)
}

export class uiHandler{
	constructor(achievementTracker,advancementTracker,chalengeTracker){
		this.achievementTracker = achievementTracker;
		this.advancementTracker = advancementTracker;
		this.chalengeTracker = chalengeTracker;
	}
	statList(player){
		let statForm = new ActionFormData()
			.title(player.name)
			.body(this.statListBody(player))
			.button("Scores")
			.button("Objectives");
			
			if(player.hasTag("debug")||debugToggle){
				statForm.button("Debug");
			}
			
			statForm.show(player).then((response) => {
				switch(response.selection){
					case 0 :
						this.blockStatsDisplay(player)
						break;
					case 1 :
						this.objectivesStatsDisplay(player);
						break;
					case 2 :
						this.debugDisplay(player);
						break;
				}
			});
	}
	statListBody(player){
		//title
		let statTxt = "Stats";
		
		//formatting
		let titleFormat = "\u00A7d";
		let subtitleFormat = "\u00A73";
		let itemFormat = "\u00A7a";
		let bodyFormat = "\u00A7r";
		
		//items
		let overTravel = world.scoreboard.getObjective("stats_travel_Overwoldblocktravel");
		let totalBlocksPlaced = world.scoreboard.getObjective("stats_blocksPlaced_total");
		let totalBlocksBroken = world.scoreboard.getObjective("stats_blocksBroken_total");
		let daysPlayed = world.scoreboard.getObjective("stats_playTime_MinecraftDays");
		
		//consolidate scores
		let statArrayTxt = [];
		statArrayTxt[0] = subtitleFormat + "Overworld blocks travelled: " + bodyFormat + getScoreIfExists(overTravel, player);
		statArrayTxt[1] = subtitleFormat + "Total blocks placed: " + bodyFormat + getScoreIfExists(totalBlocksPlaced, player);
		statArrayTxt[2] = subtitleFormat + "Total blocks broken: " + bodyFormat + getScoreIfExists(totalBlocksBroken, player);
		statArrayTxt[3] = subtitleFormat + "Minecraft days played: " + bodyFormat + getScoreIfExists(daysPlayed, player);
		
		//construct body
		let indentSize = "";
		let nextLine = '\n';
		let indentNextLine = nextLine + indentSize;
		let displayText = titleFormat + statTxt + nextLine + nextLine + statArrayTxt.join(indentNextLine);
		
		return displayText
	}
	objectivesStatsDisplay(player){
		//title
		let scoresText= [];
		
		//formatting
		const titleFormat = "\u00A7d";
		const subtitleFormat = "\u00A73";
		const itemFormat = "\u00A7r";
		const bodyFormat = "\u00A7a";
		const boolPos = "\u2714";
		const indent = "   ";
		const boolNeg = " ";
		let display = " ";
		
		//items
		let scoreboards = world.scoreboard.getObjectives();
		let tempScore = 0;
		let achievement = [];
		let advancement = [];
		let challenges = [];
		const allAchievments = this.achievementTracker.getAllAchievmentData(player)
		for(let category in allAchievments){
			let newCategory=true;
			for(const handle in allAchievments[category]){
				if(newCategory){
					achievement.push(subtitleFormat+allAchievments[category][handle].category+ ": ");
					newCategory=false;
				}
				if(allAchievments[category][handle].unlocked){
					display=boolPos
				}
				else{
					display=boolNeg
				}
				achievement.push(indent+itemFormat+allAchievments[category][handle].displayName+ ": " + bodyFormat + display);
			}
		}
		const allAdvancements = this.advancementTracker.getAllAchievmentData(player)
		for(let category in allAdvancements){
			let newCategory=true;
			for(const handle in allAdvancements[category]){
				if(newCategory){
					advancement.push(subtitleFormat+allAdvancements[category][handle].category+ ": ");
					newCategory=false;
				}
				if(allAdvancements[category][handle].unlocked){
					display=boolPos
				}
				else{
					display=boolNeg
				}
				advancement.push(indent+itemFormat+allAdvancements[category][handle].displayName+ ": " + bodyFormat + display);
			}
		}
		const allChallenges = this.chalengeTracker.getAllAchievmentData(player)
		for(let category in allChallenges){
			let newCategory=true;
			for(const handle in allChallenges[category]){
				if(newCategory){
					challenges.push(subtitleFormat+allChallenges[category][handle].category+ ": ");
					newCategory=false;
				}
				if(allChallenges[category][handle].unlocked){
					display=boolPos
				}
				else{
					display=boolNeg
				}
				challenges.push(indent+itemFormat+allChallenges[category][handle].displayName+ ": " + bodyFormat + display);
			}
		}
		//construct ui
		let indentSize = "";
		let nextLine = '\n';
		let indentNextLine = nextLine + indentSize;
		let allStats=titleFormat + scoresText.join(nextLine) + nextLine
			+ titleFormat + "Achievements:" + bodyFormat + indentNextLine + achievement.join(indentNextLine) + nextLine
			+ nextLine
			+ titleFormat + "Advancements:" + bodyFormat + indentNextLine + advancement.join(indentNextLine) + nextLine
			+ nextLine
			+ titleFormat + "Challenges:" + bodyFormat + indentNextLine + challenges.join(indentNextLine) + nextLine;
		let statsForm = new ActionFormData()
			.title(player.name)
			.body(allStats)
			.button("Close")
			.show(player);
	}
	blockStatsDisplay(player){
		//title
		let scorestext= ["These are the scores being tracked"];
		
		//formatting
		let titleFormat = "\u00A7d";
		let subtitleFormat = "\u00A73";
		let itemFormat = "\u00A7a";
		let bodyFormat = "\u00A7r";
		
		//items
		let scoreboards = world.scoreboard.getObjectives();
		let blocksBroken = [];
		let blocksPlaced = [];
		let entitiesKilled = [];
		let weaponKills = [];
		let deaths=[];
		let redstoneInteractions=[];
		let enteredDimensions=[];
		let enemiesShot=[];
		let itemsReleased=[];
		let playTime=[];
		let achievmentsUnlocked=[];
		let travel=[];
		let tamed=[];
		let damage=[];
		let damagetaken=[];
		
		//totals
		let totalBlocksBroken = world.scoreboard.getObjective("stats_blocksBroken_total");
		let totalBlocksPlaced = world.scoreboard.getObjective("stats_blocksPlaced_total");
		let totalKilled = world.scoreboard.getObjective("stats_entitiesKilled_");
		let weaponKillsBoard = world.scoreboard.getObjective("stats_weaponKills_");
		let totalDeaths = world.scoreboard.getObjective("stats_Deaths_");
		let totalRedstoneInteractions = world.scoreboard.getObjective("stats_redstonInteractions_");
		let totalEnteredDimensions = world.scoreboard.getObjective("stats_enteredDimension_");
		let totalEnimiesShot = world.scoreboard.getObjective("stats_projectilesHitEnemy_");
		let totalItemsReleased = world.scoreboard.getObjective("stats_itemsReleased_");
		let totalachievments = world.scoreboard.getObjective("stats_achievments_");
		let tamedScoreboard = world.scoreboard.getObjective("stats_Tamed_");
		let damageScoreboard = world.scoreboard.getObjective("stats_DamageDelt_");
		let damageTakenScoreboard = world.scoreboard.getObjective("stats_DamageTaken_");
		
		blocksBroken = [itemFormat + "Total: " + bodyFormat + getScoreIfExists(totalBlocksBroken,player)];
		blocksPlaced = [itemFormat + "Total: " + bodyFormat + getScoreIfExists(totalBlocksPlaced,player)];
		entitiesKilled = [itemFormat + "Total: " + bodyFormat + getScoreIfExists(totalKilled,player)];
		weaponKills = [itemFormat + "Total: " + bodyFormat + getScoreIfExists(weaponKillsBoard,player)];
		deaths = [itemFormat + "Total: " + bodyFormat + getScoreIfExists(totalDeaths,player)];
		enteredDimensions = [itemFormat + "Total: " + bodyFormat + getScoreIfExists(totalEnteredDimensions,player)];
		redstoneInteractions = [itemFormat + "Total: " + bodyFormat + getScoreIfExists(totalRedstoneInteractions,player)];
		enemiesShot = [itemFormat + "Total: " + bodyFormat + getScoreIfExists(totalEnimiesShot,player)];
		itemsReleased = [itemFormat + "Total: " + bodyFormat + getScoreIfExists(totalItemsReleased,player)];
		achievmentsUnlocked = [itemFormat + "Total: " + bodyFormat + getScoreIfExists(totalachievments,player)];
		tamed = [itemFormat + "Total: " + bodyFormat + getScoreIfExists(tamedScoreboard,player)];
		damage = [itemFormat + "Total: " + bodyFormat + getScoreIfExists(damageScoreboard,player)];
		damagetaken = [itemFormat + "Total: " + bodyFormat + getScoreIfExists(damageTakenScoreboard,player)];
		
		//consolidate scores
		for( let i in scoreboards){
			let tempScore=0;
			let board = scoreboards[i];
			let temp = board.displayName.split("_");
			let type = temp[0];
			let category = temp[1];
			let name = temp[2];
			if(!(name)){
				name="";
			}
			name = name.replace("minecraft:","")
			name = capitalize(name)
			switch (type){
				case "stats":
					tempScore = getScoreIfExists(board,player);
					if(name.length>0){
						switch(category){
							case "blocksBroken":
								if (!name.includes("Total")){
									blocksBroken.push(itemFormat + name + ": " + bodyFormat + tempScore.toString());
								}
								break;
							case "blocksPlaced":
								if (!name.includes("Total")){
									blocksPlaced.push(itemFormat + name+ ": " + bodyFormat + tempScore.toString());
								}
								break;
							case "entitiesKilled":
								entitiesKilled.push(itemFormat + name+ ": " + bodyFormat + tempScore.toString());
								break;
							case "weaponKills":
								weaponKills.push(itemFormat + name+ ": " + bodyFormat + tempScore.toString());
								break;
							case "Deaths":
								deaths.push(itemFormat + name+ ": " + bodyFormat + tempScore.toString());
								break;
							case "redstonInteractions":
								redstoneInteractions.push(itemFormat + name+ ": " + bodyFormat + tempScore.toString());
								break;
							case "enteredDimension":
								enteredDimensions.push(itemFormat + name+ ": " + bodyFormat + tempScore.toString());
								break;
							case "projectilesHitEnemy":
								enemiesShot.push(itemFormat + name+ ": " + bodyFormat + tempScore.toString());
								break;
							case "itemsReleased":
								itemsReleased.push(itemFormat + name+ ": " + bodyFormat + tempScore.toString());
								break;
							case "playTime":
								playTime.push(itemFormat + name+ ": " + bodyFormat + tempScore.toString());
								break;
							case "travel":
								travel.push(itemFormat + name+ ": " + bodyFormat + tempScore.toString());
								break;
							case "achievments":
								achievmentsUnlocked.push(itemFormat + name+ ": " + bodyFormat + tempScore.toString());
								break;
							case "Tamed":
								tamed.push(itemFormat + name+ ": " + bodyFormat + tempScore.toString());
								break;
							case "DamageDelt":
								damage.push(itemFormat + name+ ": " + bodyFormat + tempScore.toString());
								break;
							case "DamageTaken":
								damagetaken.push(itemFormat + name+ ": " + bodyFormat + tempScore.toString());
								break;
						}
						break;
				}
			}
		}
		
		//construct ui
		let indentSize = "    ";
		let nextLine = '\n';
		let indentNextLine = nextLine + indentSize;
		let allStats=titleFormat + scorestext.join(nextLine) + nextLine
			+ nextLine
			+ subtitleFormat + "Blocks Broken:" + bodyFormat + indentNextLine + blocksBroken.join(indentNextLine) + nextLine
			+ subtitleFormat + "Blocks Placed:" + bodyFormat + indentNextLine + blocksPlaced.join(indentNextLine) + nextLine
			+ subtitleFormat + "Entities Killed:" + bodyFormat + indentNextLine + entitiesKilled.join(indentNextLine) + nextLine
			+ subtitleFormat + "Entities Tamed:" + bodyFormat + indentNextLine + tamed.join(indentNextLine) + nextLine
			+ subtitleFormat + "Damage Delt:" + bodyFormat + indentNextLine + damage.join(indentNextLine) + nextLine
			+ subtitleFormat + "Weapon Kills:" + bodyFormat + indentNextLine + weaponKills.join(indentNextLine) + nextLine
			+ subtitleFormat + "Deaths:" + bodyFormat + indentNextLine + deaths.join(indentNextLine) + nextLine
			+ subtitleFormat + "Damage Taken:" + bodyFormat + indentNextLine + damagetaken.join(indentNextLine) + nextLine
			+ subtitleFormat + "Redstone Interactions:" + bodyFormat + indentNextLine + redstoneInteractions.join(indentNextLine) + nextLine
			+ subtitleFormat + "Portals Traveled:" + bodyFormat + indentNextLine + enteredDimensions.join(indentNextLine) + nextLine
			+ subtitleFormat + "Enimies Shot:" + bodyFormat + indentNextLine + enemiesShot.join(indentNextLine) + nextLine
			+ subtitleFormat + "Items Fired:" + bodyFormat + indentNextLine + itemsReleased.join(indentNextLine) + nextLine
			+ subtitleFormat + "Play Time:" + bodyFormat + indentNextLine + playTime.join(indentNextLine) + nextLine
			+ subtitleFormat + "Travel:" + bodyFormat + indentNextLine + travel.join(indentNextLine) + nextLine;
			+ subtitleFormat + "Achievments:" + bodyFormat + indentNextLine + achievmentsUnlocked.join(indentNextLine) + nextLine;
		let statsForm = new ActionFormData()
			.title(player.name)
			.body(allStats)
			.button("Close")
			.show(player);
	}
	debugDisplay(player){
		//title
		let debugTxt = "Additional game info";
		
		//formatting
		let titleFormat = "\u00A7d";
		let subtitleFormat = "\u00A73";
		let itemFormat = "\u00A7a";
		let bodyFormat = "\u00A7r";
		
		//items
		let lightVal = lightLevel(player);
		let biomeId =  biomeFinder(player);
		
		//consolidate scores
		let debugArrayTxt = [];
		debugArrayTxt[0] = subtitleFormat + "Dimension: " + bodyFormat + this.playerPosition(player, "dimension");
		debugArrayTxt[1] = subtitleFormat + "XYZ: " + bodyFormat + this.playerPosition(player, "xyz");
		debugArrayTxt[2] = subtitleFormat + "Block: " + bodyFormat + this.playerPosition(player, "block");
		debugArrayTxt[3] = subtitleFormat + "Block within chunk: " + bodyFormat + this.playerPosition(player, "blockInChunk");
		debugArrayTxt[4] = subtitleFormat + "Chunk: " + bodyFormat + this.playerPosition(player, "chunk");
		debugArrayTxt[5] = subtitleFormat + "Region: " + bodyFormat + this.playerPosition(player, "region");
		debugArrayTxt[6] = subtitleFormat + "Overworld coord: " + bodyFormat + this.playerPosition(player, "overworld");
		debugArrayTxt[7] = subtitleFormat + "Nether coord: " + bodyFormat + this.playerPosition(player, "nether");
		debugArrayTxt[8] = subtitleFormat + "Player spawnpoint: " + bodyFormat + this.playerRespawn(player);
		debugArrayTxt[9] = subtitleFormat + "World spawnpoint: " + bodyFormat + this.worldSpawn();
		debugArrayTxt[10] = subtitleFormat + "Facing: " + bodyFormat + this.facingDirection(player);
		debugArrayTxt[11] = subtitleFormat + "Moon phase: " + bodyFormat + this.moonCycle();
		debugArrayTxt[12] = subtitleFormat + "Time of day: " + bodyFormat + "\n    " + itemFormat + "Tick: " + bodyFormat + this.getTheTime("tick") + "\n    " + itemFormat + "Minecraft: " + bodyFormat + this.getTheTime("minecraft") + "\n    " + itemFormat + "12hr: " + bodyFormat + this.getTheTime("12hr") + "\n    " + itemFormat + "24hr: " + bodyFormat + this.getTheTime("24hr");
		debugArrayTxt[13] = subtitleFormat + "World life in ticks: " + bodyFormat + "\n    " + this.worldlife("tick");
		debugArrayTxt[14] = subtitleFormat + "World day: " + bodyFormat + this.worldlife("day");
		debugArrayTxt[15] = (biomeId == "NA" ? "" : subtitleFormat + "Light at player's head: " + bodyFormat + lightVal);
		debugArrayTxt[16] = (biomeId == "NA" ? "" : subtitleFormat + "Biome: " + bodyFormat + biomeId);
		
		//construct ui
		let indentSize = "";
		let nextLine = '\n';
		let indentNextLine = nextLine + indentSize;
		let displayText = titleFormat + debugTxt + nextLine + nextLine + debugArrayTxt.join(indentNextLine);
		
		let debugForm = new ActionFormData()
			.title(player.name)
			.body(displayText)
			.button("Close")
			.show(player);
	}
	playerPosition(player, option){
		let playerDim = player.dimension.id.replace("minecraft:", "");
		let playerPosX = player.location.x;
		let playerPosY = player.location.y;
		let playerPosZ = player.location.z;
		let playerPosTxt = "";
		
		switch(option){
			case "xyz" :
				playerPosTxt =  " " + playerPosX.toFixed(2) + ", " + playerPosY.toFixed(2) + ", " + playerPosZ.toFixed(2);
				break;
			case "block" :
				playerPosTxt =  " " + (playerPosX > 0 ? Math.floor(playerPosX) : Math.ceil(playerPosX)) + ", " + (playerPosY > 0 ? Math.floor(playerPosY) : Math.ceil(playerPosY)) + ", " + (playerPosZ > 0 ? Math.floor(playerPosZ) : Math.ceil(playerPosZ));
				break;
			case "chunk" :
				playerPosTxt = Math.floor(playerPosX / 16) + ", " + Math.floor(playerPosY / 16) + ", " + Math.floor(playerPosZ / 16);
				break;
			case "region" :
				playerPosTxt = Math.floor(Math.floor(playerPosX / 16) / 32) + ", " + Math.floor(Math.floor(playerPosZ / 16) / 32);
				break;
			case "blockInChunk" :
				playerPosTxt = Math.floor(playerPosX - (Math.floor(playerPosX / 16) * 16)) + ", " + Math.floor(playerPosZ - (Math.floor(playerPosZ / 16) * 16));
				break;
			case "dimension" :
				playerPosTxt = playerDim;
				break;
			case "nether" :
				playerPosTxt = (playerDim == "overworld" ? ((playerPosX/8).toFixed(2) + ", " + (playerPosZ/8).toFixed(2)) : "");
				break;
			case "overworld" :
				playerPosTxt = (playerDim == "nether" ? ((playerPosX*8).toFixed(2) + ", " + (playerPosZ*8).toFixed(2)) : "");
				break;
		}
		
		return playerPosTxt;
	}
	playerRespawn(player){
		if(player.getSpawnPoint()){
			let spawnDim = player.getSpawnPoint().dimension.id.replace("minecraft:", "");
			let spawnX = player.getSpawnPoint().x;
			let spawnY = player.getSpawnPoint().y;
			let spawnZ = player.getSpawnPoint().z;
			let spawnTxt = "\n        " + spawnDim + ",\n        " + spawnX + ",\n        " + spawnY + ",\n        " + spawnZ;
			
			return spawnTxt;
		}else{
			return "not set";
		}
	}
	worldSpawn(){
		let spawnX = world.getDefaultSpawnLocation().x;
		let spawnY = world.getDefaultSpawnLocation().y;
		let spawnZ = world.getDefaultSpawnLocation().z;
		let spawnTxt = " " + spawnX + ", " + spawnY + ", " + spawnZ;
		
		return spawnTxt;
	}
	facingDirection(player){
		let faceDir = player.getRotation().y;
		let faceTxt = "";
		
		switch(true){
			case (faceDir > 157.5) || (faceDir < -157.5) :
				faceTxt = "North";
				break;
			case (faceDir > -157.5) && (faceDir < -112.5) :
				faceTxt = "Northeast";
				break;
			case (faceDir > -112.5) && (faceDir < -67.5) :
				faceTxt = "East";
				break;
			case (faceDir > -67.5) && (faceDir < -22.5) :
				faceTxt = "Southeast";
				break;
			case (faceDir > -22.5) && (faceDir < 22.5) :
				faceTxt = "South";
				break;
			case (faceDir > 22.5) && (faceDir < 67.5) :
				faceTxt = "Southwest";
				break;
			case (faceDir > 67.5) && (faceDir < 112.5) :
				faceTxt = "West";
				break;
			case (faceDir > 112.5) && (faceDir < 157.5) :
				faceTxt = "Northwest";
				break;
		}
		
		return faceTxt;
	}
	moonCycle(){
		let moonPh = world.getMoonPhase();
		let moonTxt = "";
		
		switch(moonPh){
			case 0 :
				moonTxt = "FullMoon";
				break;
			case 1 :
				moonTxt = "WaningGibbous";
				break;
			case 2 :
				moonTxt = "FirstQuarter";
				break;
			case 3 :
				moonTxt = "WaningCrescent";
				break;
			case 4 :
				moonTxt = "NewMoon";
				break;
			case 5 :
				moonTxt = "WaxingCrescent";
				break;
			case 6 :
				moonTxt = "LastQuarter";
				break;
			case 7 :
				moonTxt = "WaxingGibbous";
				break;
		}
		
		return moonTxt;
	}
	worldlife(unit){
		let lifeVal = 0;
		
		switch(unit){
			case "tick" :
				lifeVal = world.getAbsoluteTime();
				break;
			case "day" :
				lifeVal = world.getDay();
				break;
		}
		
		return lifeVal;
	}
	getTheTime(style){
		let timeVal = world.getTimeOfDay();
		let timeOffset = timeVal + 6000
		let timeHour = 0;
		let timeMin = 0;
		let timePeriod = "";
		let timeClock = "";
		
		switch(style){
			case "tick" :
				timeClock = timeVal;
				break;
			case "12hr" :
				timeHour = Math.floor(0.001 * (timeOffset % 12000));
				timeMin = Math.floor(0.06 * (timeOffset % 1000));
				timePeriod = (Math.floor(0.001 * (timeOffset % 24000)) < 12 ? " am" : " pm");
				timeClock = (timeHour == 0 ? "12" : timeHour) + " : " +  (timeMin < 10 ? "0" : "") + timeMin + timePeriod;
				break;
			case "24hr" :
				timeHour = Math.floor(0.001 * (timeOffset % 24000));
				timeMin = Math.floor(0.06 * (timeOffset % 1000));
				timeClock = timeHour + " : " +  (timeMin < 10 ? "0" : "") + timeMin;
				break;
			case "minecraft" :
				timeHour = Math.floor(0.001 * (timeVal % 24000));
				timeMin = Math.floor(0.06 * (timeVal % 1000));
				timeClock = timeHour + " : " +  (timeMin < 10 ? "0" : "") + timeMin;
				break;
		}
		
		return timeClock;
	}
}

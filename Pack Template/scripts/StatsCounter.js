import { world, system } from '@minecraft/server';
import {ActionFormData, ActionFormResponse } from "@minecraft/server-ui";
import { achievements, advancements } from "textObjects";
import {achievementHandler} from "achievementHandler"
import {biomeFinder, lightLevel} from "playerDependent"

var blockBreaks = {}
var blocksUsed = {}
const debugToggle = true;
timer10Sec();
timer1Min();
timer1Day();
var achievementTracker = new achievementHandler(achievements);
var advancementTracker = new achievementHandler(advancements);

//subscriptions----------------------------------------
world.afterEvents.buttonPush.subscribe(event =>{ 
	buttonPushed(event);
});
world.afterEvents.entityDie.subscribe(event =>{ 
	entityDied(event);
});
world.afterEvents.entityHealthChanged.subscribe(event =>{ 
	entityChangeHealth(event);
});
world.afterEvents.entityLoad.subscribe(event =>{ 
	loadedEntity(event);
});
world.afterEvents.entitySpawn.subscribe(event =>{ 
	spawnedEntity(event);
});
world.afterEvents.itemCompleteUse.subscribe(event=>{
	itemComplete(event);
});
world.afterEvents.itemUse.subscribe(event=>{
	statStick(event)
	useItem(event)
})
world.afterEvents.itemUseOn.subscribe(event=>{
	useItemOn(event)
});
world.afterEvents.itemReleaseUse.subscribe(event=>{
	itemRelease(event);
});
world.afterEvents.itemStopUseOn.subscribe(event=>{
	itemStopOn(event);
});
world.afterEvents.pressurePlatePush.subscribe(event=>{
	pleatePressed(event);
});
world.afterEvents.projectileHitBlock.subscribe(event=>{
	 projectileHitBlock(event);
});
world.afterEvents.leverAction.subscribe(event=>{
	leverFlipped(event);
});
world.afterEvents.playerBreakBlock.subscribe(event=>{
	blockBroken(event);
});
world.beforeEvents.playerBreakBlock.subscribe(event=>{
	preBreak(event);
});
world.afterEvents.playerDimensionChange.subscribe(event =>{ 
	changedDimension(event);
});
world.afterEvents.playerPlaceBlock.subscribe(event=>{
	blockPlaced(event);
});
world.afterEvents.playerSpawn.subscribe(event =>{ 
	initSpawn(event);
});
world.afterEvents.projectileHitEntity.subscribe(event =>{ 
	hitByProjectile(event);
});
world.afterEvents.targetBlockHit.subscribe(event=>{
	targetHit(event);
});
world.afterEvents.entityHurt.subscribe(event=>{
	onHurtEvent(event);
});
world.afterEvents.dataDrivenEntityTrigger.subscribe(event=>{
	if(event.entity.typeId!="minecraft:player"){
		if(event.eventId=="minecraft:on_tame"){
			tameEvents(event)
		}
		if(event.eventId=="minecraft:on_trust"){
			tameEvents(event)
		}
	}
});
//end subscriptions----------------------------------------

//ui functions----------------------------------------
function statList(player){
	let statForm = new ActionFormData()
		.title(player.name)
		.body(statListBody(player))
		.button("Scores")
		.button("Objectives");
		
		if(player.hasTag("debug")||debugToggle){
			statForm.button("Debug");
		}
		
		statForm.show(player).then((response) => {
			switch(response.selection){
				case 0 :
					blockStatsDisplay(player)
					break;
				case 1 :
					objectivesStatsDisplay(player);
					break;
				case 2 :
					debugDisplay(player);
					break;
			}
		});
}
function statListBody(player){
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
function objectivesStatsDisplay(player){
    //title
	let scoresText= ["Objectives"];
	
    //formatting
	let titleFormat = "\u00A7d";
	let subtitleFormat = "\u00A73";
	let itemFormat = "\u00A7r";
	let bodyFormat = "\u00A7a";
	
    //items
	let scoreboards = world.scoreboard.getObjectives();
	let tempScore = 0;
	let achievement = [];
	let advancement = [];
	
    //consolidate scores
	for( let i in scoreboards){
		let board = scoreboards[i];
		let temp = board.displayName.split("_");
		let type = temp[0];
		let category = temp[1];
		let name = temp[2];
		let boolPos = "\u2714";
		let boolNeg = " ";
		let lineWrap = 28;
		
		switch (type){
			case "objectives":
				tempScore = getScoreIfExists(board,player);
				switch(category){
					case "achievement":
						if (!name.includes("total") && name.length>1){
							achievement.push(itemFormat + name+ ": " + bodyFormat + tempScore.toString().replace("0", boolNeg).replace("1", boolPos));
						}
						break;
					case "advancement":
						if (!name.includes("total") && name.length>1){
							advancement.push(itemFormat + name+ ": " + bodyFormat + tempScore.toString().replace("0", boolNeg).replace("1", boolPos));
						}
						break;
				}
				break;
		}
	}
	
    //construct ui
	let indentSize = "";
	let nextLine = '\n';
	let indentNextLine = nextLine + indentSize;
	let allStats=titleFormat + scoresText.join(nextLine) + nextLine
		+ nextLine
		+ subtitleFormat + "Achievements:" + bodyFormat + indentNextLine + achievement.join(indentNextLine) + nextLine
		+ nextLine
		+ subtitleFormat + "Advancements:" + bodyFormat + indentNextLine + advancement.join(indentNextLine) + nextLine;
	let statsForm = new ActionFormData()
		.title(player.name)
		.body(allStats)
		.button("Close")
		.show(player);
}
function blockStatsDisplay(player){
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
	let travel=[];
	
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
	
	blocksBroken = [itemFormat + "Total: " + bodyFormat + getScoreIfExists(totalBlocksBroken,player)];
	blocksPlaced = [itemFormat + "Total: " + bodyFormat + getScoreIfExists(totalBlocksPlaced,player)];
	entitiesKilled = [itemFormat + "Total: " + bodyFormat + getScoreIfExists(totalKilled,player)];
	weaponKills = [itemFormat + "Total: " + bodyFormat + getScoreIfExists(weaponKillsBoard,player)];
	deaths = [itemFormat + "Total: " + bodyFormat + getScoreIfExists(totalDeaths,player)];
	enteredDimensions = [itemFormat + "Total: " + bodyFormat + getScoreIfExists(totalEnteredDimensions,player)];
	redstoneInteractions = [itemFormat + "Total: " + bodyFormat + getScoreIfExists(totalRedstoneInteractions,player)];
	enemiesShot = [itemFormat + "Total: " + bodyFormat + getScoreIfExists(totalEnimiesShot,player)];
	itemsReleased = [itemFormat + "Total: " + bodyFormat + getScoreIfExists(totalItemsReleased,player)];
	
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
		switch (type){
			case "stats":
				tempScore = getScoreIfExists(board,player);
				if(name.length>0){
					switch(category){
						case "blocksBroken":
							if (!name.includes("total")){
								blocksBroken.push(itemFormat + name+ ": " + bodyFormat + tempScore.toString());
							}
							break;
						case "blocksPlaced":
							if (!name.includes("total")){
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
		+ subtitleFormat + "Weapon Kills:" + bodyFormat + indentNextLine + weaponKills.join(indentNextLine) + nextLine
		+ subtitleFormat + "Deaths:" + bodyFormat + indentNextLine + deaths.join(indentNextLine) + nextLine
		+ subtitleFormat + "Redstone Interactions:" + bodyFormat + indentNextLine + redstoneInteractions.join(indentNextLine) + nextLine
		+ subtitleFormat + "Portals Traveled:" + bodyFormat + indentNextLine + enteredDimensions.join(indentNextLine) + nextLine
		+ subtitleFormat + "Enimies Shot:" + bodyFormat + indentNextLine + enemiesShot.join(indentNextLine) + nextLine
		+ subtitleFormat + "Items Fired:" + bodyFormat + indentNextLine + itemsReleased.join(indentNextLine) + nextLine
		+ subtitleFormat + "Play Time:" + bodyFormat + indentNextLine + playTime.join(indentNextLine) + nextLine
		+ subtitleFormat + "Travel:" + bodyFormat + indentNextLine + travel.join(indentNextLine) + nextLine;
	let statsForm = new ActionFormData()
		.title(player.name)
		.body(allStats)
		.button("Close")
		.show(player);
}
function debugDisplay(player){
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
	debugArrayTxt[0] = subtitleFormat + "Dimension: " + bodyFormat + playerPosition(player, "dimension");
	debugArrayTxt[1] = subtitleFormat + "XYZ: " + bodyFormat + playerPosition(player, "xyz");
	debugArrayTxt[2] = subtitleFormat + "Block: " + bodyFormat + playerPosition(player, "block");
	debugArrayTxt[3] = subtitleFormat + "Block within chunk: " + bodyFormat + playerPosition(player, "blockInChunk");
	debugArrayTxt[4] = subtitleFormat + "Chunk: " + bodyFormat + playerPosition(player, "chunk");
	debugArrayTxt[5] = subtitleFormat + "Region: " + bodyFormat + playerPosition(player, "region");
	debugArrayTxt[6] = subtitleFormat + "Overworld coord: " + bodyFormat + playerPosition(player, "overworld");
	debugArrayTxt[7] = subtitleFormat + "Nether coord: " + bodyFormat + playerPosition(player, "nether");
	debugArrayTxt[8] = subtitleFormat + "Player spawnpoint: " + bodyFormat + playerRespawn(player);
	debugArrayTxt[9] = subtitleFormat + "World spawnpoint: " + bodyFormat + worldSpawn();
	debugArrayTxt[10] = subtitleFormat + "Facing: " + bodyFormat + facingDirection(player);
	debugArrayTxt[11] = subtitleFormat + "Moon phase: " + bodyFormat + moonCycle();
	debugArrayTxt[12] = subtitleFormat + "Time of day: " + bodyFormat + "\n    " + itemFormat + "Tick: " + bodyFormat + getTheTime("tick") + "\n    " + itemFormat + "Minecraft: " + bodyFormat + getTheTime("minecraft") + "\n    " + itemFormat + "12hr: " + bodyFormat + getTheTime("12hr") + "\n    " + itemFormat + "24hr: " + bodyFormat + getTheTime("24hr");
	debugArrayTxt[13] = subtitleFormat + "World life in ticks: " + bodyFormat + "\n    " + worldlife("tick");
	debugArrayTxt[14] = subtitleFormat + "World day: " + bodyFormat + worldlife("day");
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
//end ui functions----------------------------------------

//event functions----------------------------------------
function preBreak(event){
	blockBreaks["L"+event.block.x+" "+event.block.y+" "+event.block.z]=processBlockTags(event.block.getTags())
}
function blockBroken(event){
	let player = event.player;
	let blockData = blockBreaks["L"+event.block.x+" "+event.block.y+" "+event.block.z]
	if(!blockData){
		blockData="None"
	}
	delete blockBreaks["L"+event.block.x+" "+event.block.y+" "+event.block.z]
	if (blockData!=undefined){
		addToScore("stats_blocksBroken_", blockData, player)
	}
	//[achievement] Getting Wood | Punch a tree until a block of wood pops out. | Pick up a log from the ground.
	if(blockData.includes("Log")){
		if(!achievementTracker.checkAchievment("GettingWood",player)){
			achievementTracker.setAchievment("GettingWood",player)
		}
	}
	addToScore("stats_blocksBroken_", "total", player);
}
function blockPlaced(event){
	let player = event.player;
	let blockData= processBlockTags(event.block.getTags())
	if (blockData!=undefined){
		addToScore("stats_blocksPlaced_", blockData, player)
	}
	addToScore("stats_blocksPlaced_", "total", player);
}
function buttonPushed(event){
	if(event.source.typeId=="minecraft:player"){
		let type = "Stone Buttons"
		if (event.block.getTags().includes("wood")){
			type = "Wood Buttons"
		}
		addToScore("stats_redstonInteractions_",type, event.source)
	}
}
function pleatePressed(event){
	if(event.source.typeId=="minecraft:player"){
		let type = "Weighted Pressure Plate"
		if (event.block.getTags().includes("stone")){
			type = "Stone Pressure Plate"
		}
		if (event.block.getTags().includes("wood")){
			type = "Wood Pressure Plate"
		}
		addToScore("stats_redstonInteractions_",type, event.source)
	}
}
function changedDimension(event){
	let player = event.player;
	let getDimTo = event.toDimension.id.replace("minecraft:","");
	let getDimFrom = event.fromDimension.id.replace("minecraft:","");
	let locationTo = event.toLocation;
	let locationFrom = event.fromLocation;
	
	switch(getDimTo){
		case "nether":
			addToScore("stats_enteredDimension_","Nether",player);
			if(!advancementTracker.checkAchievment("WeNeedtoGoDeeper", player)){
				achievementTracker.setAchievment("IntoTheNether", player);//[achievement] Into The Nether | Construct a Nether Portal. | Light a nether portal.
				advancementTracker.setAchievment("WeNeedtoGoDeeper", player);//[advancement] We Need to Go Deeper | Build, light and enter a Nether Portal | Enter the Nether dimension.
				advancementTracker.setAchievment("Nether", player);//[advancement] Nether | Bring summer clothes | Enter the Nether dimension.
			}
			player.setDynamicProperty("netherEnterX", Math.floor(locationFrom.x));
			player.setDynamicProperty("netherEnterZ", Math.floor(locationFrom.z));
			break;
		case "the_end":
			addToScore("stats_enteredDimension_","The End", player);
			if(!advancementTracker.checkAchievment("TheEnd", player)){
				achievementTracker.setAchievment("TheEnd", player);//[achievement] The End? | Enter an End Portal | Enter a stronghold End Portal activated with all twelve eyes of ender.
				advancementTracker.setAchievment("TheEnd", player);//[advancement] The End? | Enter the End Portal | Enter the End dimension.
				advancementTracker.setAchievment("TheEnd2", player);//[advancement] The End | Or the beginning? | Enter the End dimension.
			}
			break;
		case "overworld":
			addToScore("stats_enteredDimension_","Overworld", player);
			if(advancementTracker.checkAchievment("TheEnd", player)){
				if(!achievementTracker.checkAchievment("ExitTheEnd", player)){
					achievementTracker.setAchievment("ExitTheEnd", player);//[achievement] The End | Kill the Enderdragon [sic] | Enter the end exit portal.
				}
			}
			if(getDimFrom == "nether"){
				let x1 = player.getDynamicProperty("netherEnterX");
				let z1 = player.getDynamicProperty("netherEnterZ");
				let x2 = Math.floor(locationTo.x);
				let z2 = Math.floor(locationTo.z);
				let portalDist = calculateDistance(x1, z1, x2, z2);
				
				if(portalDist >= 7000){
					if(!advancementTracker.checkAchievment("SubspaceBubble", player)){
						advancementTracker.setAchievment("SubspaceBubble", player);//[advancement] Subspace Bubble | Use the Nether to travel 7 km in the Overworld | Use the Nether to travel between 2 points in the Overworld with a minimum horizontal euclidean distance of 7000 blocks between each other, which is 875 blocks in the Nether.
					}
				}
			}
			break;
	}
}
function entityDied(event){
	const victim = event.deadEntity
	const cause = event.damageSource
	let victimName= victim.typeId.replace("minecraft:","")
	if(event.damageSource.damagingEntity){
		const killer = event.damageSource.damagingEntity
		if(killer.typeId == "minecraft:player"){
			let victimType = victim.typeId.replace("minecraft:","").replace("_"," ")
			addToScore("stats_entitiesKilled_",victimType, killer)
			const equipment=getequipped(killer)
			addToScore("stats_weaponKills_",equipment["Mainhand"].replace("_"," "), killer)
			entityKills(victim,killer,cause.cause,equipment["Mainhand"])
			const projectile=event.damageSource.damagingProjectile
			if(projectile){
				if(projectile.typeId=="minecraft:fireball"){
					if(victimName=="ghast"){
						//[achievement] Return to Sender | Destroy a Ghast with a fireball. | Kill a ghast using a ghast fireball.
						//[advancement] Return to Sender | Destroy a Ghast with a fireball | Kill a ghast by deflecting a ghast fireball back into it via hitting or shooting a projectile at the fireball.
						if(!advancementTracker.checkAchievment("ReturntoSender",killer)){
							advancementTracker.setAchievment("ReturntoSender",killer)
							achievementTracker.setAchievment("ReturntoSender",killer)
						}
					}
				}
			}
		}
	}
	switch(victimName){
		case "player" :
			addToScore("stats_Deaths_",event.damageSource.cause, victim);
			break;
		case "ender_dragon" :
			world.setDynamicProperty("dragonKill", 1);
			break;
		//[achievement] The Beginning. | Kill the Wither | Be within a 100.9×100.9×203.5 cuboid centered on the Wither when it drops the nether star
		case "wither":
			const killer = event.damageSource.damagingEntity
			const witherX=killer.location.x
			const witherY=killer.location.y
			const witherZ=killer.location.z
			for(let player of world.getAllPlayers())
				if (player.dimension.id == killer.dimension.id){
					let inrange = Math.abs(player.location.x-witherX)<50.5
					inrange = inrange && Math.abs(player.location.x-witherX)<50.5
					inrange = inrange &&Math.abs(player.location.x-witherX)<101.75
					if (inrange &&!achievementTracker.checkAchievment("TheBeginningKill",player)){
						achievementTracker.setAchievment("TheBeginningKill",player)
					}
				}
			break;
	}
}
function entityChangeHealth(event){
	let source = event.entity;
	
	if(source.typeId == "minecraft:player"){
		let oldVal = event.oldValue;
		let newVal = event.newValue;
		
		if(oldVal <= 0 && (newVal >= (oldVal +1))){
			usingItems("totem_of_undying", source);
		}
	}
}
function hitByProjectile(event){
	let projectile = event.projectile.typeId.replace("minecraft:","");
	let source = event.source;
	if(source && (source.typeId == "minecraft:player")){
		switch(projectile){
			case "arrow" :
				weaponsToolsArmor(projectile, source);
				addToScore("stats_projectilesHitEnemy_",getArrowType(event.projectile),source)
				break;
			case "thrown_trident" :
				weaponsToolsArmor(projectile, event.source);
				addToScore("stats_projectilesHitEnemy_","Trident",source)
				break;
		}
	}
}
function getArrowType(arrow){
	//cant do this yet...
	return "Arrow"
}
function initSpawn(event){
	let player = event.player;
	
	if(!player.getDynamicProperty("1spawn") == 1){//verify the player hasn't spawned previously	
		player.setDynamicProperty("initialX", Math.floor(player.location.x));//record player initial location x
		player.setDynamicProperty("initialZ", Math.floor(player.location.z));//record player initial location z
		player.setDynamicProperty("blockRun", 0);//record player initial location z
		player.setDynamicProperty("1spawn", 1);//add tag to record that player has already spawned initially
	}
}
function itemComplete(event){
	//to-do--------------------
		//[achievement] Castaway | Eat nothing but dried kelp for three in-game days | Eat dried kelp once; in the following three in-game days, eat nothing but dried kelp.
		//[advancement] A Balanced Diet | Eat everything that is edible, even if it's not good for you | Eat each of these 40 foods:, Apple, Baked Potato, Beetroot, Beetroot Soup, Bread, Carrot, Chorus Fruit, Cooked Chicken, Cooked Cod, Cooked Mutton, Cooked Porkchop, Cooked Rabbit, Cooked Salmon, Cookie, Dried Kelp, Enchanted Golden Apple, Glow Berries, Golden Apple, Golden Carrot, Honey Bottle, Melon Slice, Mushroom Stew, Poisonous Potato, Potato, Pufferfish, Pumpkin Pie, Rabbit Stew, Raw Beef, Raw Chicken, Raw Cod, Raw Mutton, Raw Porkchop, Raw Rabbit, Raw Salmon, Rotten Flesh, Spider Eye, Steak, Suspicious Stew, Sweet Berries, Tropical Fish, Other foods and consumables can be eaten, but are ignored for this advancement.
	//done--------------------
	let player = event.source;
	let itemName = event.itemStack.typeId.replace("minecraft:","");
	//[advancement] Husbandry | The world is full of friends and food | Consume anything that can be consumed.
	if(!advancementTracker.checkAchievment("Husbandry",player)){
		advancementTracker.setAchievment("Husbandry",player)
	}
	switch(itemName){
		case "crossbow" :
			player.setDynamicProperty("chargeCross", 1);
			break;
		//[achievement] Overpowered | Eat an Enchanted Apple | Eat an enchanted apple.
		case "enchanted_golden_apple":
			if(!achievementTracker.checkAchievment("Overpowered",player)){
				achievementTracker.setAchievment("Overpowered",player)
			}
			break;
		//[achievement] Pork Chop | Cook and eat a pork chop. | —
		case "cooked_porkchop":
			if(!achievementTracker.checkAchievment("PorkChop",player)){
				achievementTracker.setAchievment("PorkChop",player)
			}
			break;
		//[achievement] Rabbit Season | Cook and Eat Rabbit Meat | —
		case "cooked_rabbit":
			if(!achievementTracker.checkAchievment("RabbitSeason",player)){
				achievementTracker.setAchievment("RabbitSeason",player)
			}
			break;
		case "rotten_flesh":
		//[achievement] Iron Belly | Stop starvation using Rotten Flesh. | Eat a piece of rotten flesh while starving (zero hunger points).
		//Needs a hunger or saturation component check
			if(false){
				if(!achievementTracker.checkAchievment("RabbitSeason",player)){
					achievementTracker.setAchievment("RabbitSeason",player)
				}
			}
			break;
	}
}
function itemRelease(event){
	let player = event.source;
	let itemName = event.itemStack.typeId.replace("minecraft:","");
	
	switch(itemName){
		case "bow" :
			addToScore("stats_itemsReleased_","Bow",player);
			player.setDynamicProperty("shotBow", 1);
			system.runTimeout(() => {
				player.setDynamicProperty("shotBow", 0);
			}, 30);
			break;
		case "trident":
			addToScore("stats_itemsReleased_","Trident",player);
			player.setDynamicProperty("forkThrow", 1);
			system.runTimeout(() => {
				player.setDynamicProperty("forkThrow", 0);
			}, 30);
			break;
	}
}
function itemStopOn(event){
	let player = event.source;
	let itemName = event.itemStack.typeId.replace("minecraft:","");
	let blockTag = event.block.getTags();
	
	switch(itemName){
		case "oak_sign" :
			usingItems(itemName, player);
			break;
		case "beetroot_seeds" ://*fall through*
		case "melon_seeds" ://*fall through*
		case "pumpkin_seeds" ://*fall through*
		case "wheat_seeds" ://*fall through*
		case "pitcher_pod" ://*fall through*
		case "torchflower_seeds" :
			if (blockTag.includes("dirt")){
				usingItems(itemName, player);
			}
			break;
		//case "nether_wart" :
			//console.warn(blockComponent)
			//break;
		case "glow_ink_sac" :
			if (blockTag.includes("text_sign")){
				usingItems(itemName, player);
			}
			break;
	}
}
function leverFlipped(event){
	addToScore("stats_redstonInteractions_","Lever", event.player);
}
function loadedEntity(event){
	let entity = event.entity;
	let entityName = entity.typeId.replace("minecraft:", "");
	//when bastion mobs load, search for nearby players and give them an achievement
	if(entityName == "piglin_brute"){
		let closePlayers = entity.dimension.getPlayers({
			maxDistance: 100,
			location: {x: entity.location.x, y: entity.location.y, z: entity.location.z}
		});
		
		for(var i = 0; i < closePlayers.length; i++){
			if(!advancementTracker.checkAchievment("ThoseWeretheDays", closePlayers[i])){
				advancementTracker.setAchievment("ThoseWeretheDays", closePlayers[i]);//[advancement] Those Were the Days | Enter a Bastion Remnant | —
			}
		}
	}
}
function spawnedEntity(event){
	let entity = event.entity;
	let entityName = entity.typeId.replace("minecraft:","");
	switch(entityName){
	    //when fortress mobs spawn, search for nearby players and give them an achievement
		case "blaze" ://*fall through*
		case "wither_skeleton" :{
			let closePlayers = entity.dimension.getPlayers({
				maxDistance: 50,
				location: {x: entity.location.x, y: entity.location.y, z: entity.location.z}
			});
			
			for(var i = 0; i < closePlayers.length; i++){
				if(!advancementTracker.checkAchievment("ATerribleFortress", closePlayers[i])){
					advancementTracker.setAchievment("ATerribleFortress", closePlayers[i]);//[advancement] A Terrible Fortress | Break your way into a Nether Fortress | Enter a nether fortress.
				}
			}
			break;
		}
	    //check for player spawned mobs
		case "iron_golem" ://*fall through*
		case "wither" :
			let playersClosest = entity.dimension.getPlayers({
				closest: 1,
				location: {x: entity.location.x, y: entity.location.y, z: entity.location.z}
			});
			
			spawnAndBreed(entityName, playersClosest[0]);
			break;
		
		case "ender_dragon" :
			let closePlayers = entity.dimension.getPlayers({
				maxDistance: 192,
				location: {x: entity.location.x, y: entity.location.y, z: entity.location.z}
			});
			
			for(var i = 0; i < closePlayers.length; i++){
				spawnAndBreed(entityName, closePlayers[i]);
			}
			break;
		case "villager_v2":
				//[achievement] Zombie Doctor | Cure a zombie villager. | Throw a splash potion of weakness at a zombie villager and give it a golden apple (by facing the zombie and pressing the use key with a golden apple in your hand)
			if(event.cause=="Transformed"){
				if(!achievementTracker.checkAchievment("ZombieDoctor", closePlayers[i])){
					achievementTracker.setAchievment("ZombieDoctor", closePlayers[i]);//[advancement] A Terrible Fortress | Break your way into a Nether Fortress | Enter a nether fortress.
				}
			}
			break;
		case "witch":
			if(event.cause=="Transformed"){
				if(!advancementTracker.checkAchievment("VeryVeryFrightening", closePlayers[i])){
					advancementTracker.setAchievment("VeryVeryFrightening", closePlayers[i]);//[advancement] A Terrible Fortress | Break your way into a Nether Fortress | Enter a nether fortress.
				}
			}
			break
		
	}
	//check for bred mobs
	if(event.cause == "Born"){
		let playersClosest = entity.dimension.getPlayers({
			closest: 1,
			location: {x: entity.location.x, y: entity.location.y, z: entity.location.z}
		});
		
		spawnAndBreed(entityName, playersClosest[0]);
	}
}
function statStick(event){
	let player = event.source;
	let itemName = event.itemStack.typeId.replace("minecraft:", "");
	let itemTag = event.itemStack.nameTag;
	
	if(itemName == "stick" && (itemTag == "statStick")){
		propertyToScore(player)
		statList(player);
	}
}
function projectileHitBlock(event){
	let shooter = event.source;
	let projectile = event.projectile.typeId.replace("minecraft:","");
	
	if(shooter){
		if(shooter.typeId=="minecraft:player"){
			let player = shooter
			let block = event.getBlockHit().block;
			
			if(block.isvalid){
				if(block.permutation.matches("minecraft:target")){
					addToScore("stats_redstonInteractions_","Target Blocks Hit",shooter)
				}
			}
			if(projectile == "ender_pearl"){
				pearlThrow(player)
			}
		}
	}
}
function targetHit(event){
	let power = event.redstonePower;
	
	if(power == 15){
		let closePlayers = event.dimension.getPlayers({
			maxDistance: 100,
			location: {x: event.hitVector.x, y: event.hitVector.y, z: event.hitVector.z}
		});
		let farPlayers = event.dimension.getPlayers({
			minDistance: 30,
			maxDistance: 100,
			location: {x: event.hitVector.x, y: event.hitVector.y, z: event.hitVector.z}
		});
		var i;
		
		for(i = 0; i < closePlayers.length; i++){
			if((closePlayers[i].getDynamicProperty("shotBow") == 1)
			    ||(closePlayers[i].getDynamicProperty("snowThrow") == 1)
			    ||(closePlayers[i].getDynamicProperty("shotCross") == 1)
			    ||(closePlayers[i].getDynamicProperty("forkThrow") == 1)){
				weaponsToolsArmor("target", closePlayers[i]);
			}
		}
		for(i = 0; i < farPlayers.length; i++){
			if((farPlayers[i].getDynamicProperty("shotBow") == 1)
			    ||(farPlayers[i].getDynamicProperty("snowThrow") == 1)
			    ||(farPlayers[i].getDynamicProperty("shotCross") == 1)
			    ||(farPlayers[i].getDynamicProperty("forkThrow") == 1)){
				weaponsToolsArmor("targetFrom30", farPlayers[i]);
			}
		}
	}
}
function useItemOn(event){
	const itemUsed = event.itemStack.typeId.replace("minecraft:" , "")
	const blockInfo = processBlockTags(event.block.getTags())
	const player = event.source
	//Needs an update when Block.typeId is added
	if(blockInfo.includes("Copper")){
		//[achievement] Wax on, Wax off | Apply and remove Wax from all the Copper blocks!!! | Wax and de-wax each oxidation stage of all 4 Copper Blocks in the game, which include cut copper blocks, stairs, & slabs.
		if (itemUsed.includes("axe")){
			//[advancement] Wax Off | Scrape Wax off of a Copper block! | Use an axe to revert a waxed copper block.
			if(!advancementTracker.checkAchievment("WaxOff",player)){
				advancementTracker.setAchievment("WaxOff",player)
			}
			if(advancementTracker.checkAchievment("WaxOn",player)){
				if(!achievementTracker.checkAchievment("Waxon,Waxoff",player)){
					achievementTracker.setAchievment("Waxon,Waxoff",player)
				}
			}
		}
		if (itemUsed == "honeycomb"){
			//[advancement] Wax On | Apply Honeycomb to a Copper block! | Use a honeycomb on a copper block.
			if(!advancementTracker.checkAchievment("WaxOn",player)){
				advancementTracker.setAchievment("WaxOn",player)
			}
			if(advancementTracker.checkAchievment("WaxOff",player)){
				if(!achievementTracker.checkAchievment("Waxon,Waxoff",player)){
					achievementTracker.setAchievment("Waxon,Waxoff",player)
				}
				
			}
		}
	}
}
function useItem(event){
	let player = event.source;
	let itemName = event.itemStack.typeId.replace("minecraft:","");
	
	switch(itemName){
		case "crossbow" :
			if(player.getDynamicProperty("chargeCross") == 1){
				weaponsToolsArmor(itemName, player);
				addToScore("stats_itemsReleased_","Crossbow",player);
				player.setDynamicProperty("shotCross", 1);
				system.runTimeout(() => {
					player.setDynamicProperty("shotCross", 0);
				}, 30);
				player.setDynamicProperty("chargeCross", 0);
			}
			break;
		case "fishing_rod" :
			weaponsToolsArmor(itemName, player);
			break;
		case "snowball" :
			player.setDynamicProperty("snowThrow", 1);
			system.runTimeout(() => {
				player.setDynamicProperty("snowThrow", 0);
			}, 40);
			break;
		case "ender_pearl" :
			player.setDynamicProperty("pearlThrowX", Math.floor(player.location.x));
			player.setDynamicProperty("pearlThrowZ", Math.floor(player.location.z));
			break;
	}
}
//end event functions----------------------------------------

//stat functions----------------------------------------
function overworldBlocksTravelled(player){
	let blkDist = player.getDynamicProperty("blockRun");
	
	if(player.dimension.id == "minecraft:overworld"){
		let x1 = player.getDynamicProperty("blockRunX");
		let z1 = player.getDynamicProperty("blockRunZ");
		
		if(blkDist == 0){//if first time, calculate from initial spawn location
			x1 = player.getDynamicProperty("initialX");
			z1 = player.getDynamicProperty("initialZ");
		}
		let x2 = Math.floor(player.location.x);
		let z2 = Math.floor(player.location.z);
		blkDist = blkDist + calculateDistance(x1, z1, x2, z2);
		
		player.setDynamicProperty("blockRun", blkDist);
		player.setDynamicProperty("blockRunX", x2);
		player.setDynamicProperty("blockRunZ", z2);
	}
	
	return blkDist;
}
//end stat functions----------------------------------------

//achievement and advancement functions----------------------------------------
function blockInteractions(item,Block){
	//to-do--------------------
		//[achievement] Bee our guest | Use a Campfire to collect Honey from a Beehive using a Bottle without aggravating the bees. | —
		//[achievement] Disenchanted | Use a Grindstone to get experience from an enchanted item. | —
		//[achievement] Freight Station | Use a Hopper to move an item from a Chest Minecart to a Chest. | —
		//[achievement] One Pickle, Two Pickle, Sea Pickle, Four | Place four Sea Pickles in a group | —
		//[achievement] Pot Planter | Craft and place a Flower Pot. | —
		//[achievement] Me Gold! | Dig up a buried treasure | Open a buried treasure chest
		//[achievement] Sneak 100 | Sneaking [sic] next to a Sculk Sensor without triggering it | Sneak next to a Sculk Sensor or Warden without triggering or aggravating it.
		//[achievement] Sound the Alarm! | Ring the bell with a hostile enemy in the village. | —
		//[achievement] Sticky Situation | Slide down a honey block to slow your fall. | —
		//[achievement] Tie Dye Outfit | Use a cauldron to dye all 4 unique pieces of leather armor. | —
		//[achievement] Top of the World | Place scaffolding to the world limit. | Place a scaffolding at the world height limit.
		//[achievement] Total Beelocation | Move and place a Bee Nest, with 3 bees inside, using Silk Touch. | —
		//[achievement] Trampoline | Bounce 30 blocks upward off a slime block. | —
		//[advancement] Bee Our Guest | Use a Campfire to collect Honey from a Beehive using a Glass Bottle without aggravating the Bees | Use a glass bottle on a beehive or bee nest while not angering the bees inside.
		//[advancement] Country Lode, Take Me Home | Use a Compass on a Lodestone | —
		//[advancement] Enchanter | Enchant an item at an Enchanting Table | Insert an item in an enchanting table, then apply an enchantment.
		//[advancement] Not Quite ""Nine"" Lives | Charge a Respawn Anchor to the maximum | —
		//[advancement] Sneak 100 | Sneak near a Sculk Sensor or Warden to prevent it from detecting you | Sneak within 8 blocks from a sculk sensor, or 16 blocks from a warden.
		//[advancement] Sticky Situation | Jump into a Honey Block to break your fall | Collide on a vertical side of a honey block when in air.
		//[advancement] Sweet Dreams | Sleep in a Bed to change your respawn point | Lie down in a bed. The advancement is granted as soon as the player is in the bed, even if the player does not successfully sleep.
		//[advancement] Total Beelocation | Move a Bee Nest, with 3 Bees inside, using Silk Touch | —
		//[advancement] War Pigs | Loot a Chest in a Bastion Remnant | Open a naturally generated, never-before opened chest in a bastion remnant.

		//done--------------------
}
function craftAndCook(){
	//to-do--------------------
		//[achievement] Alternative Fuel | Power a furnace with a kelp block | This achievement is awarded only if the dried kelp block is put into the furnace's fuel slot manually, not via redstone components such as hoppers.
		//[achievement] Super Fuel | Power a Furnace with Lava | —		
		//[achievement] Local Brewery | Brew a potion. | Pick up a potion from a brewing stand potion slot. An already-created potion placed and removed qualifies.
		//[advancement] Local Brewery | Brew a Potion | Pick up an item from a brewing stand potion slot. This does not need to be a potion. Water bottles or even glass bottles can also trigger this advancement.[3]
		//maybe move to block place
		//[achievement] Smelt Everything! | Connect 3 Chests to a single Furnace using 3 Hoppers. | Be within the range of three chests connected to a Furnace with 3 Hoppers.
		
		
		
	//done--------------------
}
function getSomeWhere(location, player){
	//to-do--------------------
		//[achievement] Ahoy! | Find a shipwreck | —
		//[achievement] Atlantis? | Find an underwater ruin | —
		//[achievement] Caves & Cliffs | Freefall from the top of the world (build limit) to the bottom of the world and survive. | —
		//[achievement] On A Rail | Travel by minecart to a point at least 500m in a single direction from where you started. | Travel by minecart 500 blocks in a straight line away from the player's starting point.
		//[achievement] Treasure Hunter | Acquire a map from a cartographer villager, then enter the revealed structure | Visit the structure indicated while the purchased map is in your main hand (hotbar).
		//[advancement] Caves & Cliffs | Free fall from the top of the world (build limit) to the bottom of the world and survive | Fall from at least y=319 to at most y=-59 with a vertical distance of greater than 379 blocks.
		//[advancement] Eye Spy | Follow an Eye of Ender | Enter a stronghold.
		//[advancement] Remote Getaway | Escape the island | Throw an ender pearl through, fly, or walk into an end gateway.
		//[advancement] The City at the End of the Game | Go on in, what could happen? | Enter an end city.
	//done--------------------	

}

function itemInventory(player){
	//to-do--------------------
		//Required data values
		//cant be done until after block renames happen our data values are given to itemStack class
		//[advancement] Spooky Scary Skeleton | Obtain a Wither Skeleton's skull | Have a wither skeleton skull in your inventory.
		//[achievement] Dry Spell | Dry a sponge in a furnace | —
		//[advancement] Careful Restoration | Make a Decorated Pot out of 4 Pottery Sherds | —
		//[achievement] Careful restoration | Make a Decorated Pot out of 4 Pottery Sherds | —
		//[achievement] Fruit on the Loom | Make a banner using an Enchanted Apple Stencil | Make a banner using an enchanted apple.
		
		//mabye should move
		//i dont know how to do this one
		//[achievement] Taking Inventory | Open your inventory. | —
		//Maybe block interactions?
		//[achievement] Chestful of Cobblestone | Mine 1,728 Cobblestone and place it in a chest. | A player must mine 1,728 cobblestone and place 1,728 cobblestone, or 27 stacks, in a chest. The cobblestone placed in the chest does not have to be the same cobblestone that was mined.
	//done--------------------
	const loseItems = ["crafting_table",
						"iron_ingot",		
						"diamond",			
						"ancient_debris",	
						"lava_bucket",		
						"cod_bucket",
						"salmon_bucket",
						"tropical_fish_bucket",
						"pufferfish_bucket",
						"axolotl_bucket",	
						"tadpole_bucket",	
						"cobblestone",
						"blackstone",
						"cobbled_deepslate",
						"obsidian",			
						"crying_obsidian",	
						"blaze_rod",		
						"dragon_egg",		
						"sniffer_egg",		
						"dragon_breath",	
						"bread", 			
						"furnace", 		 	
						"enchanting_table",	
						"bookshelf",		
						"cake",				
						"leather",			
						"dispenser",		
						"cooked_cod",		
						"charcoal",
						"flower_pot"]		
	const woolTypes=["black_wool",
					"blue_wool",
					"brown_wool",
					"cyan_wool",
					"gray_wool",
					"green_wool",
					"light_blue_wool",
					"light_gray_wool",
					"lime_wool",
					"magenta_wool",
					"orange_wool",
					"pink_wool",
					"purple_wool",
					"red_wool",
					"white_wool",
					"yellow_wool"]
	const toolsTypes = ["wooden_pickaxe",
					"wooden_sword",
					"wooden_shovel",
					"wooden_axe",
					"wooden_hoe",
					"stone_pickaxe",
					"stone_sword",
					"stone_shovel",
					"stone_axe",
					"stone_hoe",
					"iron_pickaxe",
					"iron_sword",
					"iron_shovel",
					"iron_axe",
					"iron_hoe",
					"golden_pickaxe",
					"golden_sword",
					"golden_shovel",
					"golden_axe",
					"golden_hoe",
					"diamond_pickaxe",
					"diamond_sword",
					"diamond_shovel",
					"diamond_axe",
					"diamond_hoe",
					"netherite_pickaxe",				
					"netherite_sword",				
					"netherite_shovel",				
					"netherite_axe",				
					"netherite_hoe"]				
						
	const armorTypes = ["iron_helmet",
					"iron_chestplate",
					"iron_leggings",
					"iron_boots",
					"diamond_helmet",
					"diamond_chestplate",
					"diamond_leggings",
					"diamond_boots",
					"netherite_helmet",
					"netherite_chestplate",
					"netherite_leggings",
					"netherite_boots",
					"elytra"];			
	const foglightType=["ochre_froglight",
						"pearlescent_froglight",
						"verdant_froglight"]
	const sherdArray = ["angler_pottery_sherd",
						"archer_pottery_sherd",
						"arms_up_pottery_sherd",
						"blade_pottery_sherd",
						"brewer_pottery_sherd",
						"burn_pottery_sherd",
						"danger_pottery_sherd",
						"explorer_pottery_sherd",
						"friend_pottery_sherd",
						"heart_pottery_sherd",
						"heartbreak_pottery_sherd",
						"howl_pottery_sherd",
						"miner_pottery_sherd",
						"mourner_pottery_sherd",
						"plenty_pottery_sherd",
						"prize_pottery_sherd",
						"sheaf_pottery_sherd",
						"shelter_pottery_sherd",
						"skull_pottery_sherd",
						"snort_pottery_sherd"];
	
	let inventoryPlayer = player.getComponent("minecraft:inventory");
	let index=0;
	let inventorymask = 0;
	let armorMask = 0;
	let sherdMask = 0;
	let toolMask = 0;
	let woolMask = 0;
	let froglight = 0;
	for (let slot = 0; slot<36;slot++){
		let itemStack = inventoryPlayer.container.getItem(slot);
		if (itemStack){
			const itemName = itemStack.typeId.replace("minecraft:","")
			if(loseItems.includes(itemName)){
				index = loseItems.indexOf(itemName)
				inventorymask = inventorymask | (0b1<<index)
			}
			else if (sherdArray.includes(itemName)){
				index = sherdArray.indexOf(itemName)
				sherdMask = sherdMask | (0b1<<index)
			}else if(toolsTypes.includes(itemName)){
				index = toolsTypes.indexOf(itemName)
				toolMask = toolMask | (0b1<<index)
				
			}else if(woolTypes.includes(itemName)){
				index = woolTypes.indexOf(itemName)
				woolMask = woolMask | (0b1<<index)
				
			}else if(foglightType.includes(itemName)){
				index = foglightType.indexOf(itemName)
				froglight = froglight | (0b1<<index)
				
			}else if(itemName.includes("shulker_box")){
				//[achievement] Organizational Wizard | Name a Shulker Box with an Anvil | —
				if(itemStack.nameTag){
					if(!achievementTracker.checkAchievment("OrganizationalWizard",player)){
						achievementTracker.setAchievment("OrganizationalWizard",player)
					}
				}
			}
		}
	}
	const equip = getequipped(player)
	for(const slot of ["Chest","Feet","Head","Legs"]){
		let itemName = equip[slot];
		if(armorTypes.includes(itemName)){
			index = armorTypes.indexOf(itemName)
			armorMask = armorMask | (0b1<<index)
		}
	} 
	//Checks armor based achievements
	if(armorMask>0){
		checkArmorachievements(player,armorMask);
	}
	//check tool based achievements
	if(toolMask>0){
		checkToolachievements(player,toolMask);
	}
	if(inventorymask>0){
		checkLooseItemachievements(player,inventorymask)
	}
    
	//[advancement] Respecting the Remnants | Brush a Suspicious block to obtain a Pottery Sherd | —
	if(sherdArray>0){
		if(!advancementTracker.checkAchievment("RespectingtheRemnants",player)){
			advancementTracker.setAchievment("RespectingtheRemnants",player)
		}
	}
	if(froglight==0b111){
		//[advancement] With Our Powers Combined! | Have all Froglights in your inventory | Have a Pearlescent, Ochre, and Verdant Froglight in your inventory.
		//[achievement] With our powers combined! | Have all 3 froglights in your inventory | Acquire at least one of each pearlescent, verdant, and ochre froglights in your inventory at the same time.		
		if(!advancementTracker.checkAchievment("WithOurPowersCombined",player)){
			advancementTracker.setAchievment("WithOurPowersCombined",player)
			achievementTracker.setAchievment("Withourpowerscombined",player)
		}
	}
	if(woolMask==0b1111111111111111){
		//[achievement] Rainbow Collection | Gather all 16 colors of wool. | All the colors of wool do not have to be in the inventory at the same time, but must have been picked up by the player at least once.
		if(!achievementTracker.checkAchievment("RainbowCollection",player)){
			achievementTracker.setAchievment("RainbowCollection",player)
		}
	}
}
function checkLooseItemachievements(player,inventorymask){
	const craftingTable =	 0b1
	const ironIngotMask =	 0b10
	const diamondMask = 	 0b100
	const ancientDebrisMask =0b1000
	const lavaMask=			 0b10000
	const bucketOfFishMask = 0b111100000;
	const axolotlMask = 	 0b1000000000;
	const tadpoleMask = 	 0b10000000000;
	const halfMask = 		 0b1111111111111
	const stoneTypesMask = 	 0b11100000000000;
	const obsidianMask = 	 0b100000000000000;
	const cryingMask =	 	 0b1000000000000000;
	const blazeMask =	 	 0b10000000000000000;
	const dragonEggMask = 	 0b100000000000000000;
	const snifferEggMask = 	 0b1000000000000000000;
	const dragonBreadthMask =0b10000000000000000000;
	const breadMask =		 0b100000000000000000000;
	const furnaceMask =		 0b1000000000000000000000;
	const tableMask =		 0b10000000000000000000000;
	const bookshelfMask =	 0b100000000000000000000000;
	const cakeMask =		 0b1000000000000000000000000;
	const leatherMask =		 0b10000000000000000000000000;
	const dispenserMask =	 0b100000000000000000000000000;
	const coookedCodMask = 	 0b1000000000000000000000000000;
	const charcoalMask = 	 0b10000000000000000000000000000;
	const flowerPot = 		 0b100000000000000000000000000000;
	const otherhalfMask = 	 0b111111111111111100000000000000;
	if((halfMask&inventorymask)>0){
		//[achievement] Benchmaking | Craft a workbench with four blocks of wooden planks. | Pick up a crafting table from the inventory's crafting field output or a crafting table output.
		//[advancement] Minecraft | The heart and story of the game | Have a crafting table in your inventory.
		if((craftingTable&inventorymask)==craftingTable){
			if(!advancementTracker.checkAchievment("Minecraft",player)){
				advancementTracker.setAchievment("Minecraft",player)
				achievementTracker.setAchievment("Benchmaking",player)
			}
		}
		//[achievement] Acquire Hardware | Smelt an iron ingot | Pick up an iron ingot from a furnace output.
		//[advancement] Acquire Hardware | Smelt an Iron Ingot | Have an iron ingot in your inventory.
		if((ironIngotMask&inventorymask)==ironIngotMask){
			if(!advancementTracker.checkAchievment("AcquireHardware",player)){
				advancementTracker.setAchievment("AcquireHardware",player)
				achievementTracker.setAchievment("AcquireHardware",player)
			}
		}
		//[achievement] DIAMONDS! | Acquire diamonds with your iron tools. | Pick up a diamond from the ground.
		//[advancement] Diamonds! | Acquire diamonds | Have a diamond in your inventory.
		if((diamondMask&inventorymask)==diamondMask){
			if(!advancementTracker.checkAchievment("Diamonds",player)){
				advancementTracker.setAchievment("Diamonds",player)
				achievementTracker.setAchievment("DIAMONDS",player)
			}
		}
		//[advancement] Hidden in the Depths | Obtain Ancient Debris | Have an ancient debris in your inventory.
		if((ancientDebrisMask&inventorymask)==ancientDebrisMask){
			if(!advancementTracker.checkAchievment("HiddenintheDepths",player)){
				advancementTracker.setAchievment("HiddenintheDepths",player)
			}
		}
		//[advancement] Hot Stuff | Fill a Bucket with lava | Have a lava bucket in your inventory.
		if((lavaMask&inventorymask)==lavaMask){
			if(!advancementTracker.checkAchievment("HotStuff",player)){
				advancementTracker.setAchievment("HotStuff",player)
			}
		}
		//[advancement] The Cutest Predator | Catch an Axolotl in a Bucket | Use a water bucket on an axolotl.
		if((axolotlMask&inventorymask)==axolotlMask){
			if(!advancementTracker.checkAchievment("TheCutestPredator",player)){
				advancementTracker.setAchievment("TheCutestPredator",player)
			}
		}
		//[advancement] Bukkit Bukkit | Catch a Tadpole in a Bucket | —
		if((tadpoleMask&inventorymask)==tadpoleMask){
			if(!advancementTracker.checkAchievment("BukkitBukkit",player)){
				advancementTracker.setAchievment("BukkitBukkit",player)
			}
		}
		//[achievement] I am a Marine Biologist | Collect a fish in a bucket | Use an empty bucket on any fish mob to collect it.
		//[advancement] Tactical Fishing | Catch a Fish... without a Fishing Rod! | Use a water bucket on any fish mob.
		if(( bucketOfFishMask & inventorymask)>0){
			if(!advancementTracker.checkAchievment("TacticalFishing",player)){
				advancementTracker.setAchievment("TacticalFishing",player)
				achievementTracker.setAchievment("IamaMarineBiologist",player)
			}
		}
	}
	if((otherhalfMask&inventorymask)>0){
		//[advancement] Stone Age | Mine Stone with your new Pickaxe | Have one of these 3 stones in the #stone_tool_materials item tag:, Cobblestone, Blackstone, Cobbled Deepslate, in your inventory.
		if((stoneTypesMask & inventorymask)>0){
			if(!advancementTracker.checkAchievment("StoneAge",player)){
				advancementTracker.setAchievment("StoneAge",player)
			}
		}
		//[advancement] Ice Bucket Challenge | Obtain a block of Obsidian | Have a block of obsidian in your inventory.
		if((obsidianMask&inventorymask)==obsidianMask){
			if(!advancementTracker.checkAchievment("IceBucketChallenge",player)){
				advancementTracker.setAchievment("IceBucketChallenge",player)
			}
		}
		//[advancement] Who is Cutting Onions? | Obtain Crying Obsidian | Have a block of crying obsidian in your inventory.
		if((cryingMask&inventorymask)==cryingMask){
			if(!advancementTracker.checkAchievment("WhoisCuttingOnions",player)){
				advancementTracker.setAchievment("WhoisCuttingOnions",player)
			}
		}
		//[achievement] Into Fire | Relieve a Blaze of its rod. | Pick up a blaze rod from the ground.
		//[advancement] Into Fire | Relieve a Blaze of its rod | Have a blaze rod in your inventory.
		if((blazeMask&inventorymask)==blazeMask){
			if(!advancementTracker.checkAchievment("IntoFire",player)){
				advancementTracker.setAchievment("IntoFire",player)
				achievementTracker.setAchievment("IntoFire",player)
			}
		}
		//[advancement] The Next Generation | Hold the Dragon Egg | Have a dragon egg in your inventory.
		if((dragonEggMask&inventorymask)==dragonEggMask){
			if(!advancementTracker.checkAchievment("TheNextGeneration",player)){
				advancementTracker.setAchievment("TheNextGeneration",player)
			}
		}
		//[advancement] Smells Interesting | Obtain a Sniffer Egg | Have a sniffer egg in your inventory.
		if((snifferEggMask&inventorymask)==snifferEggMask){
			if(!advancementTracker.checkAchievment("SmellsInteresting",player)){
				advancementTracker.setAchievment("SmellsInteresting",player)
			}
		}
		//[advancement] You Need a Mint | Collect Dragon's Breath in a Glass Bottle | Have a bottle of dragon's breath in your inventory.
		//[achievement] You Need a Mint | Collect dragons breath in a glass bottle | Have a dragon's breath bottle in your inventory
		if((dragonBreadthMask&inventorymask)==dragonBreadthMask){
			if(!advancementTracker.checkAchievment("YouNeedaMint",player)){
				advancementTracker.setAchievment("YouNeedaMint",player)
				achievementTracker.setAchievment("YouNeedaMint",player)
			}
		}
		//[achievement] Bake Bread | Turn wheat into bread. | Pick up bread from a crafting table output.
		if((breadMask&inventorymask)==breadMask){
			if(!achievementTracker.checkAchievment("BakeBread",player)){
				achievementTracker.setAchievment("BakeBread",player)
			}
		}
		//[achievement] Hot Topic | Construct a furnace out of eight cobblestone blocks. | Pick up a furnace from a crafting table output.
		if((furnaceMask&inventorymask)==furnaceMask){
			if(!achievementTracker.checkAchievment("HotTopic",player)){
				achievementTracker.setAchievment("HotTopic",player)
			}
		}
		//[achievement] Enchanter | Construct an Enchantment Table. | Pick up an enchantment table from a crafting table output.
		if((tableMask&inventorymask)==tableMask){
			if(!achievementTracker.checkAchievment("Enchanter",player)){
				achievementTracker.setAchievment("Enchanter",player)
			}
		}
		//[achievement] Librarian | Build some bookshelves to improve your enchantment table. | Pick up a bookshelf from a crafting table output.
		if((bookshelfMask&inventorymask)==bookshelfMask){
			if(!achievementTracker.checkAchievment("Librarian",player)){
				achievementTracker.setAchievment("Librarian",player)
			}
		}
		//[achievement] The Lie | Bake a cake using: wheat, sugar, milk, and eggs. | Pick up a cake from a crafting table output.
		if((cakeMask&inventorymask)==cakeMask){
			if(!achievementTracker.checkAchievment("TheLie",player)){
				achievementTracker.setAchievment("TheLie",player)
			}
		}
		//[achievement] Cow Tipper | Harvest some leather. | Pick up leather from the ground.
		if((leatherMask&inventorymask)==leatherMask){
			if(!achievementTracker.checkAchievment("CowTipper",player)){
				achievementTracker.setAchievment("CowTipper",player)
			}
		}
		//[achievement] Dispense with This | Construct a Dispenser. | —
		if((dispenserMask&inventorymask)==dispenserMask){
			if(!achievementTracker.checkAchievment("DispensewithThis",player)){
				achievementTracker.setAchievment("DispensewithThis",player)
			}
		}
		//[achievement] Catch and cook a fish! | Pick up a cooked cod after cooking it in a Furnace, Smoker, Campfire, or Soul Campfire. Doesn't work if the block used is hooked up to a hopper, as the player is not getting the item directly from the output.
		if((coookedCodMask&inventorymask)==coookedCodMask){
			if(!achievementTracker.checkAchievment("DeliciousFish",player)){
				achievementTracker.setAchievment("DeliciousFish",player)
			}
		}
		//[achievement] Renewable Energy | Smelt wood trunks using charcoal to make more charcoal. | Smelt a wooden log with charcoal as the fuel.
		if((charcoalMask&inventorymask)==charcoalMask){
			if(!achievementTracker.checkAchievment("RenewableEnergy",player)){
				achievementTracker.setAchievment("RenewableEnergy",player)
			}
		}
		//[achievement] Renewable Energy | Smelt wood trunks using charcoal to make more charcoal. | Smelt a wooden log with charcoal as the fuel.
		if((flowerPot&inventorymask)==flowerPot){
			if(!achievementTracker.checkAchievment("PotPlanter",player)){
				achievementTracker.setAchievment("PotPlanter",player)
			}
		}
	}
}
function checkToolachievements(player,toolMask){
	const hoeAnyType=0b100001000010000100001000010000;
	const axeAnyType=0b010000100001000010000100001000;
	const shovelAnyType=0b001000010000100001000010000100;
	const swordAnyType=0b000100001000010000100001000010;
	const pickAnyType=0b00010000100001000010000100001;
	const woodPickType = 0b1;
	const stonePickType = 0b100000;
	const ironPickType = 0b10000000000;
	const allWood=0b11111;
	const allstone=0b1111100000;
	const alliron=0b111110000000000;
	const alldiamond=0b11111000000000000000;
	const allnetherite=0b1111100000000000000000000;
	const woodHoe=0b10000
	const woodSword=0b10
	const netheriteHoe=0b100000000000000000000000000000
	if((pickAnyType&toolMask)>0){
		//[achievement] Time to Mine! | Use planks and sticks to make a pickaxe. | Pick up any type of pickaxe from a crafting table output.
		if((woodPickType&toolMask)==woodPickType){
			if(!achievementTracker.checkAchievment("TimetoMine",player)){
				achievementTracker.setAchievment("TimetoMine",player)
			}
		}
		//[achievement] Getting an Upgrade | Construct a better pickaxe. | Pick up a stone pickaxe from a crafting table output.
		//[advancement] Getting an Upgrade | Construct a better Pickaxe | Have a stone pickaxe in your inventory.
		if((stonePickType&toolMask)==stonePickType){
			if(!advancementTracker.checkAchievment("GettinganUpgrade",player)){
				advancementTracker.setAchievment("GettinganUpgrade",player)
				achievementTracker.setAchievment("GettinganUpgrade",player)
			}
		}

		//[advancement] Isn't It Iron Pick | Upgrade your Pickaxe | Have an iron pickaxe in your inventory.
		if((ironPickType&toolMask)==ironPickType){
			if(!advancementTracker.checkAchievment("IsntItIronPick",player)){
				advancementTracker.setAchievment("IsntItIronPick",player)
			}
		}	
		//[achievement] MOAR Tools | Construct one type of each tool. | Construct one pickaxe, one shovel, one axe, and one hoe with the same material.
		let toolsOfOneType = (toolMask&allWood)==allWood
		toolsOfOneType = toolsOfOneType || (toolMask&allstone)==allstone
		toolsOfOneType = toolsOfOneType || (toolMask&alliron)==alliron
		toolsOfOneType = toolsOfOneType || (toolMask&alldiamond)==alldiamond
		toolsOfOneType = toolsOfOneType || (toolMask&allnetherite)==allnetherite
		if(toolsOfOneType){
			if(!achievementTracker.checkAchievment("MOARTools",player)){
				achievementTracker.setAchievment("MOARTools",player)
			}
		}
	}
	if((hoeAnyType&toolMask)>0){
		//[achievement] Time to Farm! | Make a Hoe. | Pick up any type of hoe from a crafting table output.
		if((woodHoe&toolMask)==woodHoe){
			if(!achievementTracker.checkAchievment("TimetoFarm",player)){
				achievementTracker.setAchievment("TimetoFarm",player)
			}
		}
		// [advancement] Serious Dedication | Have a netherite hoe in your inventory.
		if((netheriteHoe&toolMask)==netheriteHoe){
			if(!advancementTracker.checkAchievment("SeriousDedication",player)){
				advancementTracker.setAchievment("SeriousDedication",player)
			}
		}
	}
	//[achievement] Time to Strike! | Use planks and sticks to make a sword. | Pick up any type of sword from a crafting table output.
	if((woodSword&toolMask)==woodSword){
			if(!achievementTracker.checkAchievment("TimetoStrike",player)){
				achievementTracker.setAchievment("TimetoStrike",player)
			}
		}
}
function checkArmorachievements(player,armorMask){
	const allIronArmorMask = 0b1111;
	const allDiamondArmorMask = 0b11110000;
	const allNetheriteArmorMask = 0b111100000000;
	const elytraMask = 0b1000000000000
	//[advancement] Suit Up | Protect yourself with a piece of iron armor | Have any type of iron armor in your inventory.
	if((allIronArmorMask & armorMask)>0){
		if(!advancementTracker.checkAchievment("SuitUp",player)){
			advancementTracker.setAchievment("SuitUp",player)
		}
		//[achievement] Iron Man | Wear a full suit of Iron Armor. | —
		if((allIronArmorMask & armorMask) == allIronArmorMask){
			if(!achievementTracker.checkAchievment("IronMan",player)){
				achievementTracker.setAchievment("IronMan",player)
			}
		}
	}
    //[advancement] Cover Me with Diamonds | Diamond armor saves lives | Have any type of diamond armor in your inventory.
	if((allDiamondArmorMask & armorMask)>0){
		if(!advancementTracker.checkAchievment("CoverMewithDiamonds",player)){
			advancementTracker.setAchievment("CoverMewithDiamonds",player)
		}
	}
	
	
    //[achievement] Cover me in debris | Wear a full set of Netherite armor | Have a full set of Netherite armor in your inventory.
    //[advancement] Cover Me in Debris | Get a full suit of Netherite armor | Have a full set of netherite armor in your inventory.
	if((allNetheriteArmorMask & armorMask)==allNetheriteArmorMask){
		if(!advancementTracker.checkAchievment("Covermeindebris",player)){
			advancementTracker.setAchievment("Covermeindebris",player)
			achievementTracker.setAchievment("Covermeindebris",player)
		}
	}
	
	//[advancement] Sky's the Limit | Find Elytra | Have a pair of elytra in your inventory.
	if((elytraMask & armorMask)==elytraMask){
		if(!advancementTracker.checkAchievment("SkystheLimit",player)){
			advancementTracker.setAchievment("SkystheLimit",player)
		}
	}
	
}
function tameEvents(event){
	const animalType = event.entity.typeId.replace("minecraft:","")
	
	let player = event.entity.dimension.getPlayers({
		closest: 1,
			location: {x: event.entity.location.x, y: event.entity.location.y, z: event.entity.location.z}
	})[0];
	if (event.eventId=="minecraft:on_tame"){
		//[advancement] Best Friends Forever | Tame an animal | Tame one of these 8 tameable mobs:, Cat, Donkey, Horse, Llama, Mule, Parrot, Trader Llama, Wolf
		if(!advancementTracker.checkAchievment("BestFriendsForever",player)){
			advancementTracker.setAchievment("BestFriendsForever",player)
		}
	}
	
	switch(animalType){
		case "ocelot":
		//[achievement] Lion Hunter | Gain the trust of an Ocelot. | —
			if(!achievementTracker.checkAchievment("LionHunter",player)){
				achievementTracker.setAchievment("LionHunter",player)
			}
			break;
		case "horse":
		//[achievement] Saddle Up | Tame a horse. | —
			if(!achievementTracker.checkAchievment("SaddleUp",player)){
				achievementTracker.setAchievment("SaddleUp",player)
			}
			break;
		case "wolf":
		//[achievement] Leader of the Pack | Befriend five wolves. | This does not have to be in a single game, so multiple games or reloading old saves does count toward this achievement.
			if(!achievementTracker.checkAchievment("LeaderofthePack",player)){
				var numWolfs = player.getDynamicProperty("wolfCounter")
				if(!numWolfs){
					numWolfs=0
				}
				numWolfs+=1
				player.setDynamicProperty("wolfCounter",numWolfs)
				if(numWolfs>=5){
					achievementTracker.setAchievment("LeaderofthePack",player)
				}
			}
		case "cat":
	//[achievement] Plethora of Cats | Befriend twenty stray cats. | Befriend and tame twenty stray cats found in villages. They do not all need to be tamed in a single world.
			if(!achievementTracker.checkAchievment("PlethoraofCats",player)){
				var numCats = player.getDynamicProperty("catCounter")
				if(!numCats){
					numCats=0
				}
				numCats+=1
				player.setDynamicProperty("catCounter",numCats)
				if(numCats>=12){
					achievementTracker.setAchievment("PlethoraofCats",player)
				}
			}
	//[advancement] A Complete Catalogue | Tame all Cat variants! | Tame each of these 11 cat variants:, Tabby, Tuxedo, Red, Siamese, British Shorthair, Calico, Persian, Ragdoll, White, Jellie, Black
			if(!advancementTracker.checkAchievment("ACompleteCatalogue",player)){
				let catMask = player.getDynamicProperty("catMask")
				if(!catMask){
					catMask=0b000000000000
				}
				const variant = event.entity.getComponent("minecraft:variant")

				catMask = catMask | 0b1 << variant.value
				player.setDynamicProperty("catMask",catMask)
				if(catMask==0b11111111111){
					advancementTracker.setAchievment("ACompleteCatalogue",player)
				}
			}
	}
	addToScore("stats_AnimalsTaimed_", animalType.replace("_",""), player)
}
function onHurtEvent(event){
	const source = event.damageSource
	const victim = event.hurtEntity
	if(source.damagingEntity){
		const agressor = source.damagingEntity
		const agressorType = agressor.typeId.replace("minecraft:","")
		if(agressorType=="player"){
		//[achievement] Overkill | Deal nine hearts of damage in a single hit. | Damage can be dealt to any mob, even those that do not have nine hearts of health overall.
			if(event.damage>9){
				if(!achievementTracker.checkAchievment("Overkill",agressor)){
					achievementTracker.setAchievment("Overkill",agressor)
				}
			}
		}
	}
}
function entityInteractions(){
	//to-do--------------------
		//[achievement] Birthday song | Have an Allay drop a cake at a noteblock | Tame an allay by giving it a cake while having dropped cake items and play a noteblock nearby.
		//[achievement] Echolocation | Feed a dolphin fish to have it lead you to treasure | Feed a dolphin cod or salmon and have it lure you to treasure.
		//[achievement] Feels Like Home | Take a Strider for a loooong [sic] ride on a lava lake in the Overworld. | In the Overworld, use a strider to ride on a lava lake for a distance of 50 meters from the point where the ride starts.
		//[achievement] Oooh, shiny! | Distract a Piglin using gold | Give a piglin a gold item while it is aggressive toward the player.
		
		//[achievement] So I Got That Going for Me | Lead a Caravan containing at least 5 Llamas | —
		//[achievement] Taste of Your Own Medicine | Poison a witch with a splash potion. | Throw a splash potion of poison at a witch (by facing the witch and pressing the use key).
		//[achievement] Time for Stew | Give someone a suspicious stew. | —
		//[achievement] Whatever Floats Your Goat | Get in a boat and float with a goat | Use a boat and put a goat inside that boat, then ride it
		//[achievement] When Pigs Fly | Use a saddle to ride a pig, and then have the pig get hurt from fall damage while riding it. | Be riding a pig (e.g. using a saddle) when it hits the ground with a fall distance greater than 5.
		
		//[advancement] Birthday Song | Have an Allay drop a Cake at a Note Block | Give an allay a cake and then use a note block to make the allay drop the cake at a note block.
		//[advancement] Feels Like Home | Take a Strider for a loooong ride on a lava lake in the Overworld | While riding a strider, travel 50 blocks on lava in the Overworld., Only horizontal displacement is counted. Traveling in a circle for more than 50 blocks doesn't count.
		//[advancement] Oh Shiny | Distract Piglins with gold | While aggravated, give a piglin one of these 25 gold-related items in the #piglin_loved item tag:, Bell, Block of Gold, Block of Raw Gold, Clock, Enchanted Golden Apple, Gilded Blackstone, Glistering Melon Slice, Gold Ingot, Gold Ore, Golden Apple, Golden Axe, Golden Boots, Golden Carrot, Golden Chestplate, Golden Helmet, Golden Hoe, Golden Horse Armor, Golden Leggings, Golden Pickaxe, Golden Shovel, Golden Sword, Light Weighted Pressure Plate, Nether Gold Ore, Deepslate Gold Ore, Raw Gold, Other gold-related items do not distract the piglin and do not trigger this advancement.
		//[advancement] Little Sniffs | Feed a Snifflet | Feed a snifflet torchflower seeds.
		//[advancement] Surge Protector | Protect a Villager from an undesired shock without starting a fire | Be within 30 blocks of a lightning strike that doesn't set any blocks on fire, while an unharmed villager is within or up to six blocks above a 30×30×30 volume centered on the lightning strike.
		//[advancement] This Boat Has Legs | Ride a Strider with a Warped Fungus on a Stick | Boost[2] a strider with a warped fungus on a stick.
		//[advancement] Whatever Floats Your Goat! | Get in a Boat and float with a Goat | Enter a boat or a raft with a goat.
		//[advancement] When the Squad Hops into Town | Get each Frog variant on a Lead | The frogs don't need to be leashed at the same time.[5]
		// Requires drop method
		//Tag dropped diamonds and check on pick up Requires drop and pickup methods
		//[achievement] Diamonds to you! | Throw diamonds at another player. | Drop a diamond. Another player or a mob must then pick up this diamond.
		//[advancement] You've Got a Friend in Me | Have an Allay deliver items to you | Give an allay an item and then have it return to the player with more of that item.
		//tag items dropped by the cat. then check if they were picked up
		//[achievement] Where Have You Been? | Receive a gift from a tamed cat in the morning. | The gift must be picked up from the ground.
		//Requires look through looking glass method.
		//[advancement] Is It a Balloon? | Look at a Ghast through a Spyglass | Look at a ghast through a spyglass while the ghast is focused on you.
		//[advancement] Is It a Bird? | Look at a Parrot through a Spyglass | —
		//[advancement] Is It a Plane? | Look at the Ender Dragon through a Spyglass | —
	//done--------------------
}
function entityKills(victim,player,cause,weapon){
	
	//to-do--------------------
		//needs component checks
		//Needs a more detailed projectile check
		//needs more weapon/player data
			// requires selectedSlot
			//[advancement] Arbalistic | Kill five unique mobs with one crossbow shot | 
		//[achievement] Camouflage | Kill a mob while wearing the same type of mob head. | —
		//[achievement] It spreads | Kill a mob next to a catalyst | —
		//[advancement] It Spreads | Kill a mob near a Sculk Catalyst | Kill one of these 70 mobs near a sculk catalyst:, Axolotl, Bee, Blaze, Camel, Cat, Cave Spider, Chicken, Chicken Jockey, Cod, Cow, Creeper, Donkey, Dolphin, Drowned, Elder Guardian, Enderman, Endermite, Evoker, Fox, Frog, Ghast, Goat, Glow Squid, Guardian, Hoglin, Horse, Husk, Llama, Magma Cube, Mooshroom, Ocelot, Panda, Parrot, Phantom, Pig, Piglin, Piglin Brute, Pillager, Polar Bear, Pufferfish, Rabbit, Ravager, Salmon, Sheep, Shulker, Silverfish, Skeleton, Skeleton Horse, Skeleton Horseman, Slime, Sniffer, Stray, Spider, Spider Jockey, Squid, Strider, Trader Llama, Tropical Fish, Turtle, Vex, Vindicator, Warden, Witch, Wither, Wither Skeleton, Wolf, Zoglin, Zombie, Zombie Villager, Zombified Piglin, Mobs that drop no experience are ignored for this advancement.
		//[advancement] Monsters Hunted | Kill one of every hostile monster | Kill each of these 34 mobs:, Blaze, Cave Spider, Creeper, Drowned, Elder Guardian, Ender Dragon, Enderman, Endermite, Evoker, Ghast, Guardian, Hoglin, Husk, Magma Cube, Phantom, Piglin, Piglin Brute, Pillager, Ravager, Shulker, Silverfish, Skeleton, Slime, Spider, Stray, Vex, Vindicator, Witch, Wither, Wither Skeleton, Zoglin, Zombie, Zombie Villager, Zombified Piglin, Other mobs may be killed, but are ignored for this advancement. Only the riders of the chicken jockeys and skeleton horsemen are counted in this advancement.
		//[advancement] Two Birds, One Arrow | Kill two Phantoms with a piercing Arrow | Use a crossbow enchanted with Piercing to kill two phantoms with a single arrow shot.
	//done--------------------
	const victimType = victim.typeId.replace("minecraft:","")
	const monsterList = ["blaze",
						"cave_spider",
						"creeper", 
						"drowned",
						"elder_guardian",
						"ender_dragon",
						"enderman",
						"endermite",
						"evocation_illager", 
						"ghast", 
						"guardian", 
						"hoglin", 
						"husk", 
						"magma_cube", 
						"phantom", 
						"piglin", 
						"piglin_brute", 
						"pillager", 
						"ravager", 
						"shulker", 
						"silverfish", 
						"skeleton", 
						"slime", 
						"spider", 
						"stray", 
						"vex", 
						"vindicator", 
						"witch", 
						"wither", 
						"wither_skeleton", 
						"zoglin", 
						"zombie", 
						"zombie_villager_v2", 
						"zombified_piglin"]
	switch(victimType){
		//[achievement] Archer | Kill a creeper with arrows. | —
		case "creeper":
			if (cause=="projectile"){
				if(!achievementTracker.checkAchievment("Archer",player)){
					achievementTracker.setAchievment("Archer",player)
				}
			}
			break;
		//[achievement] Feeling Ill | Defeat an Evoker | —
		case "evocation_illager":
			if(!achievementTracker.checkAchievment("FeelingIll",player)){
				achievementTracker.setAchievment("FeelingIll",player)
			}
			break;
		//[achievement] Kill the Beast! | Defeat a Ravager. | —
		case "ravager":
			if(!achievementTracker.checkAchievment("KilltheBeast",player)){
				achievementTracker.setAchievment("KilltheBeast",player)
			}
			break;
		//[advancement] Uneasy Alliance | Rescue a Ghast from the Nether, bring it safely home to the Overworld... and then kill it | Kill a ghast while the player is in the Overworld.
		case "ghast":
			if (victim.dimension.id.replace("minecraft:", "")=="overworld"){
				if(!advancementTracker.checkAchievment("UneasyAlliance",player)){
					advancementTracker.setAchievment("UneasyAlliance",player)
				}
			}
			break;		
		//[achievement] The Deep End | Defeat an Elder Guardian | —
		case "elder_guardian":
			if(!achievementTracker.checkAchievment("TheDeepEnd",player)){
				achievementTracker.setAchievment("TheDeepEnd",player)
			}
			break;
		
		//[advancement] Free the End | Good luck | Kill the ender dragon. If multiple players are involved in the dragon fight, only the player that deals the final blow to the dragon receives the advancement.[4]
		case "ender_dragon":
			if(!advancementTracker.checkAchievment("FreetheEnd",player)){
				advancementTracker.setAchievment("FreetheEnd",player)
			}
			break;
		//[advancement] Who's the Pillager Now? | Give a Pillager a taste of their own medicine | Kill a pillager with a crossbow.
		case "pillager":
			if(weapon == "crossbow"){
				if(!advancementTracker.checkAchievment("WhosthePillagerNow",player)){
					advancementTracker.setAchievment("WhosthePillagerNow",player)
				}
			}
			break;
		//[achievement] Sniper Duel | Kill a Skeleton with an arrow from more than 50 meters. | Use a launched arrow to kill a skeleton, spider jockey, wither skeleton, or a stray from 50 or more blocks away, horizontally.
		//[advancement] Sniper Duel | Kill a Skeleton from at least 50 meters away | Be at least 50 blocks away horizontally when a skeleton is killed by an arrow after the player has attacked it once.
		case "skeleton":
			if(weapon == "bow"){
				const dist = calculateDistance(player.location.x, player.location.z, victim.location.x, victim.location.z)
				if(dist>30){
					if(!advancementTracker.checkAchievment("SniperDuel",player)){
						advancementTracker.setAchievment("SniperDuel",player)
						achievementTracker.setAchievment("SniperDuel",player)
					}
				}
			}
			break;
	}
	//[advancement] Adventure | Adventure, exploration and combat | Kill any entity, or be killed by any entity.
	if(!advancementTracker.checkAchievment("Adventure",player)){
		advancementTracker.setAchievment("Adventure",player)
	}
	if(monsterList.includes(victimType)){
		//[achievement] Monster Hunter | Attack and destroy a monster. | Kill a hostile mob or one of the following neutral mobs: an enderman, a piglin, a zombified piglin, a spider, or a cave spider.
		//[advancement] Monster Hunter | Kill any hostile monster | Kill one of these 34 mobs:, Blaze, Cave Spider, Creeper, Drowned, Elder Guardian, Ender Dragon, Enderman, Endermite, Evoker, Ghast, Guardian, Hoglin, Husk, Magma Cube, Phantom, Piglin, Piglin Brute, Pillager, Ravager, Shulker, Silverfish, Skeleton, Slime, Spider, Stray, Vex, Vindicator, Witch, Wither, Wither Skeleton, Zoglin, Zombie, Zombie Villager, Zombified Piglin, Only the riders of the chicken jockeys and skeleton horsemen are counted in this advancement. Other mobs may be killed, but are ignored for this advancement.
		if(!advancementTracker.checkAchievment("MonsterHunter",player)){
			advancementTracker.setAchievment("MonsterHunter",player)
			achievementTracker.setAchievment("MonsterHunter",player)
		}
	}
		
}
function redstoneInteractions(){
	//to-do--------------------
		//[achievement] Inception | Push a piston with a piston, then pull the original piston with that piston. | —
		//[advancement] The Power of Books | Read the power signal of a Chiseled Bookshelf using a Comparator | Place a comparator on any side of a chiseled bookshelf or the chiseled bookshelf against a comparator to trigger the advancement.
	//done--------------------
}

function spawnAndBreed(entity, player){
	
	switch(entity){
		case "iron_golem" :
			if(!advancementTracker.checkAchievment("HiredHelp",player)){
				achievementTracker.setAchievment("BodyGuard",player);//[achievement] Body Guard | Create an Iron Golem | —
				advancementTracker.setAchievment("HiredHelp",player);//[advancement] Hired Help | Summon an Iron Golem to help defend a village | Summon an iron golem.
			}
			break;
		case "wither" :
			if(!advancementTracker.checkAchievment("WitheringHeights",player)){
				achievementTracker.setAchievment("TheBeginning",player);//[achievement] The Beginning? | Spawn the Wither | Be within a 100.9×100.9×103.5 cuboid centered on the Wither when it is spawned.
				advancementTracker.setAchievment("WitheringHeights",player);//[advancement] Withering Heights | Summon the Wither | Be within a 100.9×100.9×103.5 cuboid centered on the wither when it is spawned.
			}
			break;
		case "ender_dragon" :
			if(world.getDynamicProperty("dragonKill") == 1){
				if(world.getDynamicProperty("TheEndAgain") == 1){
					achievementTracker.setAchievment("TheEndAgain",player);//[achievement] The End... Again... | Respawn the Enderdragon | —
					advancementTracker.setAchievment("TheEndAgain",player);//[advancement] The End... Again... | Respawn the Ender Dragon | Be within a 192 block radius from the coordinates (0.0, 128, 0.0) when an ender dragon is summoned using end crystals.
				}
			}
			break;
		case "cow" :
			if(!achievementTracker.checkAchievment("Repopulation",player)){
				achievementTracker.setAchievment("Repopulation",player);//[achievement] Repopulation | Breed two cows with wheat. | Breed two cows or two mooshrooms.
				if(!advancementTracker.checkAchievment("TheParrotsandtheBats",player)){
					advancementTracker.setAchievment("TheParrotsandtheBats",player);
				}
			}
		case "mule" :	
			if(!achievementTracker.checkAchievment("ArtificialSelection",player)){
				achievementTracker.setAchievment("ArtificialSelection",player);//[achievement] Artificial Selection | Breed a mule from a horse and a donkey. | —
				if(!advancementTracker.checkAchievment("TheParrotsandtheBats",player)){
					advancementTracker.setAchievment("TheParrotsandtheBats",player);
				}
			}
			break;
		case "panda" :
			if(!achievementTracker.checkAchievment("Zoologist",player)){
				achievementTracker.setAchievment("Zoologist",player);//[achievement] Zoologist | Breed two pandas with bamboo. | —
				if(!achievementTracker.checkAchievment("TheParrotsandtheBats",player)){
					achievementTracker.setAchievment("TheParrotsandtheBats",player);
				}
			}
			break;
		case "axolotl" ://*fall through*
		case "bee" ://*fall through*
		case "camel" ://*fall through*
		case "cat" ://*fall through*
		case "chicken" ://*fall through*
		case "donkey" ://*fall through*
		case "fox" ://*fall through*
		case "frog" ://*fall through*
		case "goat" ://*fall through*
		case "hoglin" ://*fall through*
		case "horse" ://*fall through*
		case "llama" ://*fall through*
		case "mooshroom" ://*fall through*
		case "ocelot" ://*fall through*
		case "pig" ://*fall through*
		case "rabbit" ://*fall through*
		case "sheep" ://*fall through*
		case "sniffer" ://*fall through*
		case "strider" ://*fall through*
		case "turtle" ://*fall through*
		case "wolf" :
			if(!achievementTracker.checkAchievment("TheParrotsandtheBats",player)){
				achievementTracker.setAchievment("TheParrotsandtheBats",player);//[advancement] The Parrots and the Bats | Breed two animals together | Breed a pair of any of these 25 mobs:, Axolotl, Bee, Camel, Cat, Chicken, Cow, Donkey, Fox, Frog, Goat, Hoglin, Horse, Llama, Mooshroom, Mule, Ocelot, Panda, Pig, Rabbit, Sheep, Sniffer, Strider, Trader Llama, Turtle, Wolf, A mule must be the result of breeding a horse and a donkey for this advancement as they are not breedable together. Other breedable mobs are ignored for this advancement.
			}
			//[advancement] Two by Two | Breed all the animals! | Breed a pair of each of these 24 mobs:, Axolotl, Bee, Camel, Cat, Chicken, Cow, Donkey, Fox, Frog, Goat, Hoglin, Horse, Llama, Mooshroom, Mule, Ocelot, Panda, Pig, Rabbit, Sheep, Sniffer, Strider, Turtle, Wolf, A trader llama does not count as a llama, and a mule must be the result of breeding a horse and a donkey for this advancement as they are not breedable together. Other breedable mobs can be bred, but are ignored for this advancement.
			if(getScoreIfExists(world.scoreboard.getObjective("spawnAndBreedbreed_all_bool"), player) == 0){
				if(getScoreIfExists(world.scoreboard.getObjective("spawnAndBreed" + entity), player) == 0){
					addToScore("spawnAndBreedbreed_all_score", player);
					//boolScore("spawnAndBreed", entity, player, 1);
					if(getScoreIfExists(world.scoreboard.getObjective("spawnAndBreedbreed_all_score"), player) == 24){
						//boolScore("spawnAndBreed", "breed_all_bool", player, 1);
					}
				}
			}
			break;
		case "trader_llama" :
			if(!achievementTracker.checkAchievment("TheParrotsandtheBats",player)){
				achievementTracker.setAchievment("TheParrotsandtheBats",player);
			}
			break;
	}
}
function statusAndEffects(player){
	//to-do--------------------
		//check conduit power
		//[achievement] Great View From Up Here | Levitate up 50 blocks from the attacks of a Shulker | —
		//[advancement] Great View From Up Here | Levitate up 50 blocks from the attacks of a Shulker | Move a distance of 50 blocks vertically with the Levitation effect applied, regardless of direction or whether it is caused by the effect.
		//[achievement] Stayin' Frosty | Swim in lava while having the Fire Resistance effect. | —
		//[achievement] The Beaconator | Create and fully power a Beacon | Be within a 20×20×14 cuboid centered on the pyramid when the beacon block realizes it is fully powered.
		//[advancement] Beaconator | Bring a Beacon to full power | Be within a 20×20×14 cuboid centered on a beacon block when it realizes it is being powered by a size 4 pyramid.
		//[achievement] The Healing Power of Friendship! | Team up with an axolotl and win a fight | Team up with an axolotl by killing the hostile aquatic mob [verify] while the axolotl is fighting it (not playing dead).
		//[advancement] The Healing Power of Friendship! | Team up with an axolotl and win a fight | Have the Regeneration effect applied from assisting an axolotl or it killing a mob.
		//[achievement] We're being attacked! | Trigger a Pillager Raid. | Walk in a village with the Bad Omen effect applied.
		//[advancement] Bring Home the Beacon | Construct and place a Beacon | Be within a 20×20×14 cuboid centered on a beacon block when it realizes it has become powered.
	//done--------------------
	const effectArray = ["fire_resistance",//potion
						"invisibility",//potion
						"jump_boost",//potion
						"night_vision",//potion
						"poison",//potion
						"regeneration",//potion
						"resistance",//potion
						"slow_falling",//potion
						"slowness",//potion
						"speed",//potion
						"strength",//potion
						"water_breathing",//potion
						"weakness",//potion
						"absorption",
						"bad_omen",
						"blindness",
						"conduit_power",
						"darkness",
						"haste",
						"hero_of_the_village",
						"hunger",
						"levitation",
						"mining_fatigue",
						"nausea",
						"wither"];
	const allPotionsMask = 0b0000000000001111111111111
	const allEffectsMask = 0b1111111111111111111111111
	const heroMask = 0b1<<19
	let effectPlayer = player.getEffects();
	let effectMask = 0;
	let index = 0;
	
	//create a mask for effects
	for(var i = 0; i < effectPlayer.length; i++){
		let effect = effectPlayer[i].typeId
		if(effectArray.includes(effect)){
			index = effectArray.indexOf(effect)
			effectMask = effectMask | (1<<index)
		}
		switch(effect){
			//[achievement] I've got a bad feeling about this | Kill a Pillager Captain. | —
			//[advancement] Voluntary Exile | Kill a raid captain. Maybe consider staying away from villages for the time being… | Kill an entity in the #raiders entity tag wearing an ominous banner.
			case "bad_omen":
				if(!advancementTracker.checkAchievment("VoluntaryExile",player)){
					advancementTracker.setAchievment("VoluntaryExile",player)
					achievementTracker.setAchievment("Ivegotabadfeelingaboutthis",player)
				}
				break;
			case "conduit_power":
				//[achievement] Moskstraumen | Activate a Conduit | Place a conduit in a valid prismarine/sea lantern structure to activate it.
				if(!achievementTracker.checkAchievment("Moskstraumen",player)){
					achievementTracker.setAchievment("Moskstraumen",player)
				}
		}
	}
    //[advancement] A Furious Cocktail | Have every potion effect applied at the same time | Have all of these 13 status effects applied to the player at the same time:, Fire Resistance, Invisibility, Jump Boost, Night Vision, Poison, Regeneration, Resistance, Slow Falling, Slowness, Speed, Strength, Water Breathing, Weakness, The source of the effects is irrelevant for the purposes of this advancement. Other status effects may be applied to the player, but are ignored for this advancement.
	if((allPotionsMask & effectMask)==allPotionsMask){
		if(!advancementTracker.checkAchievment("AFuriousCocktail",player)){
			advancementTracker.setAchievment("AFuriousCocktail",player)
		}
	}
	
	
    //[advancement] How Did We Get Here? | Have every effect applied at the same time | Have all of these 27 status effects applied to the player at the same time:, Absorption, Bad Omen, Blindness, Conduit Power, Darkness, Dolphin's Grace, Fire Resistance, Glowing, Haste, Hero of the Village, Hunger, Invisibility, Jump Boost, Levitation, Mining Fatigue, Nausea, Night Vision, Poison, Regeneration, Resistance, Slow Falling, Slowness, Speed, Strength, Water Breathing, Weakness, Wither, The source of the effects is irrelevant for the purposes of this advancement. Other status effects may be applied to the player, but are ignored for this advancement.
	if((allPotionsMask & effectMask)==allPotionsMask){
		if(!advancementTracker.checkAchievment("HowDidWeGetHere",player)){
			advancementTracker.setAchievment("HowDidWeGetHere",player)
		}
		
	}
	if((heroMask & effectMask)==heroMask){
		//[advancement] Hero of the Village | Successfully defend a village from a raid | Kill at least one raid mob during a raid and wait until it ends in victory.
		if(!advancementTracker.checkAchievment("HerooftheVillage"),player){
			advancementTracker.setAchievment("HerooftheVillage",player)
		}
	}
}

function trading(){
	//to-do--------------------
		//[achievement] Buy Low, Sell High | Trade for the best possible price. | Buy something for 1 emerald, or when the Hero of the Village effect is applied.
		//[achievement] Master Trader | Trade for 1,000 emeralds. | Obtain 1,000 emeralds from trading with villagers.
		//[achievement] Star trader | Trade with a villager at the build height limit. | Trade with a villager at y320.
		//[achievement] The Haggler | Acquire or spend 30 Emeralds by trading with villagers or with wandering trader. [sic] | —
		//[advancement] Star Trader | Trade with a Villager at the build height limit | Stand on any block that is higher than 318 and trade with a villager or wandering trader.
		//[advancement] What a Deal! | Successfully trade with a Villager | Take an item from a villager or wandering trader's trading output slot, and put it in your inventory.
	//done--------------------
}
function usingItems(item, player){
	switch(item){
		case "oak_sign" :
			if(!achievementTracker.checkAchievment("ItsaSign", player)){
				achievementTracker.setAchievment("ItsaSign", player);//[achievement] It's a Sign! | Craft and place an Oak Sign. | —
			}
			break;
		case "pitcher_pod" ://*fall through*
		case "torchflower_seeds" :
			if(!achievementTracker.checkAchievment("Plantingthepast", player)){
				achievementTracker.setAchievment("Plantingthepast", player);//[achievement] Planting the past | Plant any Sniffer seed | —
				advancementTracker.setAchievment("PlantingthePast", player);//[advancement] Planting the Past | Plant any Sniffer seed | 
				if(!advancementTracker.checkAchievment("ASeedyPlace", player)){
					advancementTracker.setAchievment("ASeedyPlace", player);
				}
			}
			break;
		case "beetroot_seeds" ://*fall through*
		case "melon_seeds" ://*fall through*
		case "nether_wart" ://*fall through*
		case "pumpkin_seeds" ://*fall through*
		case "wheat_seeds" :
			if(!advancementTracker.checkAchievment("ASeedyPlace", player)){
				advancementTracker.setAchievment("ASeedyPlace", player);//[advancement] A Seedy Place | Plant a seed and watch it grow | Plant one of these 7 crops:, Beetroot, Melon, Nether Wart, Pumpkin, Wheat, Torchflower, Pitcher, Other crops and plants can be planted, but are ignored for this advancement.
			}
			break;
		case "glow_ink_sac" :
			if(!advancementTracker.checkAchievment("GlowandBehold", player)){
				advancementTracker.setAchievment("GlowandBehold", player);//[advancement] Glow and Behold! | Make the text of any kind of sign glow | Use a glow ink sac on a sign or a hanging sign.
			}
			break;
		case "ender_pearl" :
			if(!achievementTracker.checkAchievment("BeamMeUp", player)){
				achievementTracker.setAchievment("BeamMeUp", player);//[achievement] Beam Me Up | Teleport over 100 meters from a single throw of an Ender Pearl | Throw an ender pearl 100 blocks in any direction
			}
			break;
		case "totem_of_undying" :
			if(!achievementTracker.checkAchievment("CheatingDeath", player)){
				achievementTracker.setAchievment("CheatingDeath", player);//[achievement] Cheating Death | Use the Totem of Undying to cheat death | Have the Totem of Undying in your hand when you die.
				advancementTracker.setAchievment("Postmortal", player);//[advancement] Postmortal | Use a Totem of Undying to cheat death | Activate a totem of undying by taking fatal damage.
			}
			break;
	}
}

function weaponsToolsArmor(subject, player){
	//to-do--------------------
		//[achievement] Do a Barrel Roll! | Use Riptide to give yourself a boost | Obtain a trident enchanted with Riptide and launch yourself any distance with it.
		//[achievement] Have a Shearful Day | Use Shears to obtain wool from a sheep. | —
		//[achievement] Let It Go! | Using the Frost Walker boots, walk on at least 1 block on frozen water on a deep ocean | —
		//[achievement] Smithing with style | Apply these smithing templates at least once: Spire, Snout, Rib, Ward, Silence, Vex, Tide, Wayfinder | —
		//[achievement] Super Sonic | Use Elytra to fly through a 1 by 1 gap while moving faster than 40 m/s | —
		//[advancement] Crafting a New Look | Craft a trimmed armor at a Smithing Table | —
		//[advancement] Light as a Rabbit | Walk on Powder Snow... without sinking in it | Walk on powder snow while wearing leather boots.
		//[advancement] Not Today, Thank You | Deflect a projectile with a Shield | Block any projectile with a shield.
		//[advancement] Smithing with Style | Apply these smithing templates at least once: Spire, Snout, Rib, Ward, Silence, Vex, Tide, Wayfinder | —
		//[advancement] Very Very Frightening | Strike a Villager with lightning | Hit a villager with lightning created by a trident with the Channeling enchantment.
	//done--------------------
		switch(subject){
			case "crossbow" :
				if(!advancementTracker.checkAchievment("OlBetsy",player)){
					advancementTracker.setAchievment("OlBetsy",player);//[advancement] Ol' Betsy | Shoot a Crossbow | —
				}
				break;
			case "arrow" :
				if(!advancementTracker.checkAchievment("TakeAim",player)){
					advancementTracker.setAchievment("TakeAim",player);//[advancement] Take Aim | Shoot something with an Arrow | Using a bow or a crossbow, shoot an entity with an arrow, tipped arrow, or spectral arrow.
				}
				break;
			case "thrown_trident" :
				if(!advancementTracker.checkAchievment("AThrowawayJoke",player)){
					advancementTracker.setAchievment("AThrowawayJoke",player);//[advancement] A Throwaway Joke | Throw a Trident at something. Note: Throwing away your only weapon is not a good idea. | Hit a mob with a thrown trident.
				}
				break;
			case "target" :
				if(!achievementTracker.checkAchievment("Bullseye",player)){
					achievementTracker.setAchievment("Bullseye",player);//[achievement] Bullseye | Hit the bullseye of a Target block | —
				}
				break;
			case "targetFrom30" :
				if(!advancementTracker.checkAchievment("Bullseye",player)){
					advancementTracker.setAchievment("Bullseye",player); //[advancement] Bullseye | Hit the bullseye of a Target block from at least 30 meters away | Be at least 30 blocks away horizontally when the center of a target is shot with a projectile by the player.
				}
				break;
		    //[advancement] Fishy Business | Catch a fish | Use a fishing rod to catch any of these fishes:, Cod, Salmon, Tropical Fish, Pufferfish
			case "fishing_rod" :
				if(getScoreIfExists(world.scoreboard.getObjective("weaponsToolsArmorcatch_fish"), player) == 0){
					const fishArray = [];
					fishArray[0] = "cod";
					fishArray[1] = "salmon";
					fishArray[2] = "pufferfish";
					fishArray[3] = "tropical_fish";
					let inventoryPlayer = player.getComponent("minecraft:inventory");
					var i;
					var j;
					
					for(i = 0; i < fishArray.length; i++){
						for(j = 0; j < 36; j++){
							let slotItem = inventoryPlayer.container.getItem(j);
							
							if(slotItem){
								let slotItemName = slotItem.typeId;
								let slotItemAmount = slotItem.amount;
								
								if(slotItemName == ("minecraft:" + fishArray[i])){
									//scoreSet("weaponsToolsArmor", fishArray[i], player, slotItemAmount);
								}
							}
						}
					}
					system.runTimeout(() => {
						for(i = 0; i < fishArray.length; i++){
							for(j = 0; j < 36; j++){
								let slotItem = inventoryPlayer.container.getItem(j);
								
								if(slotItem){
									let slotItemName = slotItem.typeId;
									let slotItemAmount = slotItem.amount;
									
									if(slotItemName == ("minecraft:" + fishArray[i])){
										if(getScoreIfExists(world.scoreboard.getObjective("weaponsToolsArmor" + fishArray[i]), player) < slotItemAmount){
											//boolScore("weaponsToolsArmor", "catch_fish", player, 1);
											achievementUnlock(player,"Fishy Business")
										}else{
											//scoreSet("weaponsToolsArmor", fishArray[i], player, 0);
										}
									}
								}
							}
						}
					}, 20);
				}
				break;
		}
}

function worldAndBiome(){
	//to-do--------------------
		//[achievement] Adventuring Time | Discover 17 biomes. | Visit any 17 biomes. Does not have to be in a single world.
		//[achievement] Free Diver | Stay underwater for 2 minutes | Drink a potion of water breathing that can last for 2 minutes or more, then jump into the water or activate a conduit or sneak on a magma block underwater for 2 minutes.
		//[achievement] Hot tourist destination | Visit all Nether biomes | The achievement can be completed if one visit biomes in different worlds.
		//[achievement] Map Room | Place 9 fully explored, adjacent map items into 9 item frames in a 3 by 3 square. | The frames have to be on a wall, not the floor.
		//[achievement] Sail the 7 Seas | Visit all ocean biomes | Visit all ocean biomes except the deep warm ocean/legacy frozen ocean (as they are unused)
		//[achievement] Sleep with the Fishes | Spend a day underwater. | Spend 20 minutes underwater without any air.
		//[achievement] Sound of Music | Make the Meadows come alive with the sound of music from a jukebox. | Use a music disc on a jukebox in the Meadow biome.
		//[advancement] Adventuring Time | Discover every biome | Visit all of these 53 biomes:, Badlands, Bamboo Jungle, Beach, Birch Forest, Cherry Grove, Cold Ocean, Dark Forest, Deep Cold Ocean, Deep Dark, Deep Frozen Ocean, Deep Lukewarm Ocean, Deep Ocean, Desert, Dripstone Caves, Eroded Badlands, Flower Forest, Forest, Frozen Ocean, Frozen Peaks, Frozen River, Grove, Ice Spikes, Jagged Peaks, Jungle, Lukewarm Ocean, Lush Caves, Mangrove Swamp, Meadow, Mushroom Fields, Ocean, Old Growth Birch Forest, Old Growth Pine Taiga, Old Growth Spruce Taiga, Plains, River, Savanna, Savanna Plateau, Snowy Beach, Snowy Plains, Snowy Slopes, Snowy Taiga, Sparse Jungle, Stony Peaks, Stony Shore, Sunflower Plains, Swamp, Taiga, Warm Ocean, Windswept Forest, Windswept Gravelly Hills, Windswept Hills, Windswept Savanna, Wooded Badlands, The advancement is only for Overworld biomes. Other biomes may also be visited, but are ignored for this advancement.
		//[advancement] Hot Tourist Destinations | Explore all Nether biomes | Visit all of the 5 following biomes:, Basalt Deltas, Crimson Forest, Nether Wastes, Soul Sand Valley, Warped Forest, The advancement is only for Nether biomes. Other biomes may also be visited, but are ignored for this advancement.
		//[advancement] Sound of Music | Make the Meadows come alive with the sound of music from a Jukebox | While in a meadow biome, place down a jukebox and use a music disc on it.
	//done--------------------
}
//end achievement and advancement functions----------------------------------------

//helper functions----------------------------------------
function addToScore(category, item, player){
	let categoryId = category.replace(" ","");
	let itemId=categoryId+item.replace(" ","");
	const allBoards = world.scoreboard.getObjectives();
	const checkCategoryID = obj => obj.displayName === category;
	if(!allBoards.some(checkCategoryID)){ 
		world.scoreboard.addObjective(categoryId, category);
	}
	const checkItemID = obj => obj.displayName === category+" "+item;
	
	if(!allBoards.some(checkItemID)){ 
		world.scoreboard.addObjective(itemId, category+" "+item);
	}
	let categoryBoard = world.scoreboard.getObjective(categoryId);
	let itemBoard = world.scoreboard.getObjective(itemId);
	
	categoryBoard.addScore(player,1);
	itemBoard.addScore(player,1);
}
function calculateDistance(x1, z1, x2, z2) {
	return Math.floor(Math.hypot(Math.abs(z2 - z1), Math.abs(x2 - x1)));
}
function getScoreIfExists(board, player){
	let tempScore = 0;
	if (board){
		if (board.hasParticipant(player)){
			tempScore =board.getScore(player)
		}
	}
	return tempScore
}
function processBlockTags(tags){
	for(let index in tags) {
		const tag = tags[index]
		switch(tag){
			case "dirt":
				if (tags.includes("grass")){
					if (tags.includes("fertilize_area")){
						return "Grass"
					}
					return "Dirt"
				}
				return "Dirt Variants"
				break;
			case "stone":
				return "Stone bits"
			case "stone_pick_diggable":
				return "Copper Ore"
			case "iron_pick_diggable":
				break;
			case "diamond_pick_diggable":
				if(!tags.includes("iron_pick_diggable")){
					return "Obsidian"
				}
				return "Ore Blocks"
				break;
			case "wood":
				let tempTags=tags
				if (tags.includes("log")){
					let index = tempTags.indexOf("wood");
					tempTags.splice(index, 1)
					index = tempTags.indexOf("log");
					tempTags.splice(index, 1)
					
					return tempTags[0]+" Log"
				}
				if ("text_sign" in tags){
					return "Signs"
				}
				return "Wood Bits"
			case "pumpkin":
				return "Pumpkins"
			case "plant":
				return "2 high Plants or saplings"
			case "fertilize_area":
				if(!tags.includes("grass")){
					return "Flowers"
				}
				break;
			case "minecraft:crop":
				return "Cropland"
			case "sand":
				return "Sand"
			case "gravel":
				return "Gravel"
			case "metal":
				//cauldron and blocks of smelted iron bars
				return "Metal Blocks"
			case "snow":
				return "Snow Layers"
		}
	}
}
function getequipped(player){
	const equipComp = player.getComponent("minecraft:equippable");
	let equipment={"chest":"","Feet":"","Head":"","Legs":"","Mainhand":"Empty Hand","Offhand":""}
	if( equipComp.getEquipment("Chest")){
		equipment["chest"] = equipComp.getEquipment("Chest").typeId.replace("minecraft:","")
	}
	if(equipComp.getEquipment("Feet")){
		equipment["Feet"] = equipComp.getEquipment("Feet").typeId.replace("minecraft:","")
	}
	if(equipComp.getEquipment("Head")){
		equipment["Head"] = equipComp.getEquipment("Head").typeId.replace("minecraft:","")
	}
	if(equipComp.getEquipment("Legs")){
		equipment["Legs"] = equipComp.getEquipment("Legs").typeId.replace("minecraft:","")
	}
	if(equipComp.getEquipment("Mainhand")){
		equipment["Mainhand"] = equipComp.getEquipment("Mainhand").typeId.replace("minecraft:","")
	}
	if(equipComp.getEquipment("Offhand")){
		equipment["Offhand"] = equipComp.getEquipment("Offhand").typeId.replace("minecraft:","")
	}
	return equipment
}
function initializeObjectives(player){

}
function achievementUnlock(player,data){
	let display=player.onScreenDisplay
	display.setActionBar("\u00A7cachievement Unlocked: \u00A7e"+data)
	player.playSound("random.levelup")
}
function pearlThrow(player){
	let x1 = player.getDynamicProperty("pearlThrowX");
	let z1 = player.getDynamicProperty("pearlThrowZ");
	let x2 = Math.floor(player.location.x);
	let z2 = Math.floor(player.location.z);
	let pearlDist = calculateDistance(x1, z1, x2, z2);
	
	if(pearlDist > 100){
		usingItems("ender_pearl", player);
	}
	if(!world.scoreboard.getObjective("stats_travel_")){
		world.scoreboard.addObjective("stats_travel_", "stats_travel_");
	}
	if(!world.scoreboard.getObjective("stats_travel_Farthestenderpearlthrow")){
		world.scoreboard.addObjective("stats_travel_Farthestenderpearlthrow", "stats_travel_Farthest ender pearl throw");
		world.scoreboard.getObjective("stats_travel_Farthestenderpearlthrow").setScore(player, 0);
	}
	let bestPearl = world.scoreboard.getObjective("stats_travel_Farthestenderpearlthrow").getScore(player);
	if(pearlDist > bestPearl){
		world.scoreboard.getObjective("stats_travel_Farthestenderpearlthrow").setScore(player, pearlDist);
	}
}
function propertyToScore(player){
    //declare variables
	let daysPlayed = player.getDynamicProperty("playTimeD");
	let minPlayed = player.getDynamicProperty("playTimeM");
	let overTravel = player.getDynamicProperty("blockRun");
	
    //add categories
	if(!world.scoreboard.getObjective("stats_playTime_")){
		world.scoreboard.addObjective("stats_playTime_", "stats_playTime_");
	}
	if(!world.scoreboard.getObjective("stats_travel_")){
		world.scoreboard.addObjective("stats_travel_", "stats_travel_");
	}
	
    //add items
	if(!world.scoreboard.getObjective("stats_playTime_MinecraftDays")){
		world.scoreboard.addObjective("stats_playTime_MinecraftDays", "stats_playTime_Minecraft Days");
	}
	if(!world.scoreboard.getObjective("stats_playTime_Minutes")){
		world.scoreboard.addObjective("stats_playTime_Minutes", "stats_playTime_Minutes");
	}
	if(!world.scoreboard.getObjective("stats_travel_Overwoldblocktravel")){
		world.scoreboard.addObjective("stats_travel_Overwoldblocktravel", "stats_travel_Overwold block travel");
	}
	
    //set score
	world.scoreboard.getObjective("stats_playTime_MinecraftDays").setScore(player, (daysPlayed === undefined ? 0 : daysPlayed));
	world.scoreboard.getObjective("stats_playTime_Minutes").setScore(player, (minPlayed === undefined ? 0 : minPlayed));
	world.scoreboard.getObjective("stats_travel_Overwoldblocktravel").setScore(player, (overTravel === undefined ? 0 : overTravel));
}
function timer10Sec(){
	system.runInterval(() => {
		let playerArrayList = world.getAllPlayers();//get list of players
		
		for(let i = 0; i < playerArrayList.length; i++){
			//distance data sampling at defined interval
			overworldBlocksTravelled(playerArrayList[i]);
			//inventory checks for achievement items
			itemInventory(playerArrayList[i]);
			//effect checks for achievement
			statusAndEffects(playerArrayList[i]);
		}
	}, 200);
}
function timer1Day(){
	let timeVal = world.getTimeOfDay();
	
	if(timeVal == 6000){
		let playerArrayList = world.getAllPlayers();
		
		for(let i = 0; i < playerArrayList.length; i++){
			let dayCount = playerArrayList[i].getDynamicProperty("playTimeD");
			
			playerArrayList[i].setDynamicProperty("playTimeD", (dayCount === undefined ? -1 : dayCount) + 1);
			if(dayCount == 100){
				achievementTracker.setAchievment("PassingtheTime", playerArrayList[i]);//[achievement] Passing the Time | Play for 100 days. | Play for 100 Minecraft days, which is equivalent to 33 hours in real time.
			}
		}
	}
	
	system.run(timer1Day);
}
function timer1Min(){
	system.runInterval(() => {
		let playerArrayList = world.getAllPlayers();
		
		for(let i = 0; i < playerArrayList.length; i++){
			let minCount = playerArrayList[i].getDynamicProperty("playTimeM");
			
			playerArrayList[i].setDynamicProperty("playTimeM", (minCount === undefined ? 0 : minCount) + 1);
		}
	}, 1200);
}
//end helper functions----------------------------------------

//debug functions----------------------------------------
function facingDirection(player){
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
function getTheTime(style){
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
function moonCycle(){
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
function playerPosition(player, option){
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
			playerPosTxt =  " " + Math.floor(playerPosX) + ", " + Math.floor(playerPosY) + " " + Math.floor(playerPosZ);
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
			playerPosTxt = (playerDim == "overworld" ? (Math.floor(playerPosX/8) + ", " + Math.floor(playerPosZ/8)) : "");
			break;
		case "overworld" :
			playerPosTxt = (playerDim == "nether" ? (Math.floor(playerPosX*8) + ", " + Math.floor(playerPosZ*8)) : "");
			break;
	}
	
	return playerPosTxt;
}
function playerRespawn(player){
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
function worldlife(unit){
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
function worldSpawn(){
	let spawnX = world.getDefaultSpawnLocation().x;
	let spawnY = world.getDefaultSpawnLocation().y;
	let spawnZ = world.getDefaultSpawnLocation().z;
	let spawnTxt = " " + spawnX + ", " + spawnY + ", " + spawnZ;
	
	return spawnTxt;
}
//end debug functions----------------------------------------
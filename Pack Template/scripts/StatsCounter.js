import { world, system } from '@minecraft/server';
import {ActionFormData, ActionFormResponse } from "@minecraft/server-ui";

var blockBreaks = {}
var blocksUsed = {}
timer10Sec();

//subscriptions----------------------------------------
world.afterEvents.buttonPush.subscribe(event =>{ 
	buttonPushed(event);
});
world.afterEvents.entityDie.subscribe(event =>{ 
	entityDied(event);
});
world.afterEvents.entityLoad.subscribe(event =>{ 
	loadedEntity(event);
});
world.afterEvents.entitySpawn.subscribe(event =>{ 
	spawnedEntity(event);
});
world.afterEvents.itemCompleteUse.subscribe(event=>{
	itemComplete(event);
	//console.warn("complete use ")
});
world.afterEvents.itemUse.subscribe(event=>{
	//console.warn(event.itemStack.typeId)
	const comps=event.itemStack.getComponents()
	//console.warn(comps.length)
	//console.warn(comps)
	for(var i=0; i<comps.length;i++){
		//console.warn(i)
		//console.warn(comps[i])
	}
	statStick(event)
	useItem(event)
});
world.afterEvents.itemReleaseUse.subscribe(event=>{
	itemRelease(event);
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
//end subscriptions----------------------------------------

//ui functions----------------------------------------
function statList(player){
	let statForm = new ActionFormData()
		.title(player.name)
		.body(statListBody(player))
		.button("Close")
		.button("Achievements")
		.button("Advancements");
		
		statForm.show(player).then((response) => {
			switch(response.selection){
				case 1 :
					achieveList(player);
					break;
				case 2 :
					advanceList(player);
					break;
			}
		});
}
function statListBody(player){
	//add text
	    //stats--------------------
		let statTxt = "Stats";
		
		let statArrayTxt = [];
		statArrayTxt[0] = "Overworld Travel: " + getSomeScore("stats", "overworld_blocks", player) + " blocks";
		statArrayTxt[1] = "Total blocks placed: " + getSomeScore("stats", "blockPlaced_total", player);
		statArrayTxt[2] = "Total blocks broken: " + getSomeScore("stats", "blockBroken_total", player);
		
	//construct the body
		let boolPos = "\u2717";
		let boolNeg = " ";
		let indentSize = "    ";
		let nextLine = '\n';
		let indentNextLine = nextLine + indentSize;
		var i;
		
	    //stats--------------------
		let statBodyTxt = "";
		
		for(i = 0; i < statArrayTxt.length; i++){
			statBodyTxt = statBodyTxt + indentNextLine + statArrayTxt[i];
		}
		
		//display text
		return statTxt
			+ statBodyTxt;
}
function achieveList(player){
	let achieveForm = new ActionFormData()
		.title(player.name)
		.body(achieveListBody(player))
		.button("Close")
		.button("Stats");
		
		achieveForm.show(player).then((response) => {
			switch(response.selection){
				case 1 :
					statList(player);
					break;
			}
		});
}
function achieveListBody(player){
	//add text
	    //achievements--------------------
		let achievementTxt = "Achievements";
		
		//blockInteractions
		let blockInteractionsArrayTxt = [];
		blockInteractionsArrayTxt[0] = ""
		
		//craftAndCook
		let craftAndCookArrayTxt = [];
		craftAndCookArrayTxt[0] = ""
		
		//eatAndDrink
		let eatAndDrinkArrayTxt = [];
		eatAndDrinkArrayTxt[0] = ""
		
		//getSomeWhere
		let getSomeWhereArrayTxt = [];
		getSomeWhereArrayTxt[0] = "Go to The End: " + getSomeScore("getSomeWhere", "the_end", player);
		
		//itemInventory
		let itemInventoryArrayTxt = [];
		itemInventoryArrayTxt[0] = "Get a crafting table: " + getSomeScore("itemInventory", "crafting_table", player);
		itemInventoryArrayTxt[1] = "Get a stone pickaxe: " + getSomeScore("itemInventory", "stone_pickaxe", player);
		itemInventoryArrayTxt[2] = "Full set of netherite armor: " + getSomeScore("itemInventory", "netherite_armor", player);
		itemInventoryArrayTxt[3] = "Get an iron ingot: " + getSomeScore("itemInventory", "iron_ingot", player);
		itemInventoryArrayTxt[4] = "Get a diamond: " + getSomeScore("itemInventory", "diamond", player);
		itemInventoryArrayTxt[5] = "Catch a fish in a bucket: " + getSomeScore("itemInventory", "fish_bucket", player);
		itemInventoryArrayTxt[6] = "Get a blaze rod: " + getSomeScore("itemInventory", "blaze_rod", player);
		
		//entityInteractions
		let entityInteractionsArrayTxt = [];
		entityInteractionsArrayTxt[0] = ""
		
		//entityKills
		let entityKillsArrayTxt = [];
		entityKillsArrayTxt[0] = ""
		
		//redstoneInteractions
		let redstoneInteractionsArrayTxt = [];
		redstoneInteractionsArrayTxt[0] = ""
		
		//spawnAndBreed
		let spawnAndBreedArrayTxt = [];
		spawnAndBreedArrayTxt[0] = "Summon an iron golem: " + getSomeScore("spawnAndBreed", "iron_golem", player);
		spawnAndBreedArrayTxt[1] = "Summon a wither: " + getSomeScore("spawnAndBreed", "wither", player);
		spawnAndBreedArrayTxt[2] = "Respawn the dragon: " + getSomeScore("spawnAndBreed", "ender_dragon_bool", player);
		
		//statusAndEffects
		let statusAndEffectsArrayTxt = [];
		statusAndEffectsArrayTxt[0] = ""
		
		//trading
		let tradingArrayTxt = [];
		tradingArrayTxt[0] = ""
				
		//usingItems
		let usingItemsArrayTxt = [];
		usingItemsArrayTxt[0] = ""
		
		//weaponsToolsArmor
		let weaponsToolsArmorArrayTxt = [];
		weaponsToolsArmorArrayTxt[0] = "Hit a target block bulls eye: " + getSomeScore("weaponsToolsArmor", "target", player);
		
		//worldAndBiome
		let worldAndBiomeArrayTxt = [];
		worldAndBiomeArrayTxt[0] = ""
		
	//construct the body
		let boolPos = "\u2717";
		let boolNeg = " ";
		let indentSize = "    ";
		let nextLine = '\n';
		let indentNextLine = nextLine + indentSize;
		var i;
		
	    //achievements--------------------
		//initialize variables
		let blockInteractionsBodyTxt = "";
		let craftAndCookBodyTxt = "";
		let eatAndDrinkBodyTxt = "";
		let getSomeWhereBodyTxt = "";
		let itemInventoryBodyTxt = "";
		let entityInteractionsBodyTxt = "";
		let entityKillsBodyTxt = "";
		let redstoneInteractionsBodyTxt = "";
		let statusAndEffectsBodyTxt = "";
		let spawnAndBreedBodyTxt = "";
		let tradingBodyTxt = "";
		let usingItemsBodyTxt = "";
		let weaponsToolsArmorBodyTxt = "";
		let worldAndBiomeBodyTxt = "";
		
		//concatenate text sections
		for(i = 0; i < blockInteractionsArrayTxt.length; i++){
			blockInteractionsBodyTxt = blockInteractionsBodyTxt + indentNextLine + (blockInteractionsArrayTxt[i].concat(".,.").replace("0.,.", boolNeg).replace("1.,.", boolPos).replace(".,.", ""));
		}
		for(i = 0; i < craftAndCookArrayTxt.length; i++){
			craftAndCookBodyTxt = craftAndCookBodyTxt + indentNextLine + (craftAndCookArrayTxt[i].concat(".,.").replace("0.,.", boolNeg).replace("1.,.", boolPos).replace(".,.", ""));
		}
		for(i = 0; i < eatAndDrinkArrayTxt.length; i++){
			eatAndDrinkBodyTxt = eatAndDrinkBodyTxt + indentNextLine + (eatAndDrinkArrayTxt[i].concat(".,.").replace("0.,.", boolNeg).replace("1.,.", boolPos).replace(".,.", ""));
		}
		for(i = 0; i < getSomeWhereArrayTxt.length; i++){
			getSomeWhereBodyTxt = getSomeWhereBodyTxt + indentNextLine + (getSomeWhereArrayTxt[i].concat(".,.").replace("0.,.", boolNeg).replace("1.,.", boolPos).replace(".,.", ""));
		}
		for(i = 0; i < itemInventoryArrayTxt.length; i++){
			itemInventoryBodyTxt = itemInventoryBodyTxt + indentNextLine + (itemInventoryArrayTxt[i].concat(".,.").replace("0.,.", boolNeg).replace("1.,.", boolPos).replace(".,.", ""));
		}
		for(i = 0; i < entityInteractionsArrayTxt.length; i++){
			entityInteractionsBodyTxt = entityInteractionsBodyTxt + indentNextLine + (entityInteractionsArrayTxt[i].concat(".,.").replace("0.,.", boolNeg).replace("1.,.", boolPos).replace(".,.", ""));
		}
		for(i = 0; i < entityKillsArrayTxt.length; i++){
			entityKillsBodyTxt = entityKillsBodyTxt + indentNextLine + (entityKillsArrayTxt[i].concat(".,.").replace("0.,.", boolNeg).replace("1.,.", boolPos).replace(".,.", ""));
		}
		for(i = 0; i < redstoneInteractionsArrayTxt.length; i++){
			redstoneInteractionsBodyTxt = redstoneInteractionsBodyTxt + indentNextLine + (redstoneInteractionsArrayTxt[i].concat(".,.").replace("0.,.", boolNeg).replace("1.,.", boolPos).replace(".,.", ""));
		}
		for(i = 0; i < spawnAndBreedArrayTxt.length; i++){
			spawnAndBreedBodyTxt = spawnAndBreedBodyTxt + indentNextLine + (spawnAndBreedArrayTxt[i].concat(".,.").replace("0.,.", boolNeg).replace("1.,.", boolPos).replace(".,.", ""));
		}
		for(i = 0; i < statusAndEffectsArrayTxt.length; i++){
			statusAndEffectsBodyTxt = statusAndEffectsBodyTxt + indentNextLine + (statusAndEffectsArrayTxt[i].concat(".,.").replace("0.,.", boolNeg).replace("1.,.", boolPos).replace(".,.", ""));
		}
		for(i = 0; i < tradingArrayTxt.length; i++){
			tradingBodyTxt = tradingBodyTxt + indentNextLine + (tradingArrayTxt[i].concat(".,.").replace("0.,.", boolNeg).replace("1.,.", boolPos).replace(".,.", ""));
		}
		for(i = 0; i < usingItemsArrayTxt.length; i++){
			usingItemsBodyTxt = usingItemsBodyTxt + indentNextLine + (usingItemsArrayTxt[i].concat(".,.").replace("0.,.", boolNeg).replace("1.,.", boolPos).replace(".,.", ""));
		}
		for(i = 0; i < weaponsToolsArmorArrayTxt.length; i++){
			weaponsToolsArmorBodyTxt = weaponsToolsArmorBodyTxt + indentNextLine + (weaponsToolsArmorArrayTxt[i].concat(".,.").replace("0.,.", boolNeg).replace("1.,.", boolPos).replace(".,.", ""));
		}
		for(i = 0; i < worldAndBiomeArrayTxt.length; i++){
			worldAndBiomeBodyTxt = worldAndBiomeBodyTxt + indentNextLine + (worldAndBiomeArrayTxt[i].concat(".,.").replace("0.,.", boolNeg).replace("1.,.", boolPos).replace(".,.", ""));
		}
		
		//display text
		return achievementTxt
			+ blockInteractionsBodyTxt
			+ craftAndCookBodyTxt
			+ eatAndDrinkBodyTxt
			+ getSomeWhereBodyTxt
			+ itemInventoryBodyTxt
			+ entityInteractionsBodyTxt
			+ entityKillsBodyTxt
			+ redstoneInteractionsBodyTxt
			+ spawnAndBreedBodyTxt
			+ statusAndEffectsBodyTxt
			+ tradingBodyTxt
			+ usingItemsBodyTxt
			+ weaponsToolsArmorBodyTxt
			+ worldAndBiomeBodyTxt;
}
function advanceList(player){
	let advanceForm = new ActionFormData()
		.title(player.name)
		.body(advanceListBody(player))
		.button("Close")
		.button("Stats");
		
		advanceForm.show(player).then((response) => {
			switch(response.selection){
				case 1 :
					statList(player);
					break;
			}
		});
}
function advanceListBody(player){
	//add text
	    //advancements--------------------
		let advancementTxt = "Advancements";
		
		//blockInteractions
		let blockInteractionsArrayTxt = [];
		blockInteractionsArrayTxt[0] = ""
		
		//craftAndCook
		let craftAndCookArrayTxt = [];
		craftAndCookArrayTxt[0] = ""
		
		//eatAndDrink
		let eatAndDrinkArrayTxt = [];
		eatAndDrinkArrayTxt[0] = ""
		
		//getSomeWhere
		let getSomeWhereArrayTxt = [];
		getSomeWhereArrayTxt[0] = "Go to the Nether: " + getSomeScore("getSomeWhere", "nether", player);
		getSomeWhereArrayTxt[1] = "Go to The End: " + getSomeScore("getSomeWhere", "the_end", player);
		getSomeWhereArrayTxt[2] = "Enter a Bastion: " + getSomeScore("getSomeWhere", "bastion_remnant", player);
		getSomeWhereArrayTxt[3] = "Enter a Fortress: " + getSomeScore("getSomeWhere", "nether_fortress", player);
		getSomeWhereArrayTxt[4] = "Go 7000 blocks in the Overworld: " + getSomeScore("getSomeWhere", "overworld7000", player);
		
		//itemInventory
		let itemInventoryArrayTxt = [];
		itemInventoryArrayTxt[0] = "Get a crafting table: " + getSomeScore("itemInventory", "crafting_table", player);
		itemInventoryArrayTxt[1] = "Get a stone pickaxe: " + getSomeScore("itemInventory", "stone_pickaxe", player);
		itemInventoryArrayTxt[2] = "Get an iron pickaxe: " + getSomeScore("itemInventory", "iron_pickaxe", player);
		itemInventoryArrayTxt[3] = "Get a netherite hoe: " + getSomeScore("itemInventory", "netherite_hoe", player);
		itemInventoryArrayTxt[4] = "Get some iron armor: " + getSomeScore("itemInventory", "iron_armor", player);
		itemInventoryArrayTxt[5] = "Get some diamond armor: " + getSomeScore("itemInventory", "diamond_armor", player);
		itemInventoryArrayTxt[6] = "Full set of netherite armor: " + getSomeScore("itemInventory", "netherite_armor", player);
		itemInventoryArrayTxt[7] = "Get a pair of elytra: " + getSomeScore("itemInventory", "elytra", player);
		itemInventoryArrayTxt[8] = "Get an iron ingot: " + getSomeScore("itemInventory", "iron_ingot", player);
		itemInventoryArrayTxt[9] = "Get a diamond: " + getSomeScore("itemInventory", "diamond", player);
		itemInventoryArrayTxt[10] = "Get some ancient debris: " + getSomeScore("itemInventory", "ancient_debris", player);
		itemInventoryArrayTxt[11] = "Get a bucket of lava: " + getSomeScore("itemInventory", "lava_bucket", player);
		itemInventoryArrayTxt[12] = "Catch a fish in a bucket: " + getSomeScore("itemInventory", "fish_bucket", player);
		itemInventoryArrayTxt[13] = "Get a bucket of axolotl: " + getSomeScore("itemInventory", "axolotl_bucket", player);
		itemInventoryArrayTxt[14] = "Catch a tadpole in a bucket: " + getSomeScore("itemInventory", "tadpole_bucket", player);
		itemInventoryArrayTxt[15] = "Get cobblestone, blackstone,\n        or cobbled deepslate: " + getSomeScore("itemInventory", "got_cobble", player);
		itemInventoryArrayTxt[16] = "Get some obsidian: " + getSomeScore("itemInventory", "obsidian", player);
		itemInventoryArrayTxt[17] = "Get some crying obsidian: " + getSomeScore("itemInventory", "crying_obsidian", player);
		itemInventoryArrayTxt[18] = "Get a blaze rod: " + getSomeScore("itemInventory", "blaze_rod", player);
		itemInventoryArrayTxt[19] = "Get a dragon egg: " + getSomeScore("itemInventory", "dragon_egg", player);
		itemInventoryArrayTxt[20] = "Get a sniffer egg: " + getSomeScore("itemInventory", "sniffer_egg", player);
		itemInventoryArrayTxt[21] = "Get a pottery sherd: " + getSomeScore("itemInventory", "pottery_sherd", player);
		
		//entityInteractions
		let entityInteractionsArrayTxt = [];
		entityInteractionsArrayTxt[0] = ""
		
		//entityKills
		let entityKillsArrayTxt = [];
		entityKillsArrayTxt[0] = ""
		
		//redstoneInteractions
		let redstoneInteractionsArrayTxt = [];
		redstoneInteractionsArrayTxt[0] = ""
		
		//spawnAndBreed
		let spawnAndBreedArrayTxt = [];
		spawnAndBreedArrayTxt[0] = "Summon an iron golem: " + getSomeScore("spawnAndBreed", "iron_golem", player);
		spawnAndBreedArrayTxt[1] = "Summon a wither: " + getSomeScore("spawnAndBreed", "wither", player);
		spawnAndBreedArrayTxt[2] = "Respawn the dragon: " + getSomeScore("spawnAndBreed", "ender_dragon_bool", player);
		spawnAndBreedArrayTxt[3] = "Breed 2 animals together: " + getSomeScore("spawnAndBreed", "breed_some", player);
		spawnAndBreedArrayTxt[4] = "Breed all the animals: " + getSomeScore("spawnAndBreed", "breed_all_bool", player);
		
		//statusAndEffects
		let statusAndEffectsArrayTxt = [];
		statusAndEffectsArrayTxt[0] = "Get hero of the village: " + getSomeScore("statusAndEffects", "hero_of_the_village", player);
		statusAndEffectsArrayTxt[1] = "All potion effects at once: " + getSomeScore("statusAndEffects", "potion_effects_bool", player);
		statusAndEffectsArrayTxt[2] = "All effects at once: " + getSomeScore("statusAndEffects", "all_effects_bool", player);
		
		//trading
		let tradingArrayTxt = [];
		tradingArrayTxt[0] = ""
				
		//usingItems
		let usingItemsArrayTxt = [];
		usingItemsArrayTxt[0] = ""
		
		//weaponsToolsArmor
		let weaponsToolsArmorArrayTxt = [];
		weaponsToolsArmorArrayTxt[0] = "Shoot a Crossbow: " + getSomeScore("weaponsToolsArmor", "crossbow", player);
		weaponsToolsArmorArrayTxt[1] = "Shoot something with an arrow: " + getSomeScore("weaponsToolsArmor", "arrow", player);
		weaponsToolsArmorArrayTxt[2] = "Hit a mob with a thrown trident: " + getSomeScore("weaponsToolsArmor", "thrown_trident", player);
		weaponsToolsArmorArrayTxt[3] = "Catch a fish: " + getSomeScore("weaponsToolsArmor", "catch_fish", player);
		
		//worldAndBiome
		let worldAndBiomeArrayTxt = [];
		worldAndBiomeArrayTxt[0] = ""
		
	//construct the body
		let boolPos = "\u2717";
		let boolNeg = " ";
		let indentSize = "    ";
		let nextLine = '\n';
		let indentNextLine = nextLine + indentSize;
		var i;
		
	    //advancements--------------------
		//initialize variables
		let blockInteractionsBodyTxt = "";
		let craftAndCookBodyTxt = "";
		let eatAndDrinkBodyTxt = "";
		let getSomeWhereBodyTxt = "";
		let itemInventoryBodyTxt = "";
		let entityInteractionsBodyTxt = "";
		let entityKillsBodyTxt = "";
		let redstoneInteractionsBodyTxt = "";
		let statusAndEffectsBodyTxt = "";
		let spawnAndBreedBodyTxt = "";
		let tradingBodyTxt = "";
		let usingItemsBodyTxt = "";
		let weaponsToolsArmorBodyTxt = "";
		let worldAndBiomeBodyTxt = "";
		
		//concatenate text sections
		for(i = 0; i < blockInteractionsArrayTxt.length; i++){
			blockInteractionsBodyTxt = blockInteractionsBodyTxt + indentNextLine + (blockInteractionsArrayTxt[i].concat(".,.").replace("0.,.", boolNeg).replace("1.,.", boolPos).replace(".,.", ""));
		}
		for(i = 0; i < craftAndCookArrayTxt.length; i++){
			craftAndCookBodyTxt = craftAndCookBodyTxt + indentNextLine + (craftAndCookArrayTxt[i].concat(".,.").replace("0.,.", boolNeg).replace("1.,.", boolPos).replace(".,.", ""));
		}
		for(i = 0; i < eatAndDrinkArrayTxt.length; i++){
			eatAndDrinkBodyTxt = eatAndDrinkBodyTxt + indentNextLine + (eatAndDrinkArrayTxt[i].concat(".,.").replace("0.,.", boolNeg).replace("1.,.", boolPos).replace(".,.", ""));
		}
		for(i = 0; i < getSomeWhereArrayTxt.length; i++){
			getSomeWhereBodyTxt = getSomeWhereBodyTxt + indentNextLine + (getSomeWhereArrayTxt[i].concat(".,.").replace("0.,.", boolNeg).replace("1.,.", boolPos).replace(".,.", ""));
		}
		for(i = 0; i < itemInventoryArrayTxt.length; i++){
			itemInventoryBodyTxt = itemInventoryBodyTxt + indentNextLine + (itemInventoryArrayTxt[i].concat(".,.").replace("0.,.", boolNeg).replace("1.,.", boolPos).replace(".,.", ""));
		}
		for(i = 0; i < entityInteractionsArrayTxt.length; i++){
			entityInteractionsBodyTxt = entityInteractionsBodyTxt + indentNextLine + (entityInteractionsArrayTxt[i].concat(".,.").replace("0.,.", boolNeg).replace("1.,.", boolPos).replace(".,.", ""));
		}
		for(i = 0; i < entityKillsArrayTxt.length; i++){
			entityKillsBodyTxt = entityKillsBodyTxt + indentNextLine + (entityKillsArrayTxt[i].concat(".,.").replace("0.,.", boolNeg).replace("1.,.", boolPos).replace(".,.", ""));
		}
		for(i = 0; i < redstoneInteractionsArrayTxt.length; i++){
			redstoneInteractionsBodyTxt = redstoneInteractionsBodyTxt + indentNextLine + (redstoneInteractionsArrayTxt[i].concat(".,.").replace("0.,.", boolNeg).replace("1.,.", boolPos).replace(".,.", ""));
		}
		for(i = 0; i < spawnAndBreedArrayTxt.length; i++){
			spawnAndBreedBodyTxt = spawnAndBreedBodyTxt + indentNextLine + (spawnAndBreedArrayTxt[i].concat(".,.").replace("0.,.", boolNeg).replace("1.,.", boolPos).replace(".,.", ""));
		}
		for(i = 0; i < statusAndEffectsArrayTxt.length; i++){
			statusAndEffectsBodyTxt = statusAndEffectsBodyTxt + indentNextLine + (statusAndEffectsArrayTxt[i].concat(".,.").replace("0.,.", boolNeg).replace("1.,.", boolPos).replace(".,.", ""));
		}
		for(i = 0; i < tradingArrayTxt.length; i++){
			tradingBodyTxt = tradingBodyTxt + indentNextLine + (tradingArrayTxt[i].concat(".,.").replace("0.,.", boolNeg).replace("1.,.", boolPos).replace(".,.", ""));
		}
		for(i = 0; i < usingItemsArrayTxt.length; i++){
			usingItemsBodyTxt = usingItemsBodyTxt + indentNextLine + (usingItemsArrayTxt[i].concat(".,.").replace("0.,.", boolNeg).replace("1.,.", boolPos).replace(".,.", ""));
		}
		for(i = 0; i < weaponsToolsArmorArrayTxt.length; i++){
			weaponsToolsArmorBodyTxt = weaponsToolsArmorBodyTxt + indentNextLine + (weaponsToolsArmorArrayTxt[i].concat(".,.").replace("0.,.", boolNeg).replace("1.,.", boolPos).replace(".,.", ""));
		}
		for(i = 0; i < worldAndBiomeArrayTxt.length; i++){
			worldAndBiomeBodyTxt = worldAndBiomeBodyTxt + indentNextLine + (worldAndBiomeArrayTxt[i].concat(".,.").replace("0.,.", boolNeg).replace("1.,.", boolPos).replace(".,.", ""));
		}
		
		//display text
		return advancementTxt
			+ blockInteractionsBodyTxt
			+ craftAndCookBodyTxt
			+ eatAndDrinkBodyTxt
			+ getSomeWhereBodyTxt
			+ itemInventoryBodyTxt
			+ entityInteractionsBodyTxt
			+ entityKillsBodyTxt
			+ redstoneInteractionsBodyTxt
			+ spawnAndBreedBodyTxt
			+ statusAndEffectsBodyTxt
			+ tradingBodyTxt
			+ usingItemsBodyTxt
			+ weaponsToolsArmorBodyTxt
			+ worldAndBiomeBodyTxt;
}
//end ui functions----------------------------------------

//event functions----------------------------------------
function preBreak(event){
	blockBreaks["L"+event.block.x+" "+event.block.y+" "+event.block.z]=event.block.getTags()
}
function blockBroken(event){
	let player = event.player;
	let blockTags = blockBreaks["L"+event.block.x+" "+event.block.y+" "+event.block.z]
	delete blockBreaks["L"+event.block.x+" "+event.block.y+" "+event.block.z]
	addToScore("stats", processBlockTags(blockTags), player)
	
	addToScore("stats", "blockBroken_total", player);
}
function processBlockTags(tags){
	for(let index in tags) {
		const tag = tags[index]
		switch(tag){
			case "dirt":
				if (tags.includes("grass")){
					if (tags.includes("fertilize_area")){
						return "grass"
					}
					return "dirt"
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
			case "minecraft:crop":
				return "crop"
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
function blockPlaced(event){
	let player = event.player;
	
	addToScore("stats", "blockPlaced_total", player);
}
function buttonPushed(event){
	addToScore("Redstone Interactions","Button", event.source)//This is not ideal needs a patch as stone will become cobble
}
function changedDimension(event){
	let player = event.player;
	let getDim = event.toDimension.id.replace("minecraft:","");
	
	if(getDim == "nether" || (getDim == "the_end")){
		getSomeWhere(getDim, player);
	}
}
function entityDied(event){
	const victim = event.deadEntity
	const cause = event.damageSource
	if(event.damageSource.damagingEntity){
		const killer = event.damageSource.damagingEntity
		if(killer.typeId == "minecraft:player"){
			addToScore("Entities Killed","Player", event.source)
		}
	}
	if(victim.typeId == "minecraft:player"){
		addToScore("Deaths",event.damageSource.cause, event.source)
	}
}
function hitByProjectile(event){
	let projectile = event.projectile.typeId.replace("minecraft:","");
	let source = event.source;
	
	if(source && (source.typeId == "minecraft:player")){
		switch(projectile){
			case "arrow" ://*fall through*
			case "thrown_trident" :
				weaponsToolsArmor(projectile, source);
				break;
		}
	}
}
function initSpawn(event){
	let player = event.player;
	
	if(!player.hasTag("firstSpawn")){//verify the player hasn't spawned previously
		//console.warn("I've initialized");
		scoreSet("location","initialPointX", player, player.location.x);//record player initial location x
		scoreSet("location","initialPointZ", player, player.location.z);//record player initial location z
		event.player.runCommandAsync("loot give @s loot statStick");//give statStick to player
		player.addTag("firstSpawn");//add tag to record that player has already spawned initially
	}
}
function itemComplete(event){
	let player = event.source;
	let itemName = event.itemStack.typeId.replace("minecraft:","");
	
	//console.warn("item used")
	const comps=event.itemStack.getComponents()
	//console.warn(comps.length)
	//console.warn(comps)
	for(var i=0; i<comps.length;i++){
		//console.warn(i)
		//console.warn(comps[i])
	}
	//addToScore("Items Uses",itemName, event.source)//This is not ideal needs a patch as stone will become cobble
	
	switch(itemName){
		case "crossbow" :
			boolScore("weaponsToolsArmor", "charge_bool", player, 1);
			system.runTimeout(() => {
				boolScore("weaponsToolsArmor", "charge_bool", player, 0);
			}, 200);
			break;
	}
}
function itemRelease(event){
	let player = event.source;
	let itemName = event.itemStack.typeId.replace("minecraft:","");
	
	switch(itemName){
		case "bow" :
			boolScore("weaponsToolsArmor", "shoot_bool", player, 1);
			system.runTimeout(() => {
				boolScore("weaponsToolsArmor", "shoot_bool", player, 0);
			}, 40);
			break;
	}
}
function leverFlipped(event){
	addToScore("Redstone Interactions","Lever", event.player);
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
			getSomeWhere("bastion_remnant", closePlayers[i]);
			//console.warn(closePlayers[i].name);
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
				//console.warn(closePlayers[i].name);
				getSomeWhere("nether_fortress", closePlayers[i]);
			}
			break;
		}
	    //check for player spawned mobs
		case "iron_golem" ://*fall through*
		case "wither" :{
			let playersClosest = entity.dimension.getPlayers({
				closest: 1,
				location: {x: entity.location.x, y: entity.location.y, z: entity.location.z}
			});
			
			spawnAndBreed(entityName, playersClosest[0]);
			break;
		}
		case "ender_dragon" :{
			let closePlayers = entity.dimension.getPlayers({
				maxDistance: 192,
				location: {x: entity.location.x, y: entity.location.y, z: entity.location.z}
			});
			
			for(var i = 0; i < closePlayers.length; i++){
				spawnAndBreed(entityName, closePlayers[i]);
			}
			break;
		}
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
		//console.warn("Not your average stick");
		statList(player);//initiate ui
	}
}
function targetHit(event){
	let power = event.redstonePower;
	
	if(power == 15){
		let closePlayers = event.dimension.getPlayers({
			maxDistance: 70,
			location: {x: event.hitVector.x, y: event.hitVector.y, z: event.hitVector.z}
		});
		
		for(var i = 0; i < closePlayers.length; i++){
			if(getSomeScore("weaponsToolsArmor", "shoot_bool", closePlayers[i]) == 1){
				weaponsToolsArmor("target", closePlayers[i]);
			}
		}
	}
}
function useItem(event){
	let player = event.source;
	let itemName = event.itemStack.typeId.replace("minecraft:","");
	
	switch(itemName){
		case "crossbow" :
			if(getSomeScore("weaponsToolsArmor", "charge_bool", player) == 1){
				weaponsToolsArmor(itemName, player);
			}
			break;
		case "fishing_rod" :
			weaponsToolsArmor(itemName, player);
			break;
	}
}
//end event functions----------------------------------------

//stat functions----------------------------------------
function overworldBlocksTravelled(player){
	//get value of blocks travelled, or initialize if undefined
		let blkDist = getSomeScore("stats", "overworld_blocks", player);
		
	//verify the player is in the overworld. calculate distance from last saved checkpoint or initial spawn if distance is 0
		if(player.dimension.id == "minecraft:overworld"){
			let x1 = getSomeScore("location", "checkpointX", player);
			let z1 = getSomeScore("location", "checkpointZ", player);
			
			if(blkDist == 0){//if first time, calculate from initial spawn location
				x1 = getSomeScore("location","initialPointX", player);
				z1 = getSomeScore("location","initialPointZ", player);
			}
			let x2 = player.location.x;
			let z2 = player.location.z;
			blkDist = blkDist + calculateDistance(x1, z1, x2, z2);
		}
	//check if blocks travelled are more than 7000, then trigger achievement
		if(blkDist > 7000){
			getSomeWhere("overworld7000", player);
		}
	//record the calculated blocks travelled, and set new checkpoints
		scoreSet("stats","overworld_blocks", player, blkDist);
		scoreSet("location","checkpointX", player, player.location.x);
		scoreSet("location","checkpointZ", player, player.location.z);
	//output blocks travelled
		//console.warn("I've travelled " + blkDist + " blocks")
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
		//[achievement] Organizational Wizard | Name a Shulker Box with an Anvil | —
		//[achievement] Me Gold! | Dig up a buried treasure | Open a buried treasure chest
		//[achievement] Sneak 100 | Sneaking [sic] next to a Sculk Sensor without triggering it | Sneak next to a Sculk Sensor or Warden without triggering or aggravating it.
		//[achievement] Sound the Alarm! | Ring the bell with a hostile enemy in the village. | —
		//[achievement] Sticky Situation | Slide down a honey block to slow your fall. | —
		//[achievement] Tie Dye Outfit | Use a cauldron to dye all 4 unique pieces of leather armor. | —
		//[achievement] Top of the World | Place scaffolding to the world limit. | Place a scaffolding at the world height limit.
		//[achievement] Total Beelocation | Move and place a Bee Nest, with 3 bees inside, using Silk Touch. | —
		//[achievement] Trampoline | Bounce 30 blocks upward off a slime block. | —
		//[achievement] Wax on, Wax off | Apply and remove Wax from all the Copper blocks!!! | Wax and de-wax each oxidation stage of all 4 Copper Blocks in the game, which include cut copper blocks, stairs, & slabs.
		//[advancement] Bee Our Guest | Use a Campfire to collect Honey from a Beehive using a Glass Bottle without aggravating the Bees | Use a glass bottle on a beehive or bee nest while not angering the bees inside.
		//[advancement] Country Lode, Take Me Home | Use a Compass on a Lodestone | —
		//[advancement] Enchanter | Enchant an item at an Enchanting Table | Insert an item in an enchanting table, then apply an enchantment.
		//[advancement] Not Quite ""Nine"" Lives | Charge a Respawn Anchor to the maximum | —
		//[advancement] Sneak 100 | Sneak near a Sculk Sensor or Warden to prevent it from detecting you | Sneak within 8 blocks from a sculk sensor, or 16 blocks from a warden.
		//[advancement] Sticky Situation | Jump into a Honey Block to break your fall | Collide on a vertical side of a honey block when in air.
		//[advancement] Sweet Dreams | Sleep in a Bed to change your respawn point | Lie down in a bed. The advancement is granted as soon as the player is in the bed, even if the player does not successfully sleep.
		//[advancement] Total Beelocation | Move a Bee Nest, with 3 Bees inside, using Silk Touch | —
		//[advancement] War Pigs | Loot a Chest in a Bastion Remnant | Open a naturally generated, never-before opened chest in a bastion remnant.
		//[advancement] Wax Off | Scrape Wax off of a Copper block! | Use an axe to revert a waxed copper block.
		//[advancement] Wax On | Apply Honeycomb to a Copper block! | Use a honeycomb on a copper block.
	//in work--------------------
	//done--------------------
}
function craftAndCook(){
	//to-do--------------------
		//[achievement] Alternative Fuel | Power a furnace with a kelp block | This achievement is awarded only if the dried kelp block is put into the furnace's fuel slot manually, not via redstone components such as hoppers.
		//[achievement] Delicious Fish | Catch and cook a fish! | Pick up a cooked cod after cooking it in a Furnace, Smoker, Campfire, or Soul Campfire. Doesn't work if the block used is hooked up to a hopper, as the player is not getting the item directly from the output.
		//[achievement] Fruit on the Loom | Make a banner using an Enchanted Apple Stencil | Make a banner using an enchanted apple.
		//[achievement] Into The Nether | Construct a Nether Portal. | Light a nether portal.
		//[achievement] Local Brewery | Brew a potion. | Pick up a potion from a brewing stand potion slot. An already-created potion placed and removed qualifies.
		//[achievement] Moskstraumen | Activate a Conduit | Place a conduit in a valid prismarine/sea lantern structure to activate it.
		//[achievement] Pot Planter | Craft and place a Flower Pot. | —
		//[achievement] Renewable Energy | Smelt wood trunks using charcoal to make more charcoal. | Smelt a wooden log with charcoal as the fuel.
		//[achievement] Smelt Everything! | Connect 3 Chests to a single Furnace using 3 Hoppers. | Be within the range of three chests connected to a Furnace with 3 Hoppers.
		//[achievement] Super Fuel | Power a Furnace with Lava | —
		//[advancement] Local Brewery | Brew a Potion | Pick up an item from a brewing stand potion slot. This does not need to be a potion. Water bottles or even glass bottles can also trigger this advancement.[3]
		//[advancement] We Need to Go Deeper | Build, light and enter a Nether Portal | Enter the Nether dimension.
	//in work--------------------
	//done--------------------
}
function eatAndDrink(){
	//to-do--------------------
		//[achievement] Castaway | Eat nothing but dried kelp for three in-game days | Eat dried kelp once; in the following three in-game days, eat nothing but dried kelp.
		//[achievement] Iron Belly | Stop starvation using Rotten Flesh. | Eat a piece of rotten flesh while starving (zero hunger points).
		//[achievement] Overpowered | Eat an Enchanted Apple | Eat an enchanted apple.
		//[achievement] Pork Chop | Cook and eat a pork chop. | —
		//[achievement] Rabbit Season | Cook and Eat Rabbit Meat | —
		//[advancement] A Balanced Diet | Eat everything that is edible, even if it's not good for you | Eat each of these 40 foods:, Apple, Baked Potato, Beetroot, Beetroot Soup, Bread, Carrot, Chorus Fruit, Cooked Chicken, Cooked Cod, Cooked Mutton, Cooked Porkchop, Cooked Rabbit, Cooked Salmon, Cookie, Dried Kelp, Enchanted Golden Apple, Glow Berries, Golden Apple, Golden Carrot, Honey Bottle, Melon Slice, Mushroom Stew, Poisonous Potato, Potato, Pufferfish, Pumpkin Pie, Rabbit Stew, Raw Beef, Raw Chicken, Raw Cod, Raw Mutton, Raw Porkchop, Raw Rabbit, Raw Salmon, Rotten Flesh, Spider Eye, Steak, Suspicious Stew, Sweet Berries, Tropical Fish, Other foods and consumables can be eaten, but are ignored for this advancement.
		//[advancement] Husbandry | The world is full of friends and food | Consume anything that can be consumed.
	//in work--------------------
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
	//in work--------------------
	//done--------------------
		switch(location){
		    //[advancement] Nether | Bring summer clothes | Enter the Nether dimension.
			case "nether" :
				//console.warn("Some things you can't unsee")
				boolScore("getSomeWhere", "nether", player, 1);
				break;
		    //[achievement] The End? | Enter an End Portal | Enter a stronghold End Portal activated with all twelve eyes of ender.
		    //[advancement] The End | Or the beginning? | Enter the End dimension.
		    //[advancement] The End? | Enter the End Portal | Enter the End dimension.
			case "the_end" :
				boolScore("getSomeWhere", "the_end", player, 1);
				break;
		    //[advancement] Those Were the Days | Enter a Bastion Remnant | —
			case "bastion_remnant" :
				boolScore("getSomeWhere", "bastion_remnant", player, 1);
				break;
		    //[advancement] A Terrible Fortress | Break your way into a Nether Fortress | Enter a nether fortress.
			case "nether_fortress" :
				boolScore("getSomeWhere", "nether_fortress", player, 1);
				break;
		    //[advancement] Subspace Bubble | Use the Nether to travel 7 km in the Overworld | Use the Nether to travel between 2 points in the Overworld with a minimum horizontal euclidean distance of 7000 blocks between each other, which is 875 blocks in the Nether.
			case "overworld7000" :
				boolScore("getSomeWhere", "overworld7000", player, 1);
				break;
		}
}
function itemInventory(player){
	//to-do--------------------
		//[achievement] Bake Bread | Turn wheat into bread. | Pick up bread from a crafting table output.
		//[achievement] Careful restoration | Make a Decorated Pot out of 4 Pottery Sherds | —
		//[achievement] Chestful of Cobblestone | Mine 1,728 Cobblestone and place it in a chest. | A player must mine 1,728 cobblestone and place 1,728 cobblestone, or 27 stacks, in a chest. The cobblestone placed in the chest does not have to be the same cobblestone that was mined.
		//[achievement] Cow Tipper | Harvest some leather. | Pick up leather from the ground.
		//[achievement] Dispense with This | Construct a Dispenser. | —
		//[achievement] Dry Spell | Dry a sponge in a furnace | —
		//[achievement] Enchanter | Construct an Enchantment Table. | Pick up an enchantment table from a crafting table output.
		//[achievement] Getting Wood | Punch a tree until a block of wood pops out. | Pick up a log from the ground.
		//[achievement] Hot Topic | Construct a furnace out of eight cobblestone blocks. | Pick up a furnace from a crafting table output.
		//[achievement] Iron Man | Wear a full suit of Iron Armor. | —
		//[achievement] Librarian | Build some bookshelves to improve your enchantment table. | Pick up a bookshelf from a crafting table output.
		//[achievement] MOAR Tools | Construct one type of each tool. | Construct one pickaxe, one shovel, one axe, and one hoe with the same material.
		//[achievement] Rainbow Collection | Gather all 16 colors of wool. | All the colors of wool do not have to be in the inventory at the same time, but must have been picked up by the player at least once.
		//[achievement] Taking Inventory | Open your inventory. | —
		//[achievement] The Lie | Bake a cake using: wheat, sugar, milk, and eggs. | Pick up a cake from a crafting table output.
		//[achievement] Time to Farm! | Make a Hoe. | Pick up any type of hoe from a crafting table output.
		//[achievement] Time to Mine! | Use planks and sticks to make a pickaxe. | Pick up any type of pickaxe from a crafting table output.
		//[achievement] Time to Strike! | Use planks and sticks to make a sword. | Pick up any type of sword from a crafting table output.
		//[achievement] With our powers combined! | Have all 3 froglights in your inventory | Acquire at least one of each pearlescent, verdant, and ochre froglights in your inventory at the same time.
		//[achievement] You Need a Mint | Collect dragons breath in a glass bottle | Have a dragon's breath bottle in your inventory
		//[advancement] Careful Restoration | Make a Decorated Pot out of 4 Pottery Sherds | —
		//[advancement] Spooky Scary Skeleton | Obtain a Wither Skeleton's skull | Have a wither skeleton skull in your inventory.
		//[advancement] With Our Powers Combined! | Have all Froglights in your inventory | Have a Pearlescent, Ochre, and Verdant Froglight in your inventory.
		//[advancement] You Need a Mint | Collect Dragon's Breath in a Glass Bottle | Have a bottle of dragon's breath in your inventory.
	//in work--------------------
	//done--------------------
		let slotArray = [];
		slotArray[0] = "crafting_table";	//[achievement] Benchmaking | Craft a workbench with four blocks of wooden planks. | Pick up a crafting table from the inventory's crafting field output or a crafting table output.
								//[advancement] Minecraft | The heart and story of the game | Have a crafting table in your inventory.
		slotArray[1] = "stone_pickaxe";	//[achievement] Getting an Upgrade | Construct a better pickaxe. | Pick up a stone pickaxe from a crafting table output.
								//[advancement] Getting an Upgrade | Construct a better Pickaxe | Have a stone pickaxe in your inventory.
		slotArray[2] = "iron_pickaxe";	//[advancement] Isn't It Iron Pick | Upgrade your Pickaxe | Have an iron pickaxe in your inventory.
		slotArray[3] = "netherite_hoe";	//[advancement] Serious Dedication | Use a Netherite Ingot to upgrade a Hoe, and then reevaluate your life choices | Have a netherite hoe in your inventory.
		slotArray[4] = "iron_helmet";
		slotArray[5] = "iron_chestplate";
		slotArray[6] = "iron_leggings";
		slotArray[7] = "iron_boots";
		slotArray[8] = "diamond_helmet";
		slotArray[9] = "diamond_chestplate";
		slotArray[10] = "diamond_leggings";
		slotArray[11] = "diamond_boots";
		slotArray[12] = "netherite_helmet";
		slotArray[13] = "netherite_chestplate";
		slotArray[14] = "netherite_leggings";
		slotArray[15] = "netherite_boots";
		slotArray[16] = "elytra";	//[advancement] Sky's the Limit | Find Elytra | Have a pair of elytra in your inventory.
		slotArray[17] = "iron_ingot";	//[achievement] Acquire Hardware | Smelt an iron ingot | Pick up an iron ingot from a furnace output.
								//[advancement] Acquire Hardware | Smelt an Iron Ingot | Have an iron ingot in your inventory.
		slotArray[18] = "diamond";	//[achievement] DIAMONDS! | Acquire diamonds with your iron tools. | Pick up a diamond from the ground.
								//[advancement] Diamonds! | Acquire diamonds | Have a diamond in your inventory.
		slotArray[19] = "ancient_debris";	//[advancement] Hidden in the Depths | Obtain Ancient Debris | Have an ancient debris in your inventory.
		slotArray[20] = "lava_bucket";	//[advancement] Hot Stuff | Fill a Bucket with lava | Have a lava bucket in your inventory.
		slotArray[21] = "cod_bucket";
		slotArray[22] = "salmon_bucket";
		slotArray[23] = "tropical_fish_bucket";
		slotArray[24] = "pufferfish_bucket";
		slotArray[25] = "axolotl_bucket";	//[advancement] The Cutest Predator | Catch an Axolotl in a Bucket | Use a water bucket on an axolotl.
		slotArray[26] = "tadpole_bucket";	//[advancement] Bukkit Bukkit | Catch a Tadpole in a Bucket | —
		slotArray[27] = "cobblestone";
		slotArray[28] = "blackstone";
		slotArray[29] = "cobbled_deepslate";
		slotArray[30] = "obsidian";	//[advancement] Ice Bucket Challenge | Obtain a block of Obsidian | Have a block of obsidian in your inventory.
		slotArray[31] = "crying_obsidian";	//[advancement] Who is Cutting Onions? | Obtain Crying Obsidian | Have a block of crying obsidian in your inventory.
		slotArray[32] = "blaze_rod";	//[achievement] Into Fire | Relieve a Blaze of its rod. | Pick up a blaze rod from the ground.
								//[advancement] Into Fire | Relieve a Blaze of its rod | Have a blaze rod in your inventory.
		slotArray[33] = "dragon_egg";	//[advancement] The Next Generation | Hold the Dragon Egg | Have a dragon egg in your inventory.
		slotArray[34] = "sniffer_egg";	//[advancement] Smells Interesting | Obtain a Sniffer Egg | Have a sniffer egg in your inventory.
		let inventoryPlayer = player.getComponent("minecraft:inventory");
		var i;
		var j;
		
		for(i = 0; i < slotArray.length; i++){
			if(getSomeScore("itemInventory", slotArray[i], player) == 0){
				for(j = 0; j < 36; j++){
					let slotItem = inventoryPlayer.container.getItem(j);
					
					if(slotItem){
						if(slotItem.typeId == ("minecraft:" + slotArray[i])){
							boolScore("itemInventory", slotArray[i], player, 1);
							//console.warn("Taking inventory");
						}
					}
				}
			}
		}
		
	    //[advancement] Suit Up | Protect yourself with a piece of iron armor | Have any type of iron armor in your inventory.
		if(getSomeScore("itemInventory", "iron_armor", player) == 0){
			if(getSomeScore("itemInventory", "iron_helmet", player) == 1 || (getSomeScore("itemInventory", "iron_chestplate", player) == 1 || (getSomeScore("itemInventory", "iron_leggings", player) == 1 || (getSomeScore("itemInventory", "iron_boots", player) == 1)))){
				boolScore("itemInventory", "iron_armor", player, 1);
			}
		}
		
	    //[advancement] Cover Me with Diamonds | Diamond armor saves lives | Have any type of diamond armor in your inventory.
		if(getSomeScore("itemInventory", "diamond_armor", player) == 0){
			if(getSomeScore("itemInventory", "diamond_helmet", player) == 1 || (getSomeScore("itemInventory", "diamond_chestplate", player) == 1 || (getSomeScore("itemInventory", "diamond_leggings", player) == 1 || (getSomeScore("itemInventory", "diamond_boots", player) == 1)))){
				boolScore("itemInventory", "diamond_armor", player, 1);
			}
		}
		
	    //[achievement] Cover me in debris | Wear a full set of Netherite armor | Have a full set of Netherite armor in your inventory.
	    //[advancement] Cover Me in Debris | Get a full suit of Netherite armor | Have a full set of netherite armor in your inventory.
		if(getSomeScore("itemInventory", "netherite_armor", player) == 0){
			if(getSomeScore("itemInventory", "netherite_helmet", player) == 1 && (getSomeScore("itemInventory", "netherite_chestplate", player) == 1 && (getSomeScore("itemInventory", "netherite_leggings", player) == 1 && (getSomeScore("itemInventory", "netherite_boots", player) == 1)))){
				boolScore("itemInventory", "netherite_armor", player, 1);
			}
		}
		
	    //[achievement] I am a Marine Biologist | Collect a fish in a bucket | Use an empty bucket on any fish mob to collect it.
	    //[advancement] Tactical Fishing | Catch a Fish... without a Fishing Rod! | Use a water bucket on any fish mob.
		if(getSomeScore("itemInventory", "fish_bucket", player) == 0){
			if(getSomeScore("itemInventory", "cod_bucket", player) == 1 || (getSomeScore("itemInventory", "salmon_bucket", player) == 1 || (getSomeScore("itemInventory", "tropical_fish_bucket", player) == 1 || (getSomeScore("itemInventory", "pufferfish_bucket", player) == 1)))){
				boolScore("itemInventory", "fish_bucket", player, 1);
			}
		}
		
	    //[advancement] Stone Age | Mine Stone with your new Pickaxe | Have one of these 3 stones in the #stone_tool_materials item tag:, Cobblestone, Blackstone, Cobbled Deepslate, in your inventory.
		if(getSomeScore("itemInventory", "got_cobble", player) == 0){
			if(getSomeScore("itemInventory", "cobblestone", player) == 1 || (getSomeScore("itemInventory", "blackstone", player) == 1 || (getSomeScore("itemInventory", "cobbled_deepslate", player) == 1))){
				boolScore("itemInventory", "got_cobble", player, 1);
			}
		}
	    //[advancement] Respecting the Remnants | Brush a Suspicious block to obtain a Pottery Sherd | —
		if(getSomeScore("itemInventory", "pottery_sherd", player) == 0){
			let potSlotArray = [];
			potSlotArray[0] = "angler_pottery_sherd";
			potSlotArray[1] = "archer_pottery_sherd";
			potSlotArray[2] = "arms_up_pottery_sherd";
			potSlotArray[3] = "blade_pottery_sherd";
			potSlotArray[4] = "brewer_pottery_sherd";
			potSlotArray[5] = "burn_pottery_sherd";
			potSlotArray[6] = "danger_pottery_sherd";
			potSlotArray[7] = "explorer_pottery_sherd";
			potSlotArray[8] = "friend_pottery_sherd";
			potSlotArray[9] = "heart_pottery_sherd";
			potSlotArray[10] = "heartbreak_pottery_sherd";
			potSlotArray[11] = "howl_pottery_sherd";
			potSlotArray[12] = "miner_pottery_sherd";
			potSlotArray[13] = "mourner_pottery_sherd";
			potSlotArray[14] = "plenty_pottery_sherd";
			potSlotArray[15] = "prize_pottery_sherd";
			potSlotArray[16] = "sheaf_pottery_sherd";
			potSlotArray[17] = "shelter_pottery_sherd";
			potSlotArray[18] = "skull_pottery_sherd";
			potSlotArray[19] = "snort_pottery_sherd";
			
			for(i = 0; i < potSlotArray.length; i++){
				for(j = 0; j < 36; j++){
					let slotItem = inventoryPlayer.container.getItem(j);
					
					if(slotItem){
						if(slotItem.typeId == ("minecraft:" + potSlotArray[i])){
							boolScore("itemInventory", "pottery_sherd", player, 1);
						}
					}
				}
			}
		}
}
function entityInteractions(){
	//to-do--------------------
		//[achievement] Birthday song | Have an Allay drop a cake at a noteblock | Tame an allay by giving it a cake while having dropped cake items and play a noteblock nearby.
		//[achievement] Diamonds to you! | Throw diamonds at another player. | Drop a diamond. Another player or a mob must then pick up this diamond.
		//[achievement] Echolocation | Feed a dolphin fish to have it lead you to treasure | Feed a dolphin cod or salmon and have it lure you to treasure.
		//[achievement] Feels Like Home | Take a Strider for a loooong [sic] ride on a lava lake in the Overworld. | In the Overworld, use a strider to ride on a lava lake for a distance of 50 meters from the point where the ride starts.
		//[achievement] Leader of the Pack | Befriend five wolves. | This does not have to be in a single game, so multiple games or reloading old saves does count toward this achievement.
		//[achievement] Lion Hunter | Gain the trust of an Ocelot. | —
		//[achievement] Oooh, shiny! | Distract a Piglin using gold | Give a piglin a gold item while it is aggressive toward the player.
		//[achievement] Plethora of Cats | Befriend twenty stray cats. | Befriend and tame twenty stray cats found in villages. They do not all need to be tamed in a single world.
		//[achievement] Saddle Up | Tame a horse. | —
		//[achievement] So I Got That Going for Me | Lead a Caravan containing at least 5 Llamas | —
		//[achievement] Taste of Your Own Medicine | Poison a witch with a splash potion. | Throw a splash potion of poison at a witch (by facing the witch and pressing the use key).
		//[achievement] Time for Stew | Give someone a suspicious stew. | —
		//[achievement] Whatever Floats Your Goat | Get in a boat and float with a goat | Use a boat and put a goat inside that boat, then ride it
		//[achievement] When Pigs Fly | Use a saddle to ride a pig, and then have the pig get hurt from fall damage while riding it. | Be riding a pig (e.g. using a saddle) when it hits the ground with a fall distance greater than 5.
		//[achievement] Where Have You Been? | Receive a gift from a tamed cat in the morning. | The gift must be picked up from the ground.
		//[achievement] Zombie Doctor | Cure a zombie villager. | Throw a splash potion of weakness at a zombie villager and give it a golden apple (by facing the zombie and pressing the use key with a golden apple in your hand)
		//[advancement] A Complete Catalogue | Tame all Cat variants! | Tame each of these 11 cat variants:, Tabby, Tuxedo, Red, Siamese, British Shorthair, Calico, Persian, Ragdoll, White, Jellie, Black
		//[advancement] Best Friends Forever | Tame an animal | Tame one of these 8 tameable mobs:, Cat, Donkey, Horse, Llama, Mule, Parrot, Trader Llama, Wolf
		//[advancement] Birthday Song | Have an Allay drop a Cake at a Note Block | Give an allay a cake and then use a note block to make the allay drop the cake at a note block.
		//[advancement] Feels Like Home | Take a Strider for a loooong ride on a lava lake in the Overworld | While riding a strider, travel 50 blocks on lava in the Overworld., Only horizontal displacement is counted. Traveling in a circle for more than 50 blocks doesn't count.
		//[advancement] Is It a Balloon? | Look at a Ghast through a Spyglass | Look at a ghast through a spyglass while the ghast is focused on you.
		//[advancement] Is It a Bird? | Look at a Parrot through a Spyglass | —
		//[advancement] Is It a Plane? | Look at the Ender Dragon through a Spyglass | —
		//[advancement] Little Sniffs | Feed a Snifflet | Feed a snifflet torchflower seeds.
		//[advancement] Oh Shiny | Distract Piglins with gold | While aggravated, give a piglin one of these 25 gold-related items in the #piglin_loved item tag:, Bell, Block of Gold, Block of Raw Gold, Clock, Enchanted Golden Apple, Gilded Blackstone, Glistering Melon Slice, Gold Ingot, Gold Ore, Golden Apple, Golden Axe, Golden Boots, Golden Carrot, Golden Chestplate, Golden Helmet, Golden Hoe, Golden Horse Armor, Golden Leggings, Golden Pickaxe, Golden Shovel, Golden Sword, Light Weighted Pressure Plate, Nether Gold Ore, Deepslate Gold Ore, Raw Gold, Other gold-related items do not distract the piglin and do not trigger this advancement.
		//[advancement] Surge Protector | Protect a Villager from an undesired shock without starting a fire | Be within 30 blocks of a lightning strike that doesn't set any blocks on fire, while an unharmed villager is within or up to six blocks above a 30×30×30 volume centered on the lightning strike.
		//[advancement] This Boat Has Legs | Ride a Strider with a Warped Fungus on a Stick | Boost[2] a strider with a warped fungus on a stick.
		//[advancement] Whatever Floats Your Goat! | Get in a Boat and float with a Goat | Enter a boat or a raft with a goat.
		//[advancement] When the Squad Hops into Town | Get each Frog variant on a Lead | The frogs don't need to be leashed at the same time.[5]
		//[advancement] You've Got a Friend in Me | Have an Allay deliver items to you | Give an allay an item and then have it return to the player with more of that item.
		//[advancement] Zombie Doctor | Weaken and then cure a Zombie Villager | Use a golden apple on a zombie villager under the Weakness effect; the advancement is granted when the zombie villager converts into a villager., In multiplayer, only the player that feeds the golden apple gets the advancement.
	//in work--------------------
	//done--------------------
}
function entityKills(entity){
	//to-do--------------------
		//[achievement] Archer | Kill a creeper with arrows. | —
		//[achievement] Camouflage | Kill a mob while wearing the same type of mob head. | —
		//[achievement] Feeling Ill | Defeat an Evoker | —
		//[achievement] I've got a bad feeling about this | Kill a Pillager Captain. | —
		//[achievement] It spreads | Kill a mob next to a catalyst | —
		//[achievement] Kill the Beast! | Defeat a Ravager. | —
		//[achievement] Monster Hunter | Attack and destroy a monster. | Kill a hostile mob or one of the following neutral mobs: an enderman, a piglin, a zombified piglin, a spider, or a cave spider.
		//[achievement] Overkill | Deal nine hearts of damage in a single hit. | Damage can be dealt to any mob, even those that do not have nine hearts of health overall.
		//[achievement] Return to Sender | Destroy a Ghast with a fireball. | Kill a ghast using a ghast fireball.
		//[achievement] Sniper Duel | Kill a Skeleton with an arrow from more than 50 meters. | Use a launched arrow to kill a skeleton, spider jockey, wither skeleton, or a stray from 50 or more blocks away, horizontally.
		//[achievement] The Beginning. | Kill the Wither | Be within a 100.9×100.9×203.5 cuboid centered on the Wither when it drops the nether star.
		//[achievement] The Deep End | Defeat an Elder Guardian | —
		//[achievement] The End | Kill the Enderdragon [sic] | Enter the end exit portal.
		//[advancement] Adventure | Adventure, exploration and combat | Kill any entity, or be killed by any entity.
		//[advancement] Arbalistic | Kill five unique mobs with one crossbow shot | 
		//[advancement] Free the End | Good luck | Kill the ender dragon. If multiple players are involved in the dragon fight, only the player that deals the final blow to the dragon receives the advancement.[4]
		//[advancement] It Spreads | Kill a mob near a Sculk Catalyst | Kill one of these 70 mobs near a sculk catalyst:, Axolotl, Bee, Blaze, Camel, Cat, Cave Spider, Chicken, Chicken Jockey, Cod, Cow, Creeper, Donkey, Dolphin, Drowned, Elder Guardian, Enderman, Endermite, Evoker, Fox, Frog, Ghast, Goat, Glow Squid, Guardian, Hoglin, Horse, Husk, Llama, Magma Cube, Mooshroom, Ocelot, Panda, Parrot, Phantom, Pig, Piglin, Piglin Brute, Pillager, Polar Bear, Pufferfish, Rabbit, Ravager, Salmon, Sheep, Shulker, Silverfish, Skeleton, Skeleton Horse, Skeleton Horseman, Slime, Sniffer, Stray, Spider, Spider Jockey, Squid, Strider, Trader Llama, Tropical Fish, Turtle, Vex, Vindicator, Warden, Witch, Wither, Wither Skeleton, Wolf, Zoglin, Zombie, Zombie Villager, Zombified Piglin, Mobs that drop no experience are ignored for this advancement.
		//[advancement] Monster Hunter | Kill any hostile monster | Kill one of these 34 mobs:, Blaze, Cave Spider, Creeper, Drowned, Elder Guardian, Ender Dragon, Enderman, Endermite, Evoker, Ghast, Guardian, Hoglin, Husk, Magma Cube, Phantom, Piglin, Piglin Brute, Pillager, Ravager, Shulker, Silverfish, Skeleton, Slime, Spider, Stray, Vex, Vindicator, Witch, Wither, Wither Skeleton, Zoglin, Zombie, Zombie Villager, Zombified Piglin, Only the riders of the chicken jockeys and skeleton horsemen are counted in this advancement. Other mobs may be killed, but are ignored for this advancement.
		//[advancement] Monsters Hunted | Kill one of every hostile monster | Kill each of these 34 mobs:, Blaze, Cave Spider, Creeper, Drowned, Elder Guardian, Ender Dragon, Enderman, Endermite, Evoker, Ghast, Guardian, Hoglin, Husk, Magma Cube, Phantom, Piglin, Piglin Brute, Pillager, Ravager, Shulker, Silverfish, Skeleton, Slime, Spider, Stray, Vex, Vindicator, Witch, Wither, Wither Skeleton, Zoglin, Zombie, Zombie Villager, Zombified Piglin, Other mobs may be killed, but are ignored for this advancement. Only the riders of the chicken jockeys and skeleton horsemen are counted in this advancement.
		//[advancement] Return to Sender | Destroy a Ghast with a fireball | Kill a ghast by deflecting a ghast fireball back into it via hitting or shooting a projectile at the fireball.
		//[advancement] Sniper Duel | Kill a Skeleton from at least 50 meters away | Be at least 50 blocks away horizontally when a skeleton is killed by an arrow after the player has attacked it once.
		//[advancement] Two Birds, One Arrow | Kill two Phantoms with a piercing Arrow | Use a crossbow enchanted with Piercing to kill two phantoms with a single arrow shot.
		//[advancement] Uneasy Alliance | Rescue a Ghast from the Nether, bring it safely home to the Overworld... and then kill it | Kill a ghast while the player is in the Overworld.
		//[advancement] Voluntary Exile | Kill a raid captain. Maybe consider staying away from villages for the time being… | Kill an entity in the #raiders entity tag wearing an ominous banner.
		//[advancement] Who's the Pillager Now? | Give a Pillager a taste of their own medicine | Kill a pillager with a crossbow.
	//in work--------------------
	//done--------------------
}
function redstoneInteractions(){
	//to-do--------------------
		//[achievement] Inception | Push a piston with a piston, then pull the original piston with that piston. | —
		//[advancement] The Power of Books | Read the power signal of a Chiseled Bookshelf using a Comparator | Place a comparator on any side of a chiseled bookshelf or the chiseled bookshelf against a comparator to trigger the advancement.
	//in work--------------------
	//done--------------------
}
function spawnAndBreed(entity, player){
	//to-do--------------------
		//[achievement] Artificial Selection | Breed a mule from a horse and a donkey. | —
		//[achievement] Repopulation | Breed two cows with wheat. | Breed two cows or two mooshrooms.
		//[achievement] Zoologist | Breed two pandas with bamboo. | —
	//in work--------------------
	//done--------------------
		switch(entity){
		    //[achievement] Body Guard | Create an Iron Golem | —
		    //[advancement] Hired Help | Summon an Iron Golem to help defend a village | Summon an iron golem.
			case "iron_golem" ://*fall through*
		    //[achievement] The Beginning? | Spawn the Wither | Be within a 100.9×100.9×103.5 cuboid centered on the Wither when it is spawned.
		    //[advancement] Withering Heights | Summon the Wither | Be within a 100.9×100.9×103.5 cuboid centered on the wither when it is spawned.
			case "wither" :
				//console.warn("I made a friend");
				boolScore("spawnAndBreed", entity, player, 1);
				break;
		    //[achievement] The End... Again... | Respawn the Enderdragon [sic] | —
		    //[advancement] The End... Again... | Respawn the Ender Dragon | Be within a 192 block radius from the coordinates (0.0, 128, 0.0) when an ender dragon is summoned using end crystals.
			case "ender_dragon" :
				if(getSomeScore("spawnAndBreed", "ender_dragon_bool", player) == 0){
					addToScore("spawnAndBreed", "ender_dragon_score", player);
					if(getSomeScore("spawnAndBreed", "ender_dragon_score", player) > 1){
						//console.warn("It's a rare, magical creature. We should kill it");
						boolScore("spawnAndBreed", "ender_dragon_bool", player, 1);
					}
				}
				break;
		    //[advancement] The Parrots and the Bats | Breed two animals together | Breed a pair of any of these 25 mobs:, Axolotl, Bee, Camel, Cat, Chicken, Cow, Donkey, Fox, Frog, Goat, Hoglin, Horse, Llama, Mooshroom, Mule, Ocelot, Panda, Pig, Rabbit, Sheep, Sniffer, Strider, Trader Llama, Turtle, Wolf, A mule must be the result of breeding a horse and a donkey for this advancement as they are not breedable together. Other breedable mobs are ignored for this advancement.
		    //[advancement] Two by Two | Breed all the animals! | Breed a pair of each of these 24 mobs:, Axolotl, Bee, Camel, Cat, Chicken, Cow, Donkey, Fox, Frog, Goat, Hoglin, Horse, Llama, Mooshroom, Mule, Ocelot, Panda, Pig, Rabbit, Sheep, Sniffer, Strider, Turtle, Wolf, A trader llama does not count as a llama, and a mule must be the result of breeding a horse and a donkey for this advancement as they are not breedable together. Other breedable mobs can be bred, but are ignored for this advancement.
			case "axolotl" ://*fall through*
			case "bee" ://*fall through*
			case "camel" ://*fall through*
			case "cat" ://*fall through*
			case "chicken" ://*fall through*
			case "cow" ://*fall through*
			case "donkey" ://*fall through*
			case "fox" ://*fall through*
			case "frog" ://*fall through*
			case "goat" ://*fall through*
			case "hoglin" ://*fall through*
			case "horse" ://*fall through*
			case "llama" ://*fall through*
			case "mooshroom" ://*fall through*
			case "mule" ://*fall through*
			case "ocelot" ://*fall through*
			case "panda" ://*fall through*
			case "pig" ://*fall through*
			case "rabbit" ://*fall through*
			case "sheep" ://*fall through*
			case "sniffer" ://*fall through*
			case "strider" ://*fall through*
			case "turtle" ://*fall through*
			case "wolf" :
				if(getSomeScore("spawnAndBreed", "breed_all_bool", player) == 0){
					if(getSomeScore("spawnAndBreed", entity, player) == 0){
						addToScore("spawnAndBreed", "breed_all_score", player);
						boolScore("spawnAndBreed", entity, player, 1);
						if(getSomeScore("spawnAndBreed", "breed_all_score", player) == 24){
							boolScore("spawnAndBreed", "breed_all_bool", player, 1);
						}
					}
				}
				if(getSomeScore("spawnAndBreed", "breed_some", player) == 0){
					if(getSomeScore("spawnAndBreed", "breed_all_score", player) > 0){
						boolScore("spawnAndBreed", "breed_some", player, 1);
					}
				}
				break;
			case "trader_llama" :
				if(getSomeScore("spawnAndBreed", "breed_some", player) == 0){
					boolScore("spawnAndBreed", "breed_some", player, 1);
				}
				break;
		}
}
function statusAndEffects(player){
	//to-do--------------------
		//[achievement] Great View From Up Here | Levitate up 50 blocks from the attacks of a Shulker | —
		//[achievement] Stayin' Frosty | Swim in lava while having the Fire Resistance effect. | —
		//[achievement] The Beaconator | Create and fully power a Beacon | Be within a 20×20×14 cuboid centered on the pyramid when the beacon block realizes it is fully powered.
		//[achievement] The Healing Power of Friendship! | Team up with an axolotl and win a fight | Team up with an axolotl by killing the hostile aquatic mob [verify] while the axolotl is fighting it (not playing dead).
		//[achievement] We're being attacked! | Trigger a Pillager Raid. | Walk in a village with the Bad Omen effect applied.
		//[advancement] Beaconator | Bring a Beacon to full power | Be within a 20×20×14 cuboid centered on a beacon block when it realizes it is being powered by a size 4 pyramid.
		//[advancement] Bring Home the Beacon | Construct and place a Beacon | Be within a 20×20×14 cuboid centered on a beacon block when it realizes it has become powered.
		//[advancement] Great View From Up Here | Levitate up 50 blocks from the attacks of a Shulker | Move a distance of 50 blocks vertically with the Levitation effect applied, regardless of direction or whether it is caused by the effect.
		//[advancement] The Healing Power of Friendship! | Team up with an axolotl and win a fight | Have the Regeneration effect applied from assisting an axolotl or it killing a mob.
	//in work--------------------
	//done--------------------
		let effectArray = [];
		effectArray[0] = "fire_resistance";
		effectArray[1] = "invisibility";
		effectArray[2] = "jump_boost";
		effectArray[3] = "night_vision";
		effectArray[4] = "poison";
		effectArray[5] = "regeneration";
		effectArray[6] = "resistance";
		effectArray[7] = "slow_falling";
		effectArray[8] = "slowness";
		effectArray[9] = "speed";
		effectArray[10] = "strength";
		effectArray[11] = "water_breathing";
		effectArray[12] = "weakness";
		effectArray[13] = "absorption";
		effectArray[14] = "bad_omen";
		effectArray[15] = "blindness";
		effectArray[16] = "conduit_power";
		effectArray[17] = "darkness";
		//effectArray[] = "dolphins_grace" [Java Edition only];
		//effectArray[] = "glowing" [Java Edition only];
		effectArray[18] = "haste";
		effectArray[19] = "hero_of_the_village";
		effectArray[20] = "hunger";
		effectArray[21] = "levitation";
		effectArray[22] = "mining_fatigue";
		effectArray[23] = "nausea";
		effectArray[24] = "wither";
		let effectPlayer = player.getEffects();
		
	    //[advancement] A Furious Cocktail | Have every potion effect applied at the same time | Have all of these 13 status effects applied to the player at the same time:, Fire Resistance, Invisibility, Jump Boost, Night Vision, Poison, Regeneration, Resistance, Slow Falling, Slowness, Speed, Strength, Water Breathing, Weakness, The source of the effects is irrelevant for the purposes of this advancement. Other status effects may be applied to the player, but are ignored for this advancement.
		if(getSomeScore("statusAndEffects", "potion_effects_bool", player) == 0){
			for(var i = 0; i < effectPlayer.length; i++){
				for(var j = 0; j < 13; j++){
					if(effectPlayer[i].typeId == effectArray[j]){
						addToScore("statusAndEffects", "potion_effects_score", player);
						//console.warn("Very effective");
					}
				}
			}
			if(getSomeScore("statusAndEffects", "potion_effects_score", player) == 13){
				boolScore("statusAndEffects", "potion_effects_bool", player, 1);
			}else{
				scoreSet("statusAndEffects", "potion_effects_score", player, 0);
			}
		}
		
	    //[advancement] How Did We Get Here? | Have every effect applied at the same time | Have all of these 27 status effects applied to the player at the same time:, Absorption, Bad Omen, Blindness, Conduit Power, Darkness, Dolphin's Grace, Fire Resistance, Glowing, Haste, Hero of the Village, Hunger, Invisibility, Jump Boost, Levitation, Mining Fatigue, Nausea, Night Vision, Poison, Regeneration, Resistance, Slow Falling, Slowness, Speed, Strength, Water Breathing, Weakness, Wither, The source of the effects is irrelevant for the purposes of this advancement. Other status effects may be applied to the player, but are ignored for this advancement.
		if(getSomeScore("statusAndEffects", "all_effects_bool", player) == 0){
			for(var i = 0; i < effectPlayer.length; i++){
				for(var j = 0; j < effectArray.length; j++){
					if(effectPlayer[i].typeId == effectArray[j]){
						addToScore("statusAndEffects", "all_effects_score", player);
					}
					//[advancement] Hero of the Village | Successfully defend a village from a raid | Kill at least one raid mob during a raid and wait until it ends in victory.
					if(getSomeScore("statusAndEffects", "hero_of_the_village", player) == 0){
						if(effectPlayer[i].typeId == "hero_of_the_village"){
							boolScore("statusAndEffects", "hero_of_the_village", player, 1);
						}
					}
				}
			}
			if(getSomeScore("statusAndEffects", "all_effects_score", player) == 25){
				boolScore("statusAndEffects", "all_effects_bool", player, 1);
			}else{
				scoreSet("statusAndEffects", "all_effects_score", player, 0);
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
	//in work--------------------
	//done--------------------
}
function usingItems(item){
	//to-do--------------------
		//[achievement] Beam Me Up | Teleport over 100 meters from a single throw of an Ender Pearl | Throw an ender pearl 100 blocks in any direction
		//[achievement] Cheating Death | Use the Totem of Undying to cheat death | Have the Totem of Undying in your hand when you die.
		//[achievement] It's a Sign! | Craft and place an Oak Sign. | —
		//[achievement] Planting the past | Plant any Sniffer seed | —
		//[advancement] A Seedy Place | Plant a seed and watch it grow | Plant one of these 7 crops:, Beetroot, Melon, Nether Wart, Pumpkin, Wheat, Torchflower, Pitcher, Other crops and plants can be planted, but are ignored for this advancement.
		//[advancement] Glow and Behold! | Make the text of any kind of sign glow | Use a glow ink sac on a sign or a hanging sign.
		//[advancement] Planting the Past | Plant any Sniffer seed | 
		//[advancement] Postmortal | Use a Totem of Undying to cheat death | Activate a totem of undying by taking fatal damage.
	//in work--------------------
	//done--------------------
}
function weaponsToolsArmor(subject, player){
	//to-do--------------------
		//[achievement] Do a Barrel Roll! | Use Riptide to give yourself a boost | Obtain a trident enchanted with Riptide and launch yourself any distance with it.
		//[achievement] Have a Shearful Day | Use Shears to obtain wool from a sheep. | —
		//[achievement] Let It Go! | Using the Frost Walker boots, walk on at least 1 block on frozen water on a deep ocean | —
		//[achievement] Smithing with style | Apply these smithing templates at least once: Spire, Snout, Rib, Ward, Silence, Vex, Tide, Wayfinder | —
		//[achievement] Super Sonic | Use Elytra to fly through a 1 by 1 gap while moving faster than 40 m/s | —
		//[advancement] Bullseye | Hit the bullseye of a Target block from at least 30 meters away | Be at least 30 blocks away horizontally when the center of a target is shot with a projectile by the player.
		//[advancement] Crafting a New Look | Craft a trimmed armor at a Smithing Table | —
		//[advancement] Light as a Rabbit | Walk on Powder Snow... without sinking in it | Walk on powder snow while wearing leather boots.
		//[advancement] Not Today, Thank You | Deflect a projectile with a Shield | Block any projectile with a shield.
		//[advancement] Smithing with Style | Apply these smithing templates at least once: Spire, Snout, Rib, Ward, Silence, Vex, Tide, Wayfinder | —
		//[advancement] Very Very Frightening | Strike a Villager with lightning | Hit a villager with lightning created by a trident with the Channeling enchantment.
	//in work--------------------
	//done--------------------
		switch(subject){
		    //[advancement] Ol' Betsy | Shoot a Crossbow | —
			case "crossbow" ://*fall through*
		    //[advancement] Take Aim | Shoot something with an Arrow | Using a bow or a crossbow, shoot an entity with an arrow, tipped arrow, or spectral arrow.
			case "arrow" ://*fall through*
		    //[advancement] A Throwaway Joke | Throw a Trident at something. Note: Throwing away your only weapon is not a good idea. | Hit a mob with a thrown trident.
			case "thrown_trident" ://*fall through*
		    //[achievement] Bullseye | Hit the bullseye of a Target block | —
			case "target" :
				//console.warn("Here goes nothing");
				boolScore("weaponsToolsArmor", subject, player, 1);
				break;
		    //[advancement] Fishy Business | Catch a fish | Use a fishing rod to catch any of these fishes:, Cod, Salmon, Tropical Fish, Pufferfish
			case "fishing_rod" :
				if(getSomeScore("weaponsToolsArmor", "catch_fish", player) == 0){
					let fishArray = [];
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
									scoreSet("weaponsToolsArmor", fishArray[i], player, slotItemAmount);
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
										if(getSomeScore("weaponsToolsArmor", fishArray[i], player) < slotItemAmount){
											boolScore("weaponsToolsArmor", "catch_fish", player, 1);
										}else{
											scoreSet("weaponsToolsArmor", fishArray[i], player, 0);
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
		//[achievement] Passing the Time | Play for 100 days. | Play for 100 Minecraft days, which is equivalent to 33 hours in real time.
		//[achievement] Sail the 7 Seas | Visit all ocean biomes | Visit all ocean biomes except the deep warm ocean/legacy frozen ocean (as they are unused)
		//[achievement] Sleep with the Fishes | Spend a day underwater. | Spend 20 minutes underwater without any air.
		//[achievement] Sound of Music | Make the Meadows come alive with the sound of music from a jukebox. | Use a music disc on a jukebox in the Meadow biome.
		//[advancement] Adventuring Time | Discover every biome | Visit all of these 53 biomes:, Badlands, Bamboo Jungle, Beach, Birch Forest, Cherry Grove, Cold Ocean, Dark Forest, Deep Cold Ocean, Deep Dark, Deep Frozen Ocean, Deep Lukewarm Ocean, Deep Ocean, Desert, Dripstone Caves, Eroded Badlands, Flower Forest, Forest, Frozen Ocean, Frozen Peaks, Frozen River, Grove, Ice Spikes, Jagged Peaks, Jungle, Lukewarm Ocean, Lush Caves, Mangrove Swamp, Meadow, Mushroom Fields, Ocean, Old Growth Birch Forest, Old Growth Pine Taiga, Old Growth Spruce Taiga, Plains, River, Savanna, Savanna Plateau, Snowy Beach, Snowy Plains, Snowy Slopes, Snowy Taiga, Sparse Jungle, Stony Peaks, Stony Shore, Sunflower Plains, Swamp, Taiga, Warm Ocean, Windswept Forest, Windswept Gravelly Hills, Windswept Hills, Windswept Savanna, Wooded Badlands, The advancement is only for Overworld biomes. Other biomes may also be visited, but are ignored for this advancement.
		//[advancement] Hot Tourist Destinations | Explore all Nether biomes | Visit all of the 5 following biomes:, Basalt Deltas, Crimson Forest, Nether Wastes, Soul Sand Valley, Warped Forest, The advancement is only for Nether biomes. Other biomes may also be visited, but are ignored for this advancement.
		//[advancement] Sound of Music | Make the Meadows come alive with the sound of music from a Jukebox | While in a meadow biome, place down a jukebox and use a music disc on it.
	//in work--------------------
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
function boolScore(category, item, player, zeroOrone){
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
	
	//categoryBoard.setScore(player, zeroOrone);
	itemBoard.setScore(player, zeroOrone);
}
function calculateDistance(x1, z1, x2, z2) {
	return Math.floor(Math.hypot(Math.abs(z2 - z1), Math.abs(x2 - x1)));
}
function getSomeScore(category, item, player){
	let categoryId = category.replace(" ","");
	let itemId=categoryId+item.replace(" ","");
	const allBoards = world.scoreboard.getObjectives();
	const checkCategoryID = obj => obj.displayName === category;
	
	if(!allBoards.some(checkCategoryID)){ 
		world.scoreboard.addObjective(categoryId, category);
		world.scoreboard.getObjective(categoryId).setScore(player,0);
	}
	const checkItemID = obj => obj.displayName === category+" "+item;
	
	if(!allBoards.some(checkItemID)){ 
		world.scoreboard.addObjective(itemId, category+" "+item);
		world.scoreboard.getObjective(itemId).setScore(player,0);
	}
	let categoryBoard = world.scoreboard.getObjective(categoryId);
	let itemBoard = world.scoreboard.getObjective(itemId);
	
	//return categoryBoard.getScore(player);
	return itemBoard.getScore(player);
}
function scoreSet(category, item, player, score){
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
	
	//categoryBoard.setScore(player, score);
	itemBoard.setScore(player, score);
}
function timer10Sec(){
	system.runInterval(() => {
		let playerArrayList = world.getAllPlayers();//get list of players
		
		//console.warn(playerArrayList[0].name);
		for(var i = 0; i < playerArrayList.length; i++){
			//distance data sampling at defined interval
			overworldBlocksTravelled(playerArrayList[i]);
			//inventory checks for achievement items
			itemInventory(playerArrayList[i]);
			//effect checks for achievement
			statusAndEffects(playerArrayList[i]);
		}
	}, 200);
}
//end helper functions----------------------------------------
import { world, system } from '@minecraft/server';

export function biomeFinder(player){
	const biomeArray = [];
	biomeArray[0] = "the_end";
	biomeArray[1] = "mangrove_swamp";
	biomeArray[2] = "mushroom_island";
	biomeArray[3] = "river";
	biomeArray[4] = "deep_dark";
	biomeArray[5] = "desert";
	biomeArray[6] = "frozen_river";
	biomeArray[7] = "legacy_frozen_ocean";
	biomeArray[8] = "mesa";
	biomeArray[9] = "mushroom_island_shore";
	biomeArray[10] = "ocean";
	biomeArray[11] = "pale_garden";
	biomeArray[12] = "stony_peaks";
	biomeArray[13] = "basalt_deltas";
	biomeArray[14] = "beach";
	biomeArray[15] = "cold_beach";
	biomeArray[16] = "cold_ocean";
	biomeArray[17] = "deep_ocean";
	biomeArray[18] = "desert_hills";
	biomeArray[19] = "desert_mutated";
	biomeArray[20] = "dripstone_caves";
	biomeArray[21] = "extreme_hills";
	biomeArray[22] = "frozen_ocean";
	biomeArray[23] = "ice_mountains";
	biomeArray[24] = "ice_plains";
	biomeArray[25] = "lukewarm_ocean";
	biomeArray[26] = "lush_caves";
	biomeArray[27] = "savanna";
	biomeArray[28] = "soulsand_valley";
	biomeArray[29] = "stone_beach";
	biomeArray[30] = "swampland";
	biomeArray[31] = "warm_ocean";
	biomeArray[32] = "warped_forest";
	biomeArray[33] = "bamboo_jungle";
	biomeArray[34] = "cherry_grove";
	biomeArray[35] = "crimson_forest";
	biomeArray[36] = "deep_cold_ocean";
	biomeArray[37] = "deep_frozen_ocean";
	biomeArray[38] = "deep_lukewarm_ocean";
	biomeArray[39] = "deep_warm_ocean";
	biomeArray[40] = "extreme_hills_mutated";
	biomeArray[41] = "flower_forest";
	biomeArray[42] = "forest";
	biomeArray[43] = "frozen_peaks";
	biomeArray[44] = "grove";
	biomeArray[45] = "ice_plains_spikes";
	biomeArray[46] = "jagged_peaks";
	biomeArray[47] = "jungle_edge";
	biomeArray[48] = "jungle_hills";
	biomeArray[49] = "jungle_mutated";
	biomeArray[50] = "meadow";
	biomeArray[51] = "mesa_bryce";
	biomeArray[52] = "mesa_plateau";
	biomeArray[53] = "mesa_plateau_stone_mutated";
	biomeArray[54] = "plains";
	biomeArray[55] = "savanna_mutated";
	biomeArray[56] = "savanna_plateau";
	biomeArray[57] = "snowy_slopes";
	biomeArray[58] = "swampland_mutated";
	biomeArray[59] = "bamboo_jungle_hills";
	biomeArray[60] = "cold_taiga";
	biomeArray[61] = "extreme_hills_edge";
	biomeArray[62] = "extreme_hills_plus_trees";
	biomeArray[63] = "extreme_hills_plus_trees_mutated";
	biomeArray[64] = "forest_hills";
	biomeArray[65] = "jungle";
	biomeArray[66] = "jungle_edge_mutated";
	biomeArray[67] = "mesa_plateau_mutated";
	biomeArray[68] = "mesa_plateau_stone";
	biomeArray[69] = "roofed_forest";
	biomeArray[70] = "roofed_forest_mutated";
	biomeArray[71] = "savanna_plateau_mutated";
	biomeArray[72] = "sunflower_plains";
	biomeArray[73] = "taiga";
	biomeArray[74] = "taiga_hills";
	biomeArray[75] = "taiga_mutated";
	biomeArray[76] = "birch_forest";
	biomeArray[77] = "birch_forest_hills";
	biomeArray[78] = "birch_forest_hills_mutated";
	biomeArray[79] = "birch_forest_mutated";
	biomeArray[80] = "cold_taiga_hills";
	biomeArray[81] = "cold_taiga_mutated";
	biomeArray[82] = "hell";
	biomeArray[83] = "mega_taiga_hills";
	biomeArray[84] = "mega_taiga";
	biomeArray[85] = "redwood_taiga_hills_mutated";
	biomeArray[86] = "redwood_taiga_mutated";

	let propertyPlayer = player.getProperty("addon:biome");
	let biomeId;
	
	if(propertyPlayer){
		biomeId = biomeArray[propertyPlayer];
	}else{
		biomeId = "NA";
	}
	return biomeId;
}
export function biomeChecker(player,achievementTracker,advancementTracker){
	const nether = ["basalt_deltas",
					"crimson_forest",
					"hell",
					"soulsand_valley",
					"warped_forest"]
	const oceans = ["warm_ocean",
					"lukewarm_ocean",
					"frozen_ocean",
					"deep_ocean",
					"cold_ocean",
					"deep_lukewarm_ocean",
					"deep_frozen_ocean",
					"deep_cold_ocean"]
	const miscBiomes = [
					"plains",
					"swampland",
					"swampland_mutated",
					"ocean",
					"river",
//					"windswept_hills",
					"mushroom_island",
					"mushroom_island_shore",
					"beach",
					"stone_beach",
//					"stone_shore",
					"savanna",
					"savanna_plateau",
					"savanna_mutated",
					"savanna_plateau_mutated"]
	const coldBiomes = [
					"frozen_river",
					"ice_plains",
//					"snowy_tundra",
					"cold_beach",
					"cold_taiga",
					"cold_taiga_hills",
					"ice_plains_spikes",
					"cold_taiga_mutated"]
	const desertBiomes = [
					"desert",
					"desert_hills",
//					"desert_lakes",
					"mesa_plateau_mutated",
					"mesa_plateau",
					"mesa",
					"mesa_bryce",
					"mesa_plateau_stone",
					"mesa_plateau_stone_mutated",
					"mesa_plateau_mutated"]
// needs unification with array above(all below
	const mountains = [
					"mountains",
					"mountain_edge",
					"ice_mountains",
					"wooded_mountains",
					"gravelly_mountains",
					"frozen_peaks",
					"snowy_slopes",
					"jagged_peaks",
					"stony_peaks",
					"gravelly_mountains+",
					"windswept_gravelly_hills",
					"taiga_mountains"]
	const underGound=[
					"lush_caves",
					"deep_dark",
					"deep_dark",
					"dripstone_caves"]
	const flowers = [
					"meadow",
					"grove",
					"sunflower_plains",
					"flower_forest"]
	const forests = [
					"taiga",
					"forest",
					"windswept_forest",
					"wooded_hills",
					"taiga_hills",
					"jungle",
					"jungle_hills",
					"sparse_jungle",
					"jungle_edge",
					"modified_jungle",
					"modified_jungle_edge",
					"birch_forest",
					"birch_forest_hills",
					"dark_forest",
					"old_growth_pine_taiga",
					"giant_tree_taiga",
					"giant_tree_taiga_hills",
					"old_growth_birch_forest",
					"tall_birch_forest",
					"tall_birch_hills",
					"dark_forest_hills",
					"old_growth_spruce_taiga",
					"giant_spruce_taiga",
					"giant_spruce_taiga_hills",
					"bamboo_jungle",
					"bamboo_jungle_hills",
					"mangrove_swamp",
					"cherry_grove"]
	const biome = biomeFinder(player)
	if(nether.includes(biome)){
		const netherMask = updateMask(nether, "netherBiomes", biome,player,achievementTracker,advancementTracker)
		if(netherMask==0b11111){
			if(!achievementTracker.checkAchievment("Hottouristdestination", player)){
				achievementTracker.setAchievment("Hottouristdestination", player);//[achievement] Hot tourist destination | Visit all Nether biomes | The achievement can be completed if one visit biomes in different worlds.
				advancementTracker.setAchievment("HotTouristDestinations", player);//[advancement] Hot Tourist Destinations | Explore all Nether biomes | Visit all of the 5 following biomes:, Basalt Deltas, Crimson Forest, Nether Wastes, Soul Sand Valley, Warped Forest, The advancement is only for Nether biomes. Other biomes may also be visited, but are ignored for this advancement.
			}
		}
	}else if (oceans.includes(biome)){
		const oceanMask = updateMask(oceans, "oceanBiomes", biome,player,achievementTracker,advancementTracker)
		if(oceanMask==0b1111111){
			if(!achievementTracker.checkAchievment("Sailthe7Seas", player)){
				achievementTracker.setAchievment("Sailthe7Seas", player);//[achievement] Sail the 7 Seas | Visit all ocean biomes | Visit all ocean biomes except the deep warm ocean/legacy frozen ocean (as they are unused)
			}
		}
	}else if (miscBiomes.includes(biome)){
		updateMask(miscBiomes, "miscBiomes", biome,player,achievementTracker,advancementTracker)
	}else if (forests.includes(biome)){
		updateMask(forests, "forestBiomes", biome,player,achievementTracker,advancementTracker)
	}else if (coldBiomes.includes(biome)){
		updateMask(coldBiomes, "coldBiomes", biome,player,achievementTracker,advancementTracker)
	}else if (desertBiomes.includes(biome)){
		updateMask(desertBiomes, "desertBiomes", biome,player,achievementTracker,advancementTracker)
	}else if (underGound.includes(biome)){
		updateMask(underGound, "undergroundBiomes", biome,player,achievementTracker,advancementTracker)
	}else if (flowers.includes(biome)){
		updateMask(flowers, "flowerBiomes", biome,player,achievementTracker,advancementTracker)
	}
}
function updateMask(biomeArray, name, value,player,achievementTracker,advancementTracker){
	//get indiex from array, use index in array as bit index for masking
	const maskIndex = biomeArray.indexOf(value)
	//look up the saved bit field for the player
	let bitmask = player.getDynamicProperty(name)
	//set default define isNew
	let isNew = false
	if (bitmask){
		//Generate bit mask for the current biome
		const curBiomeMask =  0b1<<maskIndex
		// Check if current biome bit is 1 by first anding then xor with the mask. The and sets all other bits to 0, the xor is 1 if and only if 1 of the saved mask had a zero in that possition
		isNew = (bitmask & curBiomeMask) ^ curBiomeMask != 0
		//update the mask
		bitmask =bitmask | curBiomeMask
	}
	else{
		//if the bitmask had not been previously saved then make it
		bitmask = 0b1<<maskIndex
		isNew = true
	}
	//save property
	player.setDynamicProperty(name,bitmask)
	//if this is a new biome then performe the next setof checks
	if(isNew){
		//add count to scoreboard and get current value
		const numBiomes = addToScore("stats_biomesVisited_", name, player)
		//check if value is greater than 17
		if(numBiomes>17){
			//[achievement] Adventuring Time | Discover 17 biomes. | Visit any 17 biomes. Does not have to be in a single world.
			if(!achievementTracker.checkAchievment("AdventuringTime", player)){
				achievementTracker.setAchievment("AdventuringTime", player);
			}
		}
	}
	return bitmask
}
export function lightLevel(player){
	let lightValue = player.getProperty("addon:light");
	if(!lightValue){
		lightValue = "NA";
	}
	return lightValue;
}
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
	
	
	itemBoard.addScore(player,1);
	return categoryBoard.addScore(player,1);
}
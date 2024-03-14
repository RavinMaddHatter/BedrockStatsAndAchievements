export function biomeFinder(player){
	const biomeArray = [];
	biomeArray[0] = "biome_id";
	biomeArray[1] = "the_end";
	biomeArray[2] = "river";
	biomeArray[3] = "mushroom_island";
	biomeArray[4] = "mangrove_swamp";
	biomeArray[5] = "mushroom_island_shore";
	biomeArray[6] = "frozen_river";
	biomeArray[7] = "ocean";
	biomeArray[8] = "legacy_frozen_ocean";
	biomeArray[9] = "stony_peaks";
	biomeArray[10] = "mesa";
	biomeArray[11] = "desert";
	biomeArray[12] = "deep_dark";
	biomeArray[13] = "warm_ocean";
	biomeArray[14] = "beach";
	biomeArray[15] = "swampland";
	biomeArray[16] = "stone_beach";
	biomeArray[17] = "basalt_deltas";
	biomeArray[18] = "warped_forest";
	biomeArray[19] = "soulsand_valley";
	biomeArray[20] = "savanna";
	biomeArray[21] = "desert_mutated";
	biomeArray[22] = "lukewarm_ocean";
	biomeArray[23] = "frozen_ocean";
	biomeArray[24] = "deep_ocean";
	biomeArray[25] = "cold_ocean";
	biomeArray[26] = "ice_mountains";
	biomeArray[27] = "desert_hills";
	biomeArray[28] = "extreme_hills";
	biomeArray[29] = "cold_beach";
	biomeArray[30] = "ice_plains";
	biomeArray[31] = "lush_caves";
	biomeArray[32] = "dripstone_caves";
	biomeArray[33] = "deep_warm_ocean";
	biomeArray[34] = "taiga";
	biomeArray[35] = "crimson_forest";
	biomeArray[36] = "savanna_plateau";
	biomeArray[37] = "savanna_mutated";
	biomeArray[38] = "mesa_plateau";
	biomeArray[39] = "jungle";
	biomeArray[40] = "mesa_plateau_stone_mutated";
	biomeArray[41] = "swampland_mutated";
	biomeArray[42] = "jungle_mutated";
	biomeArray[43] = "deep_lukewarm_ocean";
	biomeArray[44] = "deep_frozen_ocean";
	biomeArray[45] = "deep_cold_ocean";
	biomeArray[46] = "mesa_bryce";
	biomeArray[47] = "ice_plains_spikes";
	biomeArray[48] = "extreme_hills_mutated";
	biomeArray[49] = "jungle_hills";
	biomeArray[50] = "jungle_edge";
	biomeArray[51] = "bamboo_jungle";
	biomeArray[52] = "jagged_peaks";
	biomeArray[53] = "grove";
	biomeArray[54] = "frozen_peaks";
	biomeArray[55] = "snowy_slopes";
	biomeArray[56] = "plains";
	biomeArray[57] = "flower_forest";
	biomeArray[58] = "forest";
	biomeArray[59] = "meadow";
	biomeArray[60] = "cherry_grove";
	biomeArray[61] = "taiga_hills";
	biomeArray[62] = "cold_taiga";
	biomeArray[63] = "mesa_plateau_stone";
	biomeArray[64] = "mesa_plateau_mutated";
	biomeArray[65] = "savanna_plateau_mutated";
	biomeArray[66] = "roofed_forest";
	biomeArray[67] = "taiga_mutated";
	biomeArray[68] = "roofed_forest_mutated";
	biomeArray[69] = "jungle_edge_mutated";
	biomeArray[70] = "extreme_hills_plus_trees_mutated";
	biomeArray[71] = "extreme_hills_plus_trees";
	biomeArray[72] = "extreme_hills_edge";
	biomeArray[73] = "bamboo_jungle_hills";
	biomeArray[74] = "sunflower_plains";
	biomeArray[75] = "birch_forest";
	biomeArray[76] = "forest_hills";
	biomeArray[77] = "mega_taiga";
	biomeArray[78] = "redwood_taiga_mutated";
	biomeArray[79] = "mega_taiga_hills";
	biomeArray[80] = "cold_taiga_hills";
	biomeArray[81] = "hell";
	biomeArray[82] = "cold_taiga_mutated";
	biomeArray[83] = "birch_forest_hills_mutated";
	biomeArray[84] = "birch_forest_mutated";
	biomeArray[85] = "birch_forest_hills";
	biomeArray[86] = "redwood_taiga_hills_mutated";
	
	let propertyPlayer = player.getProperty("addon:biome");
	let biomeId;
	
	if(propertyPlayer){
		biomeId = biomeArray[propertyPlayer];
	}else{
		biomeId = "NA";
	}
	
	return biomeId;
}
export function biomeChecker(player){
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
		const isNew = checkNew(nether, "netherBiomes", biome)
		const netherMask = updateMask(nether, "netherBiomes", biome)
		if(netherMask==0b11111){
			if(!achievementTracker.checkAchievment("Hottouristdestination", player)){
				achievementTracker.setAchievment("Hottouristdestination", player);//[achievement] Hot tourist destination | Visit all Nether biomes | The achievement can be completed if one visit biomes in different worlds.
				advancementTracker.setAchievment("HotTouristDestinations", player);//[advancement] Hot Tourist Destinations | Explore all Nether biomes | Visit all of the 5 following biomes:, Basalt Deltas, Crimson Forest, Nether Wastes, Soul Sand Valley, Warped Forest, The advancement is only for Nether biomes. Other biomes may also be visited, but are ignored for this advancement.
			}
		}
	}else if (oceans.includes(biome)){
		const oceanMask = updateMask(oceans, "oceanBiomes", biome)
		if(oceanMask==0b1111111){
			if(!achievementTracker.checkAchievment("Sailthe7Seas", player)){
				achievementTracker.setAchievment("Sailthe7Seas", player);//[achievement] Sail the 7 Seas | Visit all ocean biomes | Visit all ocean biomes except the deep warm ocean/legacy frozen ocean (as they are unused)
			}
		}
	}else if (miscBiomes.includes(biome)){
		updateMask(miscBiomes, "miscBiomes", biome)
	}else if (forests.includes(biome)){
		updateMask(forests, "forestBiomes", biome)
	}else if (coldBiomes.includes(biome)){
		updateMask(coldBiomes, "coldBiomes", biome)
	}else if (desertBiomes.includes(biome)){
		updateMask(desertBiomes, "desertBiomes", biome)
	}else if (underGound.includes(biome)){
		updateMask(underGound, "undergroundBiomes", biome)
	}else if (flowers.includes(biome)){
		updateMask(flowers, "flowerBiomes", biome)
	}
}
function updateMask(biomeArray, name, value){
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
	let propertyPlayer = player.getProperty("addon:light");
	let lightId;
	
	if(propertyPlayer){
		lightId = propertyPlayer;
	}else{
		lightId = "NA";
	}
	
	return lightId;
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
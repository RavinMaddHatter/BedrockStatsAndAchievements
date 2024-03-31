export function biomeFinder(player){
	const biomeArray = [];
	biomeArray[0] = "biome_id";
	biomeArray[1] = "the_end";
	biomeArray[2] = "river";
	biomeArray[3] = "mushroom_island";
	biomeArray[4] = "mangrove_swamp";
	biomeArray[5] = "warped_forest";
	biomeArray[6] = "mushroom_island_shore";
	biomeArray[7] = "frozen_river";
	biomeArray[8] = "ocean";
	biomeArray[9] = "legacy_frozen_ocean";
	biomeArray[10] = "stony_peaks";
	biomeArray[11] = "mesa";
	biomeArray[12] = "desert";
	biomeArray[13] = "savanna";
	biomeArray[14] = "deep_dark";
	biomeArray[15] = "ice_plains";
	biomeArray[16] = "warm_ocean";
	biomeArray[17] = "beach";
	biomeArray[18] = "taiga";
	biomeArray[19] = "swampland";
	biomeArray[20] = "stone_beach";
	biomeArray[21] = "basalt_deltas";
	biomeArray[22] = "soulsand_valley";
	biomeArray[23] = "mesa_plateau";
	biomeArray[24] = "jungle";
	biomeArray[25] = "desert_mutated";
	biomeArray[26] = "lukewarm_ocean";
	biomeArray[27] = "frozen_ocean";
	biomeArray[28] = "deep_ocean";
	biomeArray[29] = "cold_ocean";
	biomeArray[30] = "ice_mountains";
	biomeArray[31] = "desert_hills";
	biomeArray[32] = "extreme_hills";
	biomeArray[33] = "cold_beach";
	biomeArray[34] = "lush_caves";
	biomeArray[35] = "dripstone_caves";
	biomeArray[36] = "forest";
	biomeArray[37] = "deep_warm_ocean";
	biomeArray[38] = "mesa_plateau_stone";
	biomeArray[39] = "crimson_forest";
	biomeArray[40] = "savanna_plateau";
	biomeArray[41] = "savanna_mutated";
	biomeArray[42] = "mesa_plateau_stone_mutated";
	biomeArray[43] = "swampland_mutated";
	biomeArray[44] = "jungle_mutated";
	biomeArray[45] = "deep_lukewarm_ocean";
	biomeArray[46] = "deep_frozen_ocean";
	biomeArray[47] = "deep_cold_ocean";
	biomeArray[48] = "mesa_bryce";
	biomeArray[49] = "ice_plains_spikes";
	biomeArray[50] = "extreme_hills_mutated";
	biomeArray[51] = "jungle_hills";
	biomeArray[52] = "jungle_edge";
	biomeArray[53] = "bamboo_jungle";
	biomeArray[54] = "jagged_peaks";
	biomeArray[55] = "grove";
	biomeArray[56] = "frozen_peaks";
	biomeArray[57] = "snowy_slopes";
	biomeArray[58] = "plains";
	biomeArray[59] = "flower_forest";
	biomeArray[60] = "meadow";
	biomeArray[61] = "cherry_grove";
	biomeArray[62] = "taiga_hills";
	biomeArray[63] = "cold_taiga";
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
	
	let variantPlayer = player.getComponent("minecraft:variant");
	let biomeId;
	
	if(variantPlayer){
		biomeId = biomeArray[variantPlayer.value];
	}else{
		biomeId = "NA";
	}
	
	return biomeId;
}
export function biomeChecker(player){
	const nether = ["warped_forest",
					"basalt_deltas",
					"soulsand_valley",
					"crimson_forest",
					"hell"
					]
	const oceans = ["warm_ocean",
					"lukewarm_ocean",
					"frozen_ocean",
					"deep_ocean",
					"cold_ocean",
					"deep_lukewarm_ocean",
					"deep_frozen_ocean"
					]
	const miscBiomes = ["the_end",
					"river",
					"mushroom_island",
					"mushroom_island_shore",
					"mangrove_swamp",
					"beach",
					"swampland",
					"deep_warm_ocean",
					"stone_beach",
					"swampland_mutated",
					"plains",
					"ocean",
					"bamboo_jungle_hills",
					"deep_cold_ocean"
					]
	const coldBiomes = ["frozen_river",
						"legacy_frozen_ocean",
						"ice_plains",
						"ice_plains_spikes",
						"cold_beach",
						]
	const desertBiomes = ["mesa",
					"desert",
					"savanna",
					"mesa_plateau",
					"desert_mutated",
					"desert_hills",
					"mesa_plateau_stone",
					"savanna_plateau",
					"savanna_mutated",
					"mesa_plateau_stone_mutated",
					"mesa_bryce",
					"mesa_plateau_mutated",
					"savanna_plateau_mutated"
					]
// needs unification with array above(all below
	const mountains = [
					"stony_peaks",
					"ice_mountains",
					"extreme_hills",
					"extreme_hills_mutated",
					"jagged_peaks",
					"frozen_peaks",
					"snowy_slopes",
					"extreme_hills_edge"
					
					]
	const underGound=["deep_dark",
					"lush_caves",
					"dripstone_caves"					
					]
	const flowers = ["flower_forest",
					"meadow",
					"sunflower_plains"
					]
	const forests = ["taiga",
					"jungle",
					"forest",
					"jungle_mutated",
					"jungle_hills",
					"jungle_edge",
					"bamboo_jungle",
					"grove",
					"cherry_grove",
					"taiga_hills",
					"cold_taiga",
					"roofed_forest",
					"taiga_mutated",
					"roofed_forest_mutated",
					"jungle_edge_mutated",
					"extreme_hills_plus_trees_mutated",
					"extreme_hills_plus_trees",
					"birch_forest",
					"forest_hills",
					"mega_taiga",
					"redwood_taiga_mutated",
					"mega_taiga_hills",
					"cold_taiga_hills",
					"cold_taiga_mutated",
					"birch_forest_hills_mutated",
					"birch_forest_mutated",
					"birch_forest_hills",
					"redwood_taiga_hills_mutated"
					]
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
	let markVariantPlayer = player.getComponent("minecraft:mark_variant");
	let lightId;
	
	if(markVariantPlayer){
		lightId = markVariantPlayer.value;
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
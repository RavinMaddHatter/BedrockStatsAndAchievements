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
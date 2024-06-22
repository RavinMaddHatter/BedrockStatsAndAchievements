import { world, system } from '@minecraft/server';

export function addToScore(category, item, player,amount=1){
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
	
	categoryBoard.addScore(player,amount);
	itemBoard.addScore(player,amount);
}
export function calculateDistance(x1, z1, x2, z2) {
	return Math.floor(Math.hypot(Math.abs(z2 - z1), Math.abs(x2 - x1)));
}
export function getScoreIfExists(board, player){
	let tempScore = 0;
	if (board){
		if (board.hasParticipant(player)){
			tempScore =board.getScore(player)
		}
	}
	return tempScore
}



export function getequipped(player){
	const equipComp = player.getComponent("minecraft:equippable");
	let equipment={"dayOne":true,"chest":"","Feet":"","Head":"","Legs":"","Mainhand":"Empty Hand","Offhand":""}
	if( equipComp.getEquipment("Chest")){
		equipment["Chest"] = equipComp.getEquipment("Chest").typeId.replace("minecraft:","")
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
	if(JSON.stringify(equipment).includes("iamond")||JSON.stringify(equipment).includes("etherite")){
		equipment["dayOne"]=false
	}
	return equipment
}
export function achievementUnlock(player,data){
	let display=player.onScreenDisplay
	display.setActionBar("\u00A7cachievement Unlocked: \u00A7e"+data)
	player.playSound("random.levelup")
}
export function propertyToScore(player){
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
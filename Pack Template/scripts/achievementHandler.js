import { world, system } from '@minecraft/server';

export class achievementHandler{
	constructor(achievmentObject,name){
		this.name=name
		this.achievments=achievmentObject;
		this.dynamicProperties=[]
		for (const [key, value] of Object.entries(this.achievments)) {
			if(!this.dynamicProperties.includes(value.container)){
				this.dynamicProperties.push(value.container)
			}
		}
	}
	checkAchievment(handle,player){
		const achievmentDefs = this.achievments[handle];
		const storage = player.getDynamicProperty(achievmentDefs.container);
		if(storage){
			const mask = 0b1<<achievmentDefs.containerIndex;
			return (storage&mask) == mask;
		}
		else{
			player.setDynamicProperty(achievmentDefs.container,0);
			return false;
		}
	}
	setAchievment(handle,player){
		const achievmentDefs = this.achievments[handle];
		let storage = player.getDynamicProperty(achievmentDefs.container);
		const mask = 0b1<<achievmentDefs.containerIndex;
		if(storage){
			storage=storage|mask;
			player.setDynamicProperty(achievmentDefs.container,storage);
		}else{
			player.setDynamicProperty(achievmentDefs.container,mask);
		}
		this.addToScore("stats_achievments_",this.name,player)
		this.achievmentUnlock(player,achievmentDefs.displayName+"\n"+achievmentDefs.description)
	}
	getAchievmentName(handle){
		return this.achievments[handle].displayName;
	}
	getCategory(handle){
		return this.achievments[handle].category;
	}
	getDefinition(handle){
		return this.achievments[handle];
	}
	getDisplayString(handle,player){
		const status = this.checkAchievment(handle,player)
		
	}
	getAllAchievmentData(player){
		let playerData={}
		for (let dynamicProperty of this.dynamicProperties){
			playerData[dynamicProperty]=player.getDynamicProperty(dynamicProperty)
		}
		let achievmentData={}
		for (const [achievmentHandle, achievementDef] of Object.entries(this.achievments)) {
			if (!(achievementDef.category in achievmentData)){
				achievmentData[achievementDef.category]={}
			}
			if(achievementDef.implemented){
				achievmentData[achievementDef.category][achievmentHandle]=achievementDef
				achievmentData[achievementDef.category][achievmentHandle].unlocked=this.checkAchievment(achievmentHandle,player)
			}
		}
		return achievmentData
	}
	achievmentUnlock(player,str){
		let display=player.onScreenDisplay
		display.setActionBar({text:"\u00A7cAchievment Unlocked: \u00A7e"+str})
		player.playSound("random.levelup")
	}
	addToScore(category, item, player){
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
}



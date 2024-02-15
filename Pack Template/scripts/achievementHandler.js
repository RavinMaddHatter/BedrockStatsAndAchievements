export class achievementHandler{
	constructor(achievementObject){
		this.achievements=achievementObject;
		this.dynamicProperties=[]
		for (const [key, value] of Object.entries(this.achievements)) {
			if(!this.dynamicProperties.includes(value.container)){
				this.dynamicProperties.push(value.container)
			}
		}
	}
	checkAchievement(handle,player){
		const achievementDefs = this.achievements[handle];
		const storage = player.getDynamicProperty(achievementDefs.container);
		if(storage){
			const mask = 0b1<<achievementDefs.containerIndex;
			return (storage&mask) == mask;
		}
		else{
			player.setDynamicProperty(achievementDefs.container,0);
			return false;
		}
	}
	setAchievement(handle,player){
		const achievementDefs = this.achievements[handle];
		let storage = player.getDynamicProperty(achievementDefs.container);
		const mask = 0b1<<achievementDefs.containerIndex;
		if(storage){
			storage=storage|mask;
			player.setDynamicProperty(achievementDefs.container,storage);
		}else{
			player.setDynamicProperty(achievementDefs.container,mask);
		}
		this.achievementUnlock(player,achievementDefs.displayName+"\n"+achievementDefs.description)
	}
	getAchievementName(handle){
		return this.achievements[handle].displayName;
	}
	getCategory(handle){
		return this.achievements[handle].category;
	}
	getDefinition(handle){
		return this.achievements[handle];
	}
	getDisplayString(handle,player){
		const status = this.checkAchievement(handle,player)
		
	}
	getAllAchievementData(handle,player){
		let playerData={}
		for (let dynamicProperty of this.dynamicProperties){
			playerData[dynamicProperty]=player.getDynamicProperty(dynamicProperty)
		}
		let achievementData={}
		for (const [achievementHandle, achievementDef] of Object.entries(this.achievements)) {
			if (!(achievementDef.category in achievementData)){
				achievementData[category]={}
			}
			achievementData[category][achievementHandle]=achievementDef
			achievementData[category][achievementHandle].unlocked=playerData[achievementDef.container]&0b1<<achievementDef.containerIndex > 0
		}
		return achievementData
	}
	achievementUnlock(player,str){
		let display=player.onScreenDisplay
		display.setActionBar({text:"\u00A7cAchievement Unlocked: \u00A7e"+str})
		player.playSound("random.levelup")
	}
}
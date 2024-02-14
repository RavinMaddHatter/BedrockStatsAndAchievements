export class achievementHandler{
	constructor(achievmentObject){
		this.achievments=achievmentObject;
		this.dynamicProperties=[]
		for (const [key, value] of Object.entries(this.achievments)) {
			if(!this.dynamicProperties.includes(value.container){
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
	getAllAchievmentData(handle,player){
		let playerData={}
		for (let dynamicProperty of this.dynamicProperties){
			playerData[dynamicProperty]=player.getDynamicProperty(dynamicProperty)
		}
		let achievmentData={}
		for (const [achievmentHandle, achievementDef] of Object.entries(this.achievments)) {
			if (!(achievementDef.category in achievmentData)){
				achievmentData[category]={}
			}
			achievmentData[category][achievmentHandle]=achievementDef
			achievmentData[category][achievmentHandle].unlocked=playerData[achievementDef.container]&0b1<<achievementDef.containerIndex > 0
		}
		return achievmentData
	}
	achievmentUnlock(player,str){
		let display=player.onScreenDisplay
		display.setActionBar({text:"\u00A7cAchievment Unlocked: \u00A7e"+str})
		player.playSound("random.levelup")
	}
}
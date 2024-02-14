export class achievementHandler{
	constructor(achievmentObject){
		this.achievments=achievmentObject;
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
	achievmentUnlock(player,str){
		let display=player.onScreenDisplay
		display.setActionBar({text:"\u00A7cAchievment Unlocked: \u00A7e"+str})
		player.playSound("random.levelup")
	}
}
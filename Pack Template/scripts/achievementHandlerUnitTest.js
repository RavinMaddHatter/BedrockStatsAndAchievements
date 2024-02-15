import { world, system } from '@minecraft/server';
import {ActionFormData, ActionFormResponse } from "@minecraft/server-ui";
import { achievements, advancements } from "textObjects";
import {achievementHandler} from "achievementHandler"

var achievments1=Object.keys(achievements)
var achievments2=Object.keys(achievements)
var advancements1=Object.keys(advancements)
var advancements2=Object.keys(advancements)
achievments1.sort( () => .5 - Math.random() );
achievments2.sort( () => .5 - Math.random() );
advancements1.sort( () => .5 - Math.random() );
advancements2.sort( () => .5 - Math.random() );
var achievmentTracker1= new achievementHandler(achievements)
var advancementsTracker1= new achievementHandler(advancements)

var loopHandle = system.runInterval(loopObjects,1)
var player = world.getPlayers()[0];
player.clearDynamicProperties()
function loopObjects(){
	
	if(achievments1.length>0){
		const handle=achievments1.pop()
		const achievmentStats=achievmentTracker1.checkAchievment(handle,player)
		
		if(achievmentStats){
			console.warn(handle)
			console.warn(achievmentTracker1.getAchievmentName(handle))
			console.warn(achievmentStats)
			console.warn("FAILED")
		}
		achievmentTracker1.setAchievment(handle,player)
		
	}else if (achievments2.length>0){
		const handle=achievments2.pop()
		const achievmentStats=achievmentTracker1.checkAchievment(handle,player)
		
		if(!achievmentStats){
			console.warn("FAILED")
			console.warn(achievmentStats)
		}
		
	}else if(advancements1.length>0){
		const handle=advancements1.pop()
		const achievmentStats=advancementsTracker1.checkAchievment(handle,player)
		
		if(achievmentStats){
			console.warn(handle)
			console.warn(advancementsTracker1.getAchievmentName(handle))
			console.warn(achievmentStats)
			console.warn("FAILED")
		}
		advancementsTracker1.setAchievment(handle,player)
		
	}else if (advancements2.length>0){
		const handle=advancements2.pop()
		const achievmentStats=advancementsTracker1.checkAchievment(handle,player)
		
		if(!achievmentStats){
			console.warn("FAILED")
			console.warn(achievmentStats)
		}
		
	}else{
		console.warn("completed")
		system.clearRun(loopHandle)
	}
}
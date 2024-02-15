import { world, system } from '@minecraft/server';
import {ActionFormData, ActionFormResponse } from "@minecraft/server-ui";
import { achievements, advancements } from "textObjects";
import {achievementHandler} from "achievementHandler"

var achievments1=achievements.keys()
var achievments2=achievements.keys()
var achievmentTracker1= new achievementHandler(achievements)

system.runInterval(loopObjects,40)

function loopObjects(){
	let player = mc.world.getPlayers()[0];
	if(achievments1.length>0){
		const handle=achievments1.pop()
		console.warn(handle)
		console.warn(getAchievmentName(handle))
		const achievmentStats=achievementHandler.checkAchievment(handle,player)
		console.warn(achievmentStats)
		
		if(achievmentStats){
			console.warn("FAILED")
		}
		achievementHandler.setAchievment(handle,player)
		
	}else if (achievments2.length>0){
		const handle=achievments2.pop()
		const achievmentStats=achievementHandler.checkAchievment(handle,player)
		console.warn(achievmentStats)
		if(!achievmentStats){
			console.warn("FAILED")
		}
		
	}else{
		console.warn("completed")
	}
}
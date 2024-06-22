import { world } from '@minecraft/server';

export class inventoryHandler{
	constructor(achievementTracker,advancementTracker,chalengeTracker,getequipped){
		this.achievementTracker = achievementTracker;
		this.advancementTracker = advancementTracker;
		this.chalengeTracker = chalengeTracker;
		this.getequipped = getequipped;
	}
	itemInventory(player){
		//to-do--------------------
			//Required data values
			//cant be done until after block renames happen our data values are given to itemStack class
			//[advancement] Spooky Scary Skeleton | Obtain a Wither Skeleton's skull | Have a wither skeleton skull in your inventory.
			//[achievement] Dry Spell | Dry a sponge in a furnace | —
			//[advancement] Careful Restoration | Make a Decorated Pot out of 4 Pottery Sherds | —
			//[achievement] Careful restoration | Make a Decorated Pot out of 4 Pottery Sherds | —
			//[achievement] Fruit on the Loom | Make a banner using an Enchanted Apple Stencil | Make a banner using an enchanted apple.
			
			//mabye should move
			//i dont know how to do this one
			//[achievement] Taking Inventory | Open your inventory. | —
			//Maybe block interactions?
			//[achievement] Chestful of Cobblestone | Mine 1,728 Cobblestone and place it in a chest. | A player must mine 1,728 cobblestone and place 1,728 cobblestone, or 27 stacks, in a chest. The cobblestone placed in the chest does not have to be the same cobblestone that was mined.
		//done--------------------
		const loseItems = ["crafting_table",
							"iron_ingot",		
							"diamond",			
							"ancient_debris",	
							"lava_bucket",		
							"cod_bucket",
							"salmon_bucket",
							"tropical_fish_bucket",
							"pufferfish_bucket",
							"axolotl_bucket",	
							"tadpole_bucket",	
							"cobblestone",
							"blackstone",
							"cobbled_deepslate",
							"obsidian",			
							"crying_obsidian",	
							"blaze_rod",		
							"dragon_egg",		
							"sniffer_egg",		
							"dragon_breath",	
							"bread", 			
							"furnace", 		 	
							"enchanting_table",	
							"bookshelf",		
							"cake",				
							"leather",			
							"dispenser",		
							"cooked_cod",		
							"charcoal",
							"flower_pot"]		
		const woolTypes=["black_wool",
						"blue_wool",
						"brown_wool",
						"cyan_wool",
						"gray_wool",
						"green_wool",
						"light_blue_wool",
						"light_gray_wool",
						"lime_wool",
						"magenta_wool",
						"orange_wool",
						"pink_wool",
						"purple_wool",
						"red_wool",
						"white_wool",
						"yellow_wool"]
		const toolsTypes = ["wooden_pickaxe",
						"wooden_sword",
						"wooden_shovel",
						"wooden_axe",
						"wooden_hoe",
						"stone_pickaxe",
						"stone_sword",
						"stone_shovel",
						"stone_axe",
						"stone_hoe",
						"iron_pickaxe",
						"iron_sword",
						"iron_shovel",
						"iron_axe",
						"iron_hoe",
						"golden_pickaxe",
						"golden_sword",
						"golden_shovel",
						"golden_axe",
						"golden_hoe",
						"diamond_pickaxe",
						"diamond_sword",
						"diamond_shovel",
						"diamond_axe",
						"diamond_hoe",
						"netherite_pickaxe",				
						"netherite_sword",				
						"netherite_shovel",				
						"netherite_axe",				
						"netherite_hoe"]				
							
		const armorTypes = ["iron_helmet",
						"iron_chestplate",
						"iron_leggings",
						"iron_boots",
						"diamond_helmet",
						"diamond_chestplate",
						"diamond_leggings",
						"diamond_boots",
						"netherite_helmet",
						"netherite_chestplate",
						"netherite_leggings",
						"netherite_boots",
						"elytra"];			
		const foglightType=["ochre_froglight",
							"pearlescent_froglight",
							"verdant_froglight"]
		const sherdArray = ["angler_pottery_sherd",
							"archer_pottery_sherd",
							"arms_up_pottery_sherd",
							"blade_pottery_sherd",
							"brewer_pottery_sherd",
							"burn_pottery_sherd",
							"danger_pottery_sherd",
							"explorer_pottery_sherd",
							"friend_pottery_sherd",
							"heart_pottery_sherd",
							"heartbreak_pottery_sherd",
							"howl_pottery_sherd",
							"miner_pottery_sherd",
							"mourner_pottery_sherd",
							"plenty_pottery_sherd",
							"prize_pottery_sherd",
							"sheaf_pottery_sherd",
							"shelter_pottery_sherd",
							"skull_pottery_sherd",
							"snort_pottery_sherd"];
		
		let inventoryPlayer = player.getComponent("minecraft:inventory");
		let index=0;
		let inventorymask = 0;
		let armorMask = 0;
		let sherdMask = 0;
		let toolMask = 0;
		let woolMask = 0;
		let froglight = 0;
		for (let slot = 0; slot<36;slot++){
			let itemStack = inventoryPlayer.container.getItem(slot);
			if (itemStack){
				const itemName = itemStack.typeId.replace("minecraft:","")
				if(loseItems.includes(itemName)){
					index = loseItems.indexOf(itemName)
					inventorymask = inventorymask | (0b1<<index)
				}
				else if (sherdArray.includes(itemName)){
					index = sherdArray.indexOf(itemName)
					sherdMask = sherdMask | (0b1<<index)
				}else if(toolsTypes.includes(itemName)){
					index = toolsTypes.indexOf(itemName)
					toolMask = toolMask | (0b1<<index)
					
				}else if(woolTypes.includes(itemName)){
					index = woolTypes.indexOf(itemName)
					woolMask = woolMask | (0b1<<index)
					
				}else if(foglightType.includes(itemName)){
					index = foglightType.indexOf(itemName)
					froglight = froglight | (0b1<<index)
					
				}else if(itemName.includes("shulker_box")){
					//[achievement] Organizational Wizard | Name a Shulker Box with an Anvil | —
					if(itemStack.nameTag){
						if(!this.achievementTracker.checkAchievment("OrganizationalWizard",player)){
							this.achievementTracker.setAchievment("OrganizationalWizard",player)
						}
					}
				}
			}
		}
		const equip = this.getequipped(player)
		for(const slot of ["Chest","Feet","Head","Legs"]){
			let itemName = equip[slot];
			if(armorTypes.includes(itemName)){
				index = armorTypes.indexOf(itemName)
				armorMask = armorMask | (0b1<<index)
			}
		} 
		//Checks armor based achievements
		if(armorMask>0){
			this.checkArmorachievements(player,armorMask);
		}
		//check tool based achievements
		if(toolMask>0){
			this.checkToolachievements(player,toolMask);
		}
		if(inventorymask>0){
			this.checkLooseItemachievements(player,inventorymask)
		}
		
		//[advancement] Respecting the Remnants | Brush a Suspicious block to obtain a Pottery Sherd | —
		if(sherdArray>0){
			if(!this.advancementTracker.checkAchievment("RespectingtheRemnants",player)){
				this.advancementTracker.setAchievment("RespectingtheRemnants",player)
			}
		}
		if(froglight==0b111){
			//[advancement] With Our Powers Combined! | Have all Froglights in your inventory | Have a Pearlescent, Ochre, and Verdant Froglight in your inventory.
			//[achievement] With our powers combined! | Have all 3 froglights in your inventory | Acquire at least one of each pearlescent, verdant, and ochre froglights in your inventory at the same time.		
			if(!this.advancementTracker.checkAchievment("WithOurPowersCombined",player)){
				this.advancementTracker.setAchievment("WithOurPowersCombined",player)
				this.achievementTracker.setAchievment("Withourpowerscombined",player)
			}
		}
		if(woolMask==0b1111111111111111){
			//[achievement] Rainbow Collection | Gather all 16 colors of wool. | All the colors of wool do not have to be in the inventory at the same time, but must have been picked up by the player at least once.
			if(!this.achievementTracker.checkAchievment("RainbowCollection",player)){
				this.achievementTracker.setAchievment("RainbowCollection",player)
			}
		}
	}
	checkArmorachievements(player,armorMask){
		const allIronArmorMask = 0b1111;
		const allDiamondArmorMask = 0b11110000;
		const allNetheriteArmorMask = 0b111100000000;
		const elytraMask = 0b1000000000000
		//[advancement] Suit Up | Protect yourself with a piece of iron armor | Have any type of iron armor in your inventory.
		if((allIronArmorMask & armorMask)>0){
			if(!this.advancementTracker.checkAchievment("SuitUp",player)){
				this.advancementTracker.setAchievment("SuitUp",player)
			}
			//[achievement] Iron Man | Wear a full suit of Iron Armor. | —
			if((allIronArmorMask & armorMask) == allIronArmorMask){
				if(!this.achievementTracker.checkAchievment("IronMan",player)){
					this.achievementTracker.setAchievment("IronMan",player)
				}
			}
		}
		//[advancement] Cover Me with Diamonds | Diamond armor saves lives | Have any type of diamond armor in your inventory.
		if((allDiamondArmorMask & armorMask)>0){
			if(!this.advancementTracker.checkAchievment("CoverMewithDiamonds",player)){
				this.advancementTracker.setAchievment("CoverMewithDiamonds",player)
			}
		}
		
		
		//[achievement] Cover me in debris | Wear a full set of Netherite armor | Have a full set of Netherite armor in your inventory.
		//[advancement] Cover Me in Debris | Get a full suit of Netherite armor | Have a full set of netherite armor in your inventory.
		if((allNetheriteArmorMask & armorMask)==allNetheriteArmorMask){
			if(!this.advancementTracker.checkAchievment("Covermeindebris",player)){
				this.advancementTracker.setAchievment("Covermeindebris",player)
				this.achievementTracker.setAchievment("Covermeindebris",player)
			}
		}
		
		//[advancement] Sky's the Limit | Find Elytra | Have a pair of elytra in your inventory.
		if((elytraMask & armorMask)==elytraMask){
			if(!this.advancementTracker.checkAchievment("SkystheLimit",player)){
				this.advancementTracker.setAchievment("SkystheLimit",player)
			}
		}
	}
	checkToolachievements(player,toolMask){
		const hoeAnyType=0b100001000010000100001000010000;
		const axeAnyType=0b010000100001000010000100001000;
		const shovelAnyType=0b001000010000100001000010000100;
		const swordAnyType=0b000100001000010000100001000010;
		const pickAnyType=0b00010000100001000010000100001;
		const woodPickType = 0b1;
		const stonePickType = 0b100000;
		const ironPickType = 0b10000000000;
		const allWood=0b11111;
		const allstone=0b1111100000;
		const alliron=0b111110000000000;
		const alldiamond=0b11111000000000000000;
		const allnetherite=0b1111100000000000000000000;
		const woodHoe=0b10000
		const woodSword=0b10
		const netheriteHoe=0b100000000000000000000000000000
		if((pickAnyType&toolMask)>0){
			//[achievement] Time to Mine! | Use planks and sticks to make a pickaxe. | Pick up any type of pickaxe from a crafting table output.
			if((woodPickType&toolMask)==woodPickType){
				if(!this.achievementTracker.checkAchievment("TimetoMine",player)){
					this.achievementTracker.setAchievment("TimetoMine",player)
				}
			}
			//[achievement] Getting an Upgrade | Construct a better pickaxe. | Pick up a stone pickaxe from a crafting table output.
			//[advancement] Getting an Upgrade | Construct a better Pickaxe | Have a stone pickaxe in your inventory.
			if((stonePickType&toolMask)==stonePickType){
				if(!this.advancementTracker.checkAchievment("GettinganUpgrade",player)){
					this.advancementTracker.setAchievment("GettinganUpgrade",player)
					this.achievementTracker.setAchievment("GettinganUpgrade",player)
				}
			}

			//[advancement] Isn't It Iron Pick | Upgrade your Pickaxe | Have an iron pickaxe in your inventory.
			if((ironPickType&toolMask)==ironPickType){
				if(!this.advancementTracker.checkAchievment("IsntItIronPick",player)){
					this.advancementTracker.setAchievment("IsntItIronPick",player)
				}
			}	
			//[achievement] MOAR Tools | Construct one type of each tool. | Construct one pickaxe, one shovel, one axe, and one hoe with the same material.
			let toolsOfOneType = (toolMask&allWood)==allWood
			toolsOfOneType = toolsOfOneType || (toolMask&allstone)==allstone
			toolsOfOneType = toolsOfOneType || (toolMask&alliron)==alliron
			toolsOfOneType = toolsOfOneType || (toolMask&alldiamond)==alldiamond
			toolsOfOneType = toolsOfOneType || (toolMask&allnetherite)==allnetherite
			if(toolsOfOneType){
				if(!this.achievementTracker.checkAchievment("MOARTools",player)){
					this.achievementTracker.setAchievment("MOARTools",player)
				}
			}
		}
		if((hoeAnyType&toolMask)>0){
			//[achievement] Time to Farm! | Make a Hoe. | Pick up any type of hoe from a crafting table output.
			if((woodHoe&toolMask)==woodHoe){
				if(!this.achievementTracker.checkAchievment("TimetoFarm",player)){
					this.achievementTracker.setAchievment("TimetoFarm",player)
				}
			}
			// [advancement] Serious Dedication | Have a netherite hoe in your inventory.
			if((netheriteHoe&toolMask)==netheriteHoe){
				if(!this.advancementTracker.checkAchievment("SeriousDedication",player)){
					this.advancementTracker.setAchievment("SeriousDedication",player)
				}
			}
		}
		//[achievement] Time to Strike! | Use planks and sticks to make a sword. | Pick up any type of sword from a crafting table output.
		if((woodSword&toolMask)==woodSword){
				if(!this.achievementTracker.checkAchievment("TimetoStrike",player)){
					this.achievementTracker.setAchievment("TimetoStrike",player)
				}
			}
	}
	checkLooseItemachievements(player,inventorymask){
		const craftingTable =	 0b1
		const ironIngotMask =	 0b10
		const diamondMask = 	 0b100
		const ancientDebrisMask =0b1000
		const lavaMask=			 0b10000
		const bucketOfFishMask = 0b111100000;
		const axolotlMask = 	 0b1000000000;
		const tadpoleMask = 	 0b10000000000;
		const halfMask = 		 0b1111111111111
		const stoneTypesMask = 	 0b11100000000000;
		const obsidianMask = 	 0b100000000000000;
		const cryingMask =	 	 0b1000000000000000;
		const blazeMask =	 	 0b10000000000000000;
		const dragonEggMask = 	 0b100000000000000000;
		const snifferEggMask = 	 0b1000000000000000000;
		const dragonBreadthMask =0b10000000000000000000;
		const breadMask =		 0b100000000000000000000;
		const furnaceMask =		 0b1000000000000000000000;
		const tableMask =		 0b10000000000000000000000;
		const bookshelfMask =	 0b100000000000000000000000;
		const cakeMask =		 0b1000000000000000000000000;
		const leatherMask =		 0b10000000000000000000000000;
		const dispenserMask =	 0b100000000000000000000000000;
		const coookedCodMask = 	 0b1000000000000000000000000000;
		const charcoalMask = 	 0b10000000000000000000000000000;
		const flowerPot = 		 0b100000000000000000000000000000;
		const otherhalfMask = 	 0b111111111111111100000000000000;
		if((halfMask&inventorymask)>0){
			//[achievement] Benchmaking | Craft a workbench with four blocks of wooden planks. | Pick up a crafting table from the inventory's crafting field output or a crafting table output.
			//[advancement] Minecraft | The heart and story of the game | Have a crafting table in your inventory.
			if((craftingTable&inventorymask)==craftingTable){
				if(!this.advancementTracker.checkAchievment("Minecraft",player)){
					this.advancementTracker.setAchievment("Minecraft",player)
					this.achievementTracker.setAchievment("Benchmaking",player)
				}
			}
			//[achievement] Acquire Hardware | Smelt an iron ingot | Pick up an iron ingot from a furnace output.
			//[advancement] Acquire Hardware | Smelt an Iron Ingot | Have an iron ingot in your inventory.
			if((ironIngotMask&inventorymask)==ironIngotMask){
				if(!this.advancementTracker.checkAchievment("AcquireHardware",player)){
					this.advancementTracker.setAchievment("AcquireHardware",player)
					this.achievementTracker.setAchievment("AcquireHardware",player)
				}
			}
			//[achievement] DIAMONDS! | Acquire diamonds with your iron tools. | Pick up a diamond from the ground.
			//[advancement] Diamonds! | Acquire diamonds | Have a diamond in your inventory.
			if((diamondMask&inventorymask)==diamondMask){
				if(!this.advancementTracker.checkAchievment("Diamonds",player)){
					this.advancementTracker.setAchievment("Diamonds",player)
					this.achievementTracker.setAchievment("DIAMONDS",player)
				}
			}
			//[advancement] Hidden in the Depths | Obtain Ancient Debris | Have an ancient debris in your inventory.
			if((ancientDebrisMask&inventorymask)==ancientDebrisMask){
				if(!this.advancementTracker.checkAchievment("HiddenintheDepths",player)){
					this.advancementTracker.setAchievment("HiddenintheDepths",player)
				}
			}
			//[advancement] Hot Stuff | Fill a Bucket with lava | Have a lava bucket in your inventory.
			if((lavaMask&inventorymask)==lavaMask){
				if(!this.advancementTracker.checkAchievment("HotStuff",player)){
					this.advancementTracker.setAchievment("HotStuff",player)
				}
			}
			//[advancement] The Cutest Predator | Catch an Axolotl in a Bucket | Use a water bucket on an axolotl.
			if((axolotlMask&inventorymask)==axolotlMask){
				if(!this.advancementTracker.checkAchievment("TheCutestPredator",player)){
					this.advancementTracker.setAchievment("TheCutestPredator",player)
				}
			}
			//[advancement] Bukkit Bukkit | Catch a Tadpole in a Bucket | —
			if((tadpoleMask&inventorymask)==tadpoleMask){
				if(!this.advancementTracker.checkAchievment("BukkitBukkit",player)){
					this.advancementTracker.setAchievment("BukkitBukkit",player)
				}
			}
			//[achievement] I am a Marine Biologist | Collect a fish in a bucket | Use an empty bucket on any fish mob to collect it.
			//[advancement] Tactical Fishing | Catch a Fish... without a Fishing Rod! | Use a water bucket on any fish mob.
			if(( bucketOfFishMask & inventorymask)>0){
				if(!this.advancementTracker.checkAchievment("TacticalFishing",player)){
					this.advancementTracker.setAchievment("TacticalFishing",player)
					this.achievementTracker.setAchievment("IamaMarineBiologist",player)
				}
			}
		}
		if((otherhalfMask&inventorymask)>0){
			//[advancement] Stone Age | Mine Stone with your new Pickaxe | Have one of these 3 stones in the #stone_tool_materials item tag:, Cobblestone, Blackstone, Cobbled Deepslate, in your inventory.
			if((stoneTypesMask & inventorymask)>0){
				if(!this.advancementTracker.checkAchievment("StoneAge",player)){
					this.advancementTracker.setAchievment("StoneAge",player)
				}
			}
			//[advancement] Ice Bucket Challenge | Obtain a block of Obsidian | Have a block of obsidian in your inventory.
			if((obsidianMask&inventorymask)==obsidianMask){
				if(!this.advancementTracker.checkAchievment("IceBucketChallenge",player)){
					this.advancementTracker.setAchievment("IceBucketChallenge",player)
				}
			}
			//[advancement] Who is Cutting Onions? | Obtain Crying Obsidian | Have a block of crying obsidian in your inventory.
			if((cryingMask&inventorymask)==cryingMask){
				if(!this.advancementTracker.checkAchievment("WhoisCuttingOnions",player)){
					this.advancementTracker.setAchievment("WhoisCuttingOnions",player)
				}
			}
			//[achievement] Into Fire | Relieve a Blaze of its rod. | Pick up a blaze rod from the ground.
			//[advancement] Into Fire | Relieve a Blaze of its rod | Have a blaze rod in your inventory.
			if((blazeMask&inventorymask)==blazeMask){
				if(!this.advancementTracker.checkAchievment("IntoFire",player)){
					this.advancementTracker.setAchievment("IntoFire",player)
					this.achievementTracker.setAchievment("IntoFire",player)
				}
			}
			//[advancement] The Next Generation | Hold the Dragon Egg | Have a dragon egg in your inventory.
			if((dragonEggMask&inventorymask)==dragonEggMask){
				if(!this.advancementTracker.checkAchievment("TheNextGeneration",player)){
					this.advancementTracker.setAchievment("TheNextGeneration",player)
				}
			}
			//[advancement] Smells Interesting | Obtain a Sniffer Egg | Have a sniffer egg in your inventory.
			if((snifferEggMask&inventorymask)==snifferEggMask){
				if(!this.advancementTracker.checkAchievment("SmellsInteresting",player)){
					this.advancementTracker.setAchievment("SmellsInteresting",player)
				}
			}
			//[advancement] You Need a Mint | Collect Dragon's Breath in a Glass Bottle | Have a bottle of dragon's breath in your inventory.
			//[achievement] You Need a Mint | Collect dragons breath in a glass bottle | Have a dragon's breath bottle in your inventory
			if((dragonBreadthMask&inventorymask)==dragonBreadthMask){
				if(!this.advancementTracker.checkAchievment("YouNeedaMint",player)){
					this.advancementTracker.setAchievment("YouNeedaMint",player)
					this.achievementTracker.setAchievment("YouNeedaMint",player)
				}
			}
			//[achievement] Bake Bread | Turn wheat into bread. | Pick up bread from a crafting table output.
			if((breadMask&inventorymask)==breadMask){
				if(!this.achievementTracker.checkAchievment("BakeBread",player)){
					this.achievementTracker.setAchievment("BakeBread",player)
				}
			}
			//[achievement] Hot Topic | Construct a furnace out of eight cobblestone blocks. | Pick up a furnace from a crafting table output.
			if((furnaceMask&inventorymask)==furnaceMask){
				if(!this.achievementTracker.checkAchievment("HotTopic",player)){
					this.achievementTracker.setAchievment("HotTopic",player)
				}
			}
			//[achievement] Enchanter | Construct an Enchantment Table. | Pick up an enchantment table from a crafting table output.
			if((tableMask&inventorymask)==tableMask){
				if(!this.achievementTracker.checkAchievment("Enchanter",player)){
					this.achievementTracker.setAchievment("Enchanter",player)
				}
			}
			//[achievement] Librarian | Build some bookshelves to improve your enchantment table. | Pick up a bookshelf from a crafting table output.
			if((bookshelfMask&inventorymask)==bookshelfMask){
				if(!this.achievementTracker.checkAchievment("Librarian",player)){
					this.achievementTracker.setAchievment("Librarian",player)
				}
			}
			//[achievement] The Lie | Bake a cake using: wheat, sugar, milk, and eggs. | Pick up a cake from a crafting table output.
			if((cakeMask&inventorymask)==cakeMask){
				if(!this.achievementTracker.checkAchievment("TheLie",player)){
					this.achievementTracker.setAchievment("TheLie",player)
				}
			}
			//[achievement] Cow Tipper | Harvest some leather. | Pick up leather from the ground.
			if((leatherMask&inventorymask)==leatherMask){
				if(!this.achievementTracker.checkAchievment("CowTipper",player)){
					this.achievementTracker.setAchievment("CowTipper",player)
				}
			}
			//[achievement] Dispense with This | Construct a Dispenser. | —
			if((dispenserMask&inventorymask)==dispenserMask){
				if(!this.achievementTracker.checkAchievment("DispensewithThis",player)){
					this.achievementTracker.setAchievment("DispensewithThis",player)
				}
			}
			//[achievement] Catch and cook a fish! | Pick up a cooked cod after cooking it in a Furnace, Smoker, Campfire, or Soul Campfire. Doesn't work if the block used is hooked up to a hopper, as the player is not getting the item directly from the output.
			if((coookedCodMask&inventorymask)==coookedCodMask){
				if(!this.achievementTracker.checkAchievment("DeliciousFish",player)){
					this.achievementTracker.setAchievment("DeliciousFish",player)
				}
			}
			//[achievement] Renewable Energy | Smelt wood trunks using charcoal to make more charcoal. | Smelt a wooden log with charcoal as the fuel.
			if((charcoalMask&inventorymask)==charcoalMask){
				if(!this.achievementTracker.checkAchievment("RenewableEnergy",player)){
					this.achievementTracker.setAchievment("RenewableEnergy",player)
				}
			}
			//[achievement] Renewable Energy | Smelt wood trunks using charcoal to make more charcoal. | Smelt a wooden log with charcoal as the fuel.
			if((flowerPot&inventorymask)==flowerPot){
				if(!this.achievementTracker.checkAchievment("PotPlanter",player)){
					this.achievementTracker.setAchievment("PotPlanter",player)
				}
			}
		}
	}
}



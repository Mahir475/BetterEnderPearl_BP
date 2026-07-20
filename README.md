**NOT AN OFFICIAL MINECRAFT PRODUCT. NOT APPROVED BY OR ASSOCIATED WITH MOJANG OR MICROSOFT.**

# The goal of this pack is to make permanent/restart proof stasis chamber and pearl cannon work on minecraft bedrock

Stasis Chamber allow players to teleport back from millions of block back to their base(where the stasis chamber was built) but this chamber only work if the chunk in which it is made is always active until Minecraft Java 1.21.2

In Minecraft Java 1.21.2,Ender pearl chunk loading and log proof pearls was added, which made permanent log proof stasis and ender pearl cannon a thing

But this features never made its way to bedrock

<img width="672" height="342" alt="Screenshot_2026-06-23_17-11-55" src="https://github.com/user-attachments/assets/4e89351e-520d-49c4-b9f6-63c77ded2aa7" />

While this pack make permanent chamber possible,we still need ender pearl chunk loading by default(as an in game mechanic) for enderpearl canon

# Changelogs

Removed the Offline TP thing that felt out of vanilla isn't really required

Added one more behaviour pack with pearl loading 

# Why not use tick world?
PS : Tick world loads area around an entity

tick world loads(lowest) a 5x5 Chunk area = 25 fully loaded chunk and on java pearls loads 3x3 chunk area with 1 fully loaded chunk and 8 lazy chunk

Hence this isn't best way to have pearl chunk loader(I think) and would limit the no of stasis plus you would have to calculate where you are placing your stasis, since those chunk remain forever login i.e playerless for(ex- bee farm,iron farm,glov),crops would run throught your player through 

<img width="667" height="227" alt="Screenshot_2026-07-06_22-37-24" src="https://github.com/user-attachments/assets/fccd54b1-2261-4aa3-9f36-082d5ff23262" />

It isn't as heavy as I make it sound.Think of it as an player standing/sitting on one place just don't have it near lag machines like sand duping,etc and u should be good to go 

# Why now?

I saw this
<img width="1260" height="1374" alt="Screenshot_20260630_162017" src="https://github.com/user-attachments/assets/df1f2cf1-2ce4-48f3-8517-1403476e8188" />

And was like well my pack should fix it(Spoiler : IT DOESS)

So I started looking at what could be differntiating between pearl canon and stasis. The speed of the pearl came in my mind but couldn't find anything which allowed to read the speed
Next approach which came was detecting the blast on pearl and found this

<img width="1322" height="616" alt="Screenshot_2026-07-01_15-18-59" src="https://github.com/user-attachments/assets/5b6823db-3b79-4ee5-8a04-ffe02a208948" />

Tried using damage sensor to trigger tick world(allows to add tick world only to a particular pearl in this way stasis doesnt get affected and pearl cannon also work downside: only tnt based pearl cannon work)

Cause wind charge don't do any damage hence it fails

Modifiying the json file of wind charge cause the pearl to get destroyed

So,well I haven't found any effective solution,I am providing 2 version of pack with and without tick world.
Pearl loading should be fine if you are only gonna use 1-2 stasis.
You can decide which one works the best for you

# Download

Pearl with no chunk loading

https://www.mediafire.com/file/ypw8fndixuqcdbu/BetterEnderPearl_BP%2528no_tick_world%2529.zip/file

Pearl with chunk loading

https://www.mediafire.com/file/hw2p7wr0u0x3wtl/BetterEnderPearl_BP%2528tick_world%2529.zip/file

# About

This behaviour pack uses entity tag to persistently store Pearl's Owner into world's save file.
The script for this behaviour pack was made using ai assitance
Also the Behaviour pack is made achivement friendly using MikeHomer's trick from bedrock chunk loader
If you use the version with tickworld then avoid using Bedrock Chunk Loader since both use tick world 

https://github.com/user-attachments/assets/29c8e177-81b6-4d20-a0b0-a8104348fb07

https://github.com/user-attachments/assets/f7bbccf0-9b3d-4c66-894c-a00ab66faa69

https://github.com/user-attachments/assets/fe86959b-1ae6-46d0-b60f-5bd94eafb7da

https://github.com/user-attachments/assets/d9afc1af-37ed-4775-b767-9209760b4e77


# Generic Idea Of What Script Does

| Variable / Function / EventsListener | Description |
|---|---|
| `entity.addTag` | Adds a custom tag `PearlOwner` directly onto the pearl entity. Tag is saved into lvldb,world's save file (unload n restart-proof). |
| `activePearls = new Map()` | Is a cache memory which is used to store pearl along with `PearlOwner` tag. |
| `impactLocation` | A set of 3D coordinates passed by Minecraft's physics engine at the exact millisecond the pearl hits a block or entity. |
| `dimensionId` | Stores the dimension in which the pearl currently exists. |
| `deadId`  | Gets the pearl's ID, which is matched in the Map (like a lookup table) to find the `PearlOwner`. |
| `function mapPearlOwner` | Links loaded pearls to the `PearlOwner` tag and stores it using `activePearls`. |
| `function handlePearlImpact` | Teleports the player if present in the world |
| `world.afterEvents.entitySpawn.subscribe` | Used to tag the pearl with the `PearlOwner` tag when the pearl is thrown. |
| `world.afterEvents.entityLoad.subscribe` | Looks for pearls when a chunk is loaded; if found, calls `function mapPearlOwner`. |
| `world.afterEvents.projectileHitBlock.subscribe` | If projectile hitting the block is enderpearl  it calls `function handlePearlImpact`. |
| `world.afterEvents.projectileHitEntity.subscribe` | If projectile hitting the entity is enderpearl it calls `function handlePearlImpact`. |

# Tests performed by me on world and bds server.NO TESTS HAS BEEN DONE IN REALMS

Tests are done in 26.21 but should be fine on latest version as well

Works in 26.33 as well

Made a stasis unload it closed the game ran different applications restarted the device and opened game after multipe hours and stasis still works

Made two stasis in the overworld moved one player to nether and other to end closed the server restarted it loaded the stasis through a third player and activated both at the exact same time both player got teleported at the exact same time and teleport worked through dimension

https://youtu.be/cLl9HV5fvqc?si=u5O6awMUtjj17pt-

Teleport of almost 20k Blocks has been done using railgun(not meant to be used as pearl cannon) from reality

https://youtu.be/FNRyo-bb7dg?si=EqELgeC4b0MdGvhL

https://github.com/user-attachments/assets/1cde5e27-9f76-4860-8179-c0dcee3a3fea

Multiple teleport happened cause I had launched some pearl never loaded those area as soon as I launched pearl all the pending pearls started moving and that's what happened

I stopped video thinking that was the end of teleport just to realise a few moment later
<img width="2800" height="1260" alt="Screenshot_20260703_135310" src="https://github.com/user-attachments/assets/6f70a42e-1d44-4660-ad5e-45e82237503e" />

Probably should have waited more ;( catching it on camera would have been so coolll

This was more of luck I have no idea of how many windcharges were how to press the button on correct moment and I dont have any other pearl cannon

More testing on Pearl Cannons is required,would be grateful to anyone who can do more testing

Multiple Stasis with pearl loaading haven't been tested It may differ from device to device

All the test worked the way they were expected/intended to and are performend in a three year old world

# Known cases

If a single player has different stasis chambers active,and activated all at the exact same game tick, they get teleported to the place where last stasis got active(in case of this script)

Stasis on Chunk Border NOT RECOMMENDED !! haven't tried messing around with and won't recommend it either

Pearl Cannon should work as long as your device/server is able to keep up with the speed of loading chunks

Teleport between nether portal overworld to nether works sometimes and nether to overworld doesn't work at all.No idea why the behaciour is like this

Pearl effects are weird on bedrock like there are no sounds/particle at long teleport and sometimes sounds but no particle at certain distance(Feels much better on java).Therefore teleport would also feels kinda off weird

# Ideation

So I saw this video  https://youtu.be/TY1MEQMyQdw?si=tA9TsnAdpc-WYuz2. in OmLedu's Discord Server 

It made me realise that ender pearl stasis exists, till now I thought they didn't at all !! (I travelled around 10k blocks on my survival bds server and spend lot of time getting back home where I could have been back home whenever I wanted too)

So I started doing my own test in bds server and realised that the pearl maintain owner data as long as they are loaded area or in player spawn chunks(known discoverers thewhyaxis42,17lives and goldenhelmet) and  teleport works as long as player is on the server/world at time of teleport but failed duirng restars

And So I looked at java and there pearl stores both its entity id and owner data permanently

So to mimics this exact thing the idea of using customtag came into picture and here we are  

# Helps

Special thanks to Anoan-2 and HWC Rebel from OmLedu's Discord server who helped me understanding a bunch of stuff and correcting me and Marmalade(projectile goat) in understanding pearl cannon
<img width="668" height="396" alt="Screenshot_2026-06-22_21-56-15" src="https://github.com/user-attachments/assets/ead553c1-9123-487d-9cca-9660e9a432e0" />
<img width="1022" height="126" alt="Screenshot_2026-06-23_17-59-04" src="https://github.com/user-attachments/assets/e0852290-35a8-4cb8-9a68-b16e71067b6d" />
<img width="764" height="625" alt="Screenshot_2026-07-07_00-21-37" src="https://github.com/user-attachments/assets/014faa30-654f-4c82-a05a-bc0658620332" />

# References
Microsoft Official Bedrock Stable APIs Documentation  
https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/worldafterevents?view=minecraft-bedrock-stable
https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/entity?view=minecraft-bedrock-stable
https://learn.microsoft.com/en-us/minecraft/creator/documents/scripting/multiplayer-scripts?view=minecraft-bedrock-stable

Bedrock wiki  
https://wiki.bedrock.dev/scripting/script-server

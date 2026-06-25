/*
 * Copyright (C) 2026 Mahir
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */
import { world, system } from "@minecraft/server";

// Memory cache for live pearls
const activePearls = new Map();

//Maps a loaded pearl to its owner
function mapPearlOwner(entity) {
    try {
        for (const tag of entity.getTags()) {
            if (tag.startsWith("PearlOwner:")) {
                activePearls.set(entity.id, tag.split(":")[1]);
                return;
            }
        }
    } catch (e) {}
}

// 1. Tag the pearl on throw
world.afterEvents.entitySpawn.subscribe((event) => {
    if (event.entity.typeId === "minecraft:ender_pearl") {
        const projComp = event.entity.getComponent("minecraft:projectile");
        const thrower = projComp?.owner;
         // This Tag persists to the world save file(make it log proof)
        if (thrower && thrower.typeId === "minecraft:player") {
            event.entity.addTag(`PearlOwner:${thrower.name}`);
        }
    }
});

// 2.Look for pearls when a chunk is loaded
world.afterEvents.entityLoad.subscribe((event) => {
    if (event.entity.typeId === "minecraft:ender_pearl") {
        mapPearlOwner(event.entity);
    }
});

// 3. Process Pending Teleports on Login
world.afterEvents.playerSpawn.subscribe((event) => {
    if (event.initialSpawn) {
        const player = event.player;
        const tpDataString = world.getDynamicProperty(`OfflineTP:${player.name}`);
        
        if (tpDataString) {
            const tpData = JSON.parse(tpDataString);
            
            // 1. Teleport the player on the next tick so they don't clip or fall at spawn
            system.run(() => {
                try {
                    const dim = world.getDimension(tpData.dimension);
                    const dest = { x: tpData.x, y: tpData.y, z: tpData.z };
                    
                    // Audio at spawn location right before they vanish
                    try { player.dimension.playSound("mob.endermen.portal", player.location, { volume: 1.0, pitch: 1.0 }); } catch (e) {}
                    
                    // Performing the actual teleportation
                    player.teleport(dest, { dimension: dim });

                    // Audio at destination
                    try { player.dimension.playSound("mob.endermen.portal", player.location, { volume: 1.0, pitch: 1.0 }); } catch (e) {}
                    
                    // Clear the pending property immediately so it doesn't double-trigger
                    world.setDynamicProperty(`OfflineTP:${player.name}`, undefined);    
                } catch (e) {
                    console.warn(`Failed to process offline teleport for ${player.name}: ${e}`);
                }
            });
        }
    }
});
// 4.Teleport when collides or interacts
function handlePearlImpact(projectile, impactLocation, dimensionId) {
    let deadId = null;
    //To account for things which might break/fail teleport 
    try { 
        deadId = projectile.id; // stores the id of pearl which got destroyed
    } catch (e) { 
        console.warn("Pearl projectile was destroyed before its ID could be verified.");
    }
    if (!deadId || !activePearls.has(deadId)) return; //failed to retrieve or was a normally thrown ender pearl

    const ownerName = activePearls.get(deadId); //retrive Owner from Map
    
    if (ownerName) {
        const players = world.getPlayers({ name: ownerName });
        const dimension = world.getDimension(dimensionId);
        
        if (players.length > 0) {
            // To Maintain the teleport effect
            const player = players[0];
            system.run(() => {
                try {
                    const rot = player.getRotation(); 
                    try { player.dimension.playSound("mob.endermen.portal", player.location, { volume: 1.0, pitch: 1.0 }); } catch (e) {}
                    try {
                        dimension.playSound("mob.endermen.portal", impactLocation, { volume: 1.0, pitch: 1.0 });
                        for (let i = 0; i < 15; i++) {
                            dimension.spawnParticle("minecraft:basic_portal_particle", {
                                x: impactLocation.x + (Math.random() - 0.5),
                                y: impactLocation.y + (Math.random() * 1.8),
                                z: impactLocation.z + (Math.random() - 0.5)
                            });
                        }
                    } catch (e) {}

                    player.teleport(impactLocation, {
                        dimension: dimension,
                        rotation: rot
                    });
                } catch (e) {
                    console.warn(`Online teleportation failed for ${ownerName}: ${e}`);
                }
            });
        } else {
            // Someone/Something interacted with offline player's pearl
            // Stores the data under a key assigned to player's name
            world.setDynamicProperty(`OfflineTP:${ownerName}`, JSON.stringify({
                x: impactLocation.x,
                y: impactLocation.y,
                z: impactLocation.z,
                dimension: dimensionId
            }));
        }
        //Cleans memory cache
        activePearls.delete(deadId);
    }
}

//impact listeners for pearl hitting a block or entity
world.afterEvents.projectileHitBlock.subscribe((event) => {
    if (event.projectile.typeId === "minecraft:ender_pearl") {
        handlePearlImpact(event.projectile, event.location, event.dimension.id);
    }
});

world.afterEvents.projectileHitEntity.subscribe((event) => {
    if (event.projectile.typeId === "minecraft:ender_pearl") {
        handlePearlImpact(event.projectile, event.location, event.dimension.id);
    }
});
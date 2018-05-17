module.exports = {
    // a function to run the logic for this role
    /** @param {Creep} creep */
    run: function(creep) {
        // if creep is bringing energy to a structure but has no energy left
        if (creep.memory.working == true && creep.carry.energy == 0) {
            var time = creep.memory.ttl - creep.ticksToLive;
            console.log(creep.name + " : " + creep.memory.role + " > " + time);

            if(creep.ticksToLive < 100)
                creep.suicide();
            // switch state
            creep.memory.ttl = creep.ticksToLive;
            creep.memory.working = false;
        }
        // if creep is harvesting energy but is full
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            // switch state
            creep.memory.working = true;
        }

        // if creep is supposed to transfer energy to a structure
        if (creep.memory.working == true) {
            // find closest spawn, extension or tower which is not full
            var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                // the second argument for findClosestByPath is an object which takes
                // a property called filter which can be a function
                // we use the arrow operator to define it
                filter: (s) => (s.structureType == STRUCTURE_SPAWN
                    || s.structureType == STRUCTURE_EXTENSION
                    || s.structureType == STRUCTURE_TOWER
                    || s.structureType == STRUCTURE_LAB)
                    && s.energy < s.energyCapacity
            });

            if (structure == undefined) {
                structure = creep.room.storage;
            }

            // if we found one
            if (structure != undefined) {
                // try to transfer energy, if it is not in range
                if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    creep.moveTo(structure);
                }
            }

            if (structure == undefined && (creep.ticksToLive < 50 || creep.carry.energy%50 != 0)) {
                if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    // if not in range, move towards the controller
                    creep.moveTo(creep.room.controller);
                }
            }
        }
        // if creep is supposed to harvest energy from source
        else {
            creep.getEnergy(false, true);
        }
    }
};
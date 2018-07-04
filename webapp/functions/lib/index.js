"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
var PlayerStatuses;
(function (PlayerStatuses) {
    PlayerStatuses[PlayerStatuses["WAITING"] = 0] = "WAITING";
    PlayerStatuses[PlayerStatuses["PLAYING"] = 1] = "PLAYING";
    PlayerStatuses[PlayerStatuses["OFFLINE"] = 2] = "OFFLINE";
    PlayerStatuses[PlayerStatuses["NEW"] = 3] = "NEW";
})(PlayerStatuses || (PlayerStatuses = {}));
exports.observePlayerChanges = functions.database.ref('players/{pushId}/')
    .onUpdate((change, context) => __awaiter(this, void 0, void 0, function* () {
    const player = change.after.val();
    switch (player.status) {
        case PlayerStatuses.OFFLINE: {
            return cleanUpPlayer(player)
                .catch((reason) => {
                console.error(`Was unable to clean up the user after they left.  Details: ${reason}`);
            });
        }
        case PlayerStatuses.PLAYING: {
            break;
        }
        case PlayerStatuses.WAITING: {
            return findMatch(player)
                .then(() => {
                return change.after.ref.child('status').set(PlayerStatuses.PLAYING);
            })
                .catch((reason) => {
                console.error(`Was unable to find match for the user, might be overloaded? Details: ${reason}`);
            });
        }
    }
}));
exports.observeNewPlayers = functions.database.ref('players/{pushId}/')
    .onCreate((snapshot, context) => __awaiter(this, void 0, void 0, function* () {
    return snapshot.ref.child('status').set(PlayerStatuses.NEW).then(() => {
        return snapshot.ref.child('status').set(PlayerStatuses.WAITING);
    });
}));
function findMatch(player) {
    return __awaiter(this, void 0, void 0, function* () {
        const gameRef = admin.database().ref('games/');
        let matched = false;
        while (!matched) {
            yield gameRef.once('value').then((tables) => __awaiter(this, void 0, void 0, function* () {
                console.log("searching for matches");
                for (let i = 0; i < tables.numChildren(); i++) {
                    console.log(`searching table ${i}`);
                    const result = yield admin.database().ref(`games/table${i}/`).transaction((players) => {
                        if (players === null) {
                            return 0;
                        }
                        if (players.player1 === "") {
                            console.log("adding as player1");
                            players.player1 = player.uid;
                            matched = true;
                            return players;
                        }
                        else if (players.player2 === "") {
                            console.log("adding as player2");
                            players.player2 = player.uid;
                            matched = true;
                            return players;
                        }
                    }).catch((reason) => {
                        console.warn("transaction failed!");
                        return {
                            committed: false,
                            snapshot: undefined
                        };
                    });
                    if (result.committed === true) {
                        if (matched) {
                            break;
                        }
                    }
                }
            })).catch(() => {
                console.error("unable to get snapshot of tables!");
                matched = true;
            });
            if (matched) {
                break;
            }
            console.log("no tables open, sleeping for a little");
            yield sleep(3000);
            console.log("waking up and trying again!");
        }
        return Promise.resolve();
    });
}
function cleanUpPlayer(player) {
    // Grab the current value of what was written to the Realtime Database.
    console.log("player left!");
    const gameRef = admin.database().ref('games/');
    return gameRef.once('value').then((tables) => {
        console.log("searching through matches to see if user is there");
        tables.forEach((table) => {
            const players = table.val();
            if (players.player1 === player.uid) {
                console.log("removing from player1");
                table.ref.update({
                    player1: ""
                })
                    .catch((reason) => {
                    console.error('could not remove user');
                });
                table.child('moves').ref.remove()
                    .catch((reason) => {
                    console.warn('could not delete moves');
                });
            }
            if (players.player2 === player.uid) {
                console.log("removing from player2");
                table.ref.update({
                    player2: ""
                })
                    .catch((reason) => {
                    console.error('could not remove user');
                });
                table.child('moves').ref.remove()
                    .catch((reason) => {
                    console.warn('could not delete moves');
                });
            }
            return false;
        });
    })
        .catch((reason) => {
        console.error(`Unable to find a table for the user: ${reason}`);
        return Promise.reject(reason);
    });
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
//# sourceMappingURL=index.js.map
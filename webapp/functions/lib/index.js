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
exports.observeUsers = functions.database.ref('players/{pushId}/')
    .onCreate((snapshot, context) => __awaiter(this, void 0, void 0, function* () {
    // Grab the current value of what was written to the Realtime Database.
    console.log("found a player!");
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
                        players.player1 = snapshot.val().uid;
                        matched = true;
                        return players;
                    }
                    else if (players.player2 === "") {
                        console.log("adding as player2");
                        players.player2 = snapshot.val().uid;
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
        yield sleep(5000);
        console.log("waking up and trying again!");
    }
    const player = snapshot.val();
    console.log('Player', context.params.pushId, player);
    return Promise.resolve();
}));
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
//# sourceMappingURL=index.js.map
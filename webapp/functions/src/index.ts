import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

enum PlayerStatuses {
    WAITING,
    PLAYING,
    OFFLINE,
    NEW
}

exports.observePlayerChanges = functions.database.ref('players/{pushId}/')
    .onUpdate(async (change: functions.Change<functions.database.DataSnapshot>, context: functions.EventContext) => {
        const player = change.after.val();
        switch(player.status) {
            case PlayerStatuses.OFFLINE: {
                return cleanUpPlayer(player)
                .catch((reason) => {
                    console.error(`Was unable to clean up the user after they left.  Details: ${reason}`);
                })
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
    })

exports.observeNewPlayers = functions.database.ref('players/{pushId}/')
    .onCreate(async (snapshot: functions.database.DataSnapshot, context: functions.EventContext) => {
        return snapshot.ref.child('status').set(PlayerStatuses.NEW).then(() => {
            return snapshot.ref.child('status').set(PlayerStatuses.WAITING);
        });  
    });

async function findMatch(player): Promise<void> {
    const gameRef = admin.database().ref('games/')
    let matched = false;
    while(!matched) {
        await gameRef.once('value').then(async (tables: admin.database.DataSnapshot) => {
            console.log("searching for matches")
            for (let i = 0; i < tables.numChildren(); i++) {
                console.log(`searching table ${i}`)
                const result = await admin.database().ref(`games/table${i}/`).transaction((players) => {
                    if (players === null) {
                        return 0;
                    }
                    if (players.player1 === "") {
                        console.log("adding as player1");
                        players.player1 = player.uid;
                        matched = true;
                        return players
                    } else if (players.player2 === "") {
                        console.log("adding as player2");
                        players.player2 = player.uid;
                        matched = true;
                        return players
                    }
                }).catch((reason) => {
                    console.warn("transaction failed!");
                    return {
                        committed: false,
                        snapshot: undefined
                    }
                })
                if (result.committed === true) {
                    if (matched) {
                        break;
                    }
                }
            }
        }).catch(() => {
            console.error("unable to get snapshot of tables!");
            matched = true;
        })
        if (matched) {
            break;
        }
        console.log("no tables open, sleeping for a little");
        await sleep(3000);
        console.log("waking up and trying again!")
    }
    return Promise.resolve();
}

function cleanUpPlayer(player): Promise<void> {
    // Grab the current value of what was written to the Realtime Database.
    console.log("player left!")
    const gameRef = admin.database().ref('games/')
    return gameRef.once('value').then((tables: admin.database.DataSnapshot) => {
        console.log("searching through matches to see if user is there")
        tables.forEach((table: admin.database.DataSnapshot): boolean => {
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
        })
    })
    .catch((reason) => {
        console.error(`Unable to find a table for the user: ${reason}`);
        return Promise.reject(reason);
    })
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

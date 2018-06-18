import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

exports.observeNewPlayers = functions.database.ref('players/{pushId}/')
    .onCreate(async (snapshot, context) => {
        // Grab the current value of what was written to the Realtime Database.
        console.log("found a player!")
        const gameRef = admin.database().ref('games/')
        let matched = false;
        while(!matched) {
            console.log("waking up and trying again!")
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
                            players.player1 = snapshot.val().uid;
                            matched = true;
                            return players
                        } else if (players.player2 === "") {
                            console.log("adding as player2");
                            players.player2 = snapshot.val().uid;
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
        }
        const player = snapshot.val();
        console.log('Player', context.params.pushId, player);
        return Promise.resolve();
    });

exports.observeLeavingPlayers = functions.database.ref('players/{pushId}/')
    .onDelete((snapshot: admin.database.DataSnapshot, context: functions.EventContext) => {
        // Grab the current value of what was written to the Realtime Database.
        console.log("player left!")
        const gameRef = admin.database().ref('games/')
        gameRef.once('value').then((tables: admin.database.DataSnapshot) => {
          console.log("searching through matches to see if user is there")
          tables.forEach((table: admin.database.DataSnapshot): boolean => {
            const players = table.val();
            if (players.player1 === context.auth.uid) {
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
            if (players.player2 === context.auth.uid) {
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
        }).catch((reason) => {
          console.error("Could not get the list of tables!");
        })
        return Promise.resolve();
    });

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

import * as firebase from 'firebase';
import { LogManager, BindingEngine, inject } from 'aurelia-framework';
import { Board } from '../board/board';
import { States } from '../tile/tile';

const logger = LogManager.getLogger('online');

enum PlayerStatuses {
    WAITING,
    PLAYING,
    OFFLINE
}

@inject(BindingEngine)
/**
 * A class for handling online Multiplyer games
 * @class
 */
export class Online {
    /** The game board being used */
    public board: Board;
    /** The display status to show the user playing the game */
    public status: string;
    /** The firebase application */
    private app: firebase.app.App;
    /** A reference to the user stored in the firebase database */
    private userRef: firebase.database.Reference;
    /** A reference to the table that the user is assigned to */
    private tableRef: firebase.database.Reference;
    /** The id of the current user */
    private userId: string;
    /** The aurelia binding engine */
    private bindingEngine: BindingEngine;
    /** A reference to the board dom object */
    private boardUi: HTMLElement;
    /** The class for enabling or disabling the UI */
    private disableClass = 'is-disabled';

    /**
     * The constructor for online multiplayer games
     * @constructor
     * @param {BindingEngine} beng the aurelia binding engine
     */
    public constructor(beng: BindingEngine) {
        this.bindingEngine = beng;
    }

    /**
     * The aurelia activate method, configures the firebase application, initializes it, and
     * signs in an anonymous user.
     * @returns {Promise<void>} the promise from setting the persistence and logging in
     */
    public activate(): Promise<void> {
        const config = {
            apiKey: "AIzaSyAY539UWapvbIRNTSs_57NBCllvTYK0zKc",
            authDomain: "supa-kyapucha-gemu.firebaseapp.com",
            databaseURL: "https://supa-kyapucha-gemu.firebaseio.com",
            projectId: "supa-kyapucha-gemu",
            storageBucket: "supa-kyapucha-gemu.appspot.com",
            messagingSenderId: "37300630730"
        };
        this.app = firebase.initializeApp(config);
        return firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION).then(() => {
            return firebase.auth().signInAnonymously();
        });
    }

    /**
     * The aurelia deactivate method, deletes the application before the page deactivates
     */
    public deactivate() {
        this.app.delete();
    }

    /**
     * The aurelia attached method, disables the board, gathers user info and then starts
     * the multi player game setup.
     */
    public attached() {
        this.disable();
        this.userRef = firebase.database().ref('players/');
        this.userId = firebase.auth().currentUser.uid;
        this.setupMultiPlayerGame();
    }

    /**
     * Sets up the multi player game.  This adds the user to the
     * list of players.  The server will then find an empty table
     * spot for the player and assign the user id to the table.  
     * While that is happening this method will observe table
     * changes with the wait for table method.
     */
    private setupMultiPlayerGame() {
        this.userRef.child(this.userId).set({
            uid: this.userId,
            status: PlayerStatuses.WAITING,
            rank: 0
        });
        this.userRef.child(this.userId).onDisconnect().set({
            uid: this.userId,
            status: PlayerStatuses.OFFLINE,
            rank: 0
        });
        this.status = `User: ${this.userId}, waiting for match...`;
        firebase.database().ref('games/').on('child_changed', this.waitForTable);
    }

    /**
     * Kicks off a multiplayer game, waits for both server moves to be added
     * and local moves to be added.  Local moves are handled by the handleMultiPlayerTurn handler
     * and server moves are handled by placing the move on the board.
     */
    private playMultiPlayerGame() {
        this.status += 'match has begun!';
        this.tableRef.child('moves').ref.on('child_added', (move) => {
            logger.debug(`move: ${move.val().x} ${move.val().y}`);
            const x = move.val().x;
            const y = move.val().y;
            this.board.place(x, y);
        });
        this.bindingEngine.propertyObserver(this.board, 'emptyTiles').subscribe(this.handleMultiPlayerTurn);
        /** Kicks off handle multiplayer turn one time to start the back and forth gameplay */
        this.handleMultiPlayerTurn(undefined, undefined);
    }

    /**
     * Waits for table changes to occur, when one does then
     * it checks if the user is player 1 or 2 at the table.
     * If the user is player 1 or player 2 then it will wait for the table
     * to have two players and then start the game.  If the user is
     * not player 1 or 2 then it will ignore the change.
     */
    private waitForTable = (table: firebase.database.DataSnapshot) => {
        if (table.val().player1 === this.userId) {
            this.tableRef = table.ref;
            logger.debug("matched as player 1");
            this.status = 'You are player 1... awaiting game to start...';
            this.board.setTurn(States.PLAYER1);
            if (table.val().player2 !== "") {
                firebase.database().ref('games/').off('child_changed');
                this.playMultiPlayerGame();
            }
        } else if (table.val().player2 === this.userId) {
            this.tableRef = table.ref;
            logger.debug("matched as player 2");
            this.status = 'You are player 2... awaiting game to start...';
            this.board.setTurn(States.PLAYER2);
            if (table.val().player1 !== "") {
                firebase.database().ref('games/').off('child_changed');
                this.playMultiPlayerGame();
            }
        }
    }

    /**
     * Handles online multiplayer turns by watching the board for empty
     * tile changes and then enabling/disabling the board and pushing moves
     * to the server.
     */
    private handleMultiPlayerTurn = (newValue?: any, oldValue?: any) => {
        if (newValue === 0) {
            logger.debug("GAME OVER");
            this.tableRef.child('moves').ref.off('child_added');
            this.userRef.child(this.userId).set({
                uid: this.userId,
                status: PlayerStatuses.WAITING,
                rank: 0
            });
            return;
        }
        if (this.board.getTurn() === States.PLAYER1) {
            this.status = 'It is your turn!';
            //this.tableRef.child('moves').ref.off('child_added');
            this.enable();
        } else if (this.board.getTurn() === States.PLAYER2) {
            this.status = 'It is the other players turn';
            this.disable();
            if (newValue !== oldValue) {
                this.tableRef.child('moves').ref.push({
                    x: this.board.getLastTurn().x,
                    y: this.board.getLastTurn().y
                });
            }
        }
    }

    /**
     * Disables the board
     */
    private disable() {
        if (!this.boardUi.classList.contains(this.disableClass)) {
            this.boardUi.classList.add(this.disableClass);
        }
    }

    /**
     * Enables the board
     */
    private enable() {
        if (this.boardUi.classList.contains(this.disableClass)) {
            this.boardUi.classList.remove(this.disableClass);
        }
    }
}

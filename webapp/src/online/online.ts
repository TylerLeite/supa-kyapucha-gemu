import * as firebase from 'firebase';
import { LogManager, BindingEngine, inject } from 'aurelia-framework';
import { Board } from '../board/board';
import { States } from '../tile/tile';

const logger = LogManager.getLogger('online');

@inject(BindingEngine)
export class Online {
    public board: Board;
    public status: string;
    private userRef: firebase.database.Reference;
    private gameRef: firebase.database.Reference;
    private tableRef: firebase.database.Reference;
    private userId: string;
    private playerKey: string;
    private bindingEngine: BindingEngine;
    private boardUi: HTMLElement;
    private disableClass = 'is-disabled';
    private app: firebase.app.App;

    public constructor(beng: BindingEngine) {
        this.bindingEngine = beng;
    }

    public activate() {
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

    public deactivate() {
        this.app.delete();
    }

    public attached() {
        this.setupMultiPlayerGame();
    }

    public disable() {
        if (!this.boardUi.classList.contains(this.disableClass)) {
            this.boardUi.classList.add(this.disableClass);
        }
    }

    public enable() {
        if (this.boardUi.classList.contains(this.disableClass)) {
            this.boardUi.classList.remove(this.disableClass);
        }
    }

    private setupMultiPlayerGame() {
        this.disable();
        this.userRef = firebase.database().ref('players/');
        this.gameRef = firebase.database().ref('games/');
        this.userId = firebase.auth().currentUser.uid;
        this.playerKey = this.userRef.push({
            uid: this.userId,
            status: 'waiting',
            rank: 0
        }).key;
        this.userRef.child(this.playerKey).onDisconnect().remove();
        this.status = `User: ${this.userId}, waiting for match...`;
        this.gameRef.on('child_changed', (table) => {
            if (table.val().player1 === this.userId) {
                this.tableRef = table.ref;
                logger.debug("matched as player 1");
                this.status = 'You are player 1... ';
                this.board.setTurn(States.PLAYER1);
                if (table.val().player2 !== "") {
                this.gameRef.off('child_changed');
                this.playMultiPlayerGame();
                }
            } else if (table.val().player2 === this.userId) {
                this.tableRef = table.ref;
                logger.debug("matched as player 2");
                this.status = 'You are player 2... ';
                this.board.setTurn(States.PLAYER2);
                if (table.val().player1 !== "") {
                this.gameRef.off('child_changed');
                this.playMultiPlayerGame();
                }
            }
        });
    }

    private playMultiPlayerGame() {
        this.status += 'match has begun!';
        this.tableRef.child('moves').ref.on('child_added', (move) => {
            logger.debug(`move: ${move.val().x} ${move.val().y}`);
            const x = move.val().x;
            const y = move.val().y;
            this.board.place(x, y);
        });
        this.bindingEngine.propertyObserver(this.board, 'emptyTiles').subscribe(this.handleMultiPlayerTurn);
        this.handleMultiPlayerTurn(1, 1);
    }

    private handleMultiPlayerTurn = (newValue: any, oldValue: any) => {
        if (newValue === 0) {
            logger.debug("GAME OVER");
            this.tableRef.child('moves').ref.off('child_added');
            this.userRef.child(this.playerKey).remove();
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
}

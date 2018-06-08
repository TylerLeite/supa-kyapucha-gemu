import * as firebase from 'firebase';
import { LogManager, BindingEngine, inject } from 'aurelia-framework';
import { Board } from '../board/board';
import { States } from '../tile/tile';

const logger = LogManager.getLogger('app');

@inject(BindingEngine)
export class App {
    public board: Board;
    public status: string;
    private userRef: firebase.database.Reference;
    private gameRef: firebase.database.Reference;
    private tableRef: firebase.database.Reference;
    private userKey: string;
    private tempKey: string;
    private bindingEngine: BindingEngine;
    private boardUi: HTMLElement;
    private disableClass = 'is-disabled';

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
      firebase.initializeApp(config);
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
        firebase.auth().signInAnonymously().then(() => {
            this.userKey = firebase.auth().currentUser.uid;
            this.tempKey = this.userRef.push({
                uid: this.userKey,
                status: 'waiting',
                rank: 0
            }).key;
            this.status = `User: ${this.userKey}, waiting for match...`;
            this.gameRef.on('child_changed', (table) => {
                if (table.val().player1 === this.userKey) {
                    this.tableRef = table.ref;
                    logger.debug("matched as player 1");
                    this.status = 'You are player 1... ';
                    this.board.setTurn(States.PLAYER1);
                    if (table.val().player2 !== "") {
                    this.gameRef.off('child_changed');
                    this.playMultiPlayerGame();
                    }
                } else if (table.val().player2 === this.userKey) {
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

    public deactivate() {
        this.userRef.child(this.tempKey).remove();
    }

    private handleMultiPlayerTurn = (newValue: any, oldValue: any) => {
        if (newValue === 0) {
            logger.debug("GAME OVER");
            this.tableRef.child('moves').ref.off('child_added');
            this.userRef.child(this.tempKey).remove();
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
                    x: this.board.lastMove.x,
                    y: this.board.lastMove.y
                });
            }
        }
    }
}

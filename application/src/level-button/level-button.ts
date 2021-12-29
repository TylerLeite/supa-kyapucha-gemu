import { bindable } from 'aurelia-framework';

export class LevelButton {
    @bindable public levelName: string = "";
    @bindable public levelImage: string = "";
    public levelButtonUi: HTMLElement;
    private jelloClass: string = "jello";

    public jello() {
        this.levelButtonUi.classList.toggle(this.jelloClass);
    }
}

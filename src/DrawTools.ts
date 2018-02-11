import Control from "ol/control/control";

class DrawTools extends Control {
    // private element: HTMLDivElement;
    private panel: HTMLDivElement;
    private shownClassName: string;
    private hiddenClassName: string;

    constructor(optOptions?: olx.control.ControlOptions) {
        const options = optOptions || {};

        const element = document.createElement("div");
        if (options.element == null) {
            options.element = element;
        }

        super(options);

        this.shownClassName = "shown";
        const hiddenClassName = "ol-unselectable ol-control draw-tools";
        element.className = hiddenClassName;
        const button = document.createElement("button");
        button.setAttribute("title", "Zeichnen");
        element.appendChild(button);

        this.panel = document.createElement("div");
        this.panel.className = "panel";
        element.appendChild(this.panel);

        button.onmouseover = (ev: MouseEvent): any => {
            this.showPanel();
        };

        button.onclick = (e: MouseEvent): any => {
            let ev: any = e || window.event;
            this.showPanel();
            ev.preventDefault();
        };

        this.panel.onmouseout = (e: MouseEvent): any => {
            let ev: any = e || window.event;
            if (!this.panel.contains(ev.toElement || ev.relatedTarget)) {
                this.hidePanel();
            }
        };

        // Control.call(this, {
        //     element: element,
        //     target: options.target
        // });
    }

    private showPanel(): void {
        if (!this.element.classList.contains(this.shownClassName)) {
            this.element.classList.add(this.shownClassName);
            this.renderPanel();
        }
    }

    private hidePanel(): void {
        if (this.element.classList.contains(this.shownClassName)) {
            this.element.classList.remove(this.shownClassName);
        }
    }

    // tslint:disable-next-line:no-empty
    private renderPanel(): void {
    }
}

export { DrawTools };

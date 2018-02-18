import Control from "ol/control/control";

class DrawTools extends Control {
    private element: HTMLDivElement;
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

    private renderPanel(): void {
        // while (this.panel.firstChild) {
        //     this.panel.removeChild(this.panel.firstChild);
        // }

        // Panel-Form soll nur einmal gerendert werden
        if (this.panel.firstChild != null) {
            return;
        }

        let form = this.createDrawToolsForm();
        form.style.removeProperty("display");
        this.panel.appendChild(form);
    }

    private createDrawToolsForm(): HTMLFormElement {
        const form = document.createElement("form");
        form.setAttribute("id", "options-form");
        form.style.cssText = "display: none";
        form.autocomplete = "off";

        const radioButtons = document.createElement("div");
        radioButtons.setAttribute("id", "radioButtons");
        radioButtons.appendChild(this.createInputElement("radio", "Polygon", "Fläche zeichen"));
        radioButtons.appendChild(this.createInputElement("radio", "Linie", "Linie zeichen"));
        radioButtons.appendChild(this.createInputElement("radio", "modify", "Ändern"));
        radioButtons.appendChild(this.createInputElement("radio", "remove", "Löschen"));
        form.appendChild(radioButtons);
        return form;
    }

    private createInputElement(type: string, action: string, label?: string): HTMLElement {
        const divElem = document.createElement("div");
        divElem.className = "radio";
        const labelElem = document.createElement("label");
        const inputElem = document.createElement("input");
        inputElem.setAttribute("type", type);
        inputElem.setAttribute("name", "interaction");
        inputElem.setAttribute("value", action);
        labelElem.appendChild(inputElem);
        labelElem.innerHTML += " " + label + " ";
        divElem.appendChild(labelElem);
        return divElem;
    }
}

export { DrawTools };

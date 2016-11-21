"use strict";

import { simple_promise_fetch } from "../../util";
import { PluginDescription } from "../../plugin";
import Ace from "../../ace";

export default (<PluginDescription>{
    name: "easy-queue-dodge",
    version: "1.1.0",
    description: "Adds a button to champ select to dodge without closing the entire client.",
    disableByDefault: true,
    builtInDependencies: {
        "rcp-fe-lol-champ-select": "1.0.x"
    },
    setup() {
        this.preinit("rcp-fe-lol-champ-select", () => {
            let unregister = this.hook("ember-component", Ember => {
                unregister();
                return Mixin(Ember, this.ace);
            }, "champion-select");
        });
    }
});

const Mixin = (Ember: any, ace: Ace) => ({
    didInsertElement() {
        this._super();

        const onQuitClick = () => {
            simple_promise_fetch("/lol-login/v1/session/invoke?destination=gameService&method=quitGame", "POST", "args=%5B%5D").then(data => {
                simple_promise_fetch("/lol-lobby/v1/lobby", "DELETE");
            });
        }

        Ember.run.scheduleOnce('afterRender', this, function () {
            this.$(document).on("click", ".quit-button", onQuitClick)
        });
    },
    observeType: Ember.observer("queue.type", function () {
        Ember.run.scheduleOnce('afterRender', this, function () {
            if (this.get("queue") && this.get("queue.type") && this.get("queue.type") === "TUTORIAL_GAME") {
                this.set("showQuitButton", false);
            } else {
                this.set("showQuitButton", true);
            }
        });
    })
});
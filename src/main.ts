
/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";
import type { EmbeddedWebsite } from "@workadventure/iframe-api-typings";

console.info("Script started successfully");

let currentPopup: any = undefined;

// Waiting for the API to be ready
WA.onInit().then(async () => {
    console.info("Scripting API ready");
    console.info("Player tags: ", WA.player.tags);

    // Julia custom

    WA.room.onEnterLayer("floor").subscribe(() => {
        WA.room.hideLayer("roof");
        WA.room.hideLayer("walls-bg-front");
        WA.room.hideLayer("sign");
    });

    WA.room.onLeaveLayer("floor").subscribe(() => {
        WA.room.showLayer("roof");
        WA.room.showLayer("walls-bg-front");
        WA.room.showLayer("facade-furniture-bg");
        WA.room.showLayer("sign");
    });

    WA.room.onEnterLayer("rooms_floor").subscribe(() => {
        WA.room.hideLayer("facade-furniture-fg");
        WA.room.hideLayer("facade");
        WA.room.hideLayer("facade-furniture-bg");
    });

    WA.room.onLeaveLayer("rooms_floor").subscribe(() => {
        WA.room.showLayer("facade-furniture-fg");
        WA.room.showLayer("facade");
        WA.room.showLayer("facade-furniture-bg");
    });

    // Clock popup

    WA.room.area.onEnter("clock").subscribe(() => {
        const today = new Date();
        const time =
            today.getHours() + ":" +
            String(today.getMinutes()).padStart(2, "0");

        currentPopup = WA.ui.openPopup(
            "clockPopup",
            "It's " + time,
            []
        );
    });

    WA.room.area.onLeave("clock").subscribe(closePopup);

    // Bootstrap Scripting API Extra

    bootstrapExtra()
        .then(() => {
            console.info("Scripting API Extra ready");
        })
        .catch(e => console.error(e));

    // Artist of the Month

    try {
        const artistOfTheMonth: EmbeddedWebsite =
            await WA.room.website.get("artistOfTheMonth");

        WA.room.onEnterLayer("artistZone").subscribe(() => {
            console.log("Entering artist zone");
            artistOfTheMonth.visible = false;
        });

        WA.room.onLeaveLayer("artistZone").subscribe(() => {
            console.log("Leaving artist zone");
            artistOfTheMonth.visible = true;
        });

        console.info("Artist of the Month script ready");

    } catch (error) {
        console.error(
            "Error loading Artist of the Month website:",
            error
        );
    }

}).catch(e => console.error(e));

// Close popup function

function closePopup() {
    if (currentPopup !== undefined) {
        currentPopup.close();
        currentPopup = undefined;
    }
}

export {};

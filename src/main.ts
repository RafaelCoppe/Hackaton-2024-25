import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.log('Script started successfully');

let currentPopup: any = undefined;

// Waiting for the API to be ready
WA.onInit().then(() => {
    console.log('Scripting API ready');
    console.log('Player tags: ',WA.player.tags)

    WA.room.area.onEnter('clock').subscribe(() => {
        const today = new Date();
        const time = today.getHours() + ":" + today.getMinutes();
        currentPopup = WA.ui.openPopup("clockPopup", "It's " + time, []);
    });

    WA.room.area.onLeave('clock').subscribe(closePopup);

    WA.room.area.onEnter('timer').subscribe(() => {
        let count = 60;
        updatePopup(count);
        const timer = setInterval(() => {
            count--;
            updatePopup(count);
            if (count <= 0) {
                clearInterval(timer);
            }
        }, 1000);
    });

    WA.room.area.onLeave('timer').subscribe(closePopup);

    let noteWebsite: any;

    WA.room.onEnterLayer("visibleNote").subscribe(async () => {
        console.log("Entering visibleNote layer");

        noteWebsite = await WA.ui.website.open({
            url: "./src/note.html",
            position: {
                vertical: "top",
                horizontal: "middle",
            },
            size: {
                height: "30vh",
                width: "50vw",
            },
            margin: {
                top: "10vh",
            },
            allowApi: true,
        });

    });

    WA.room.onLeaveLayer("visibleNote").subscribe(() => {
        noteWebsite.close();
    });

    let podiumWebsite: any;

    let enterCounter = 0;

    WA.room.onEnterLayer("podium").subscribe(async () => {
        enterCounter++;
        console.log('Entered podium layer', enterCounter, 'times');
        podiumWebsite = await WA.ui.website.open({
            url: "./src/podium.html",
            position: {
                vertical: "top",
                horizontal: "middle",
            },
            size: {
                height: "100vh",
                width: "70vw",
            },
            margin: {
                top: "5vh",
            },
            allowApi: true,
        });
    })

    WA.room.onLeaveLayer("podium").subscribe(() => {
        podiumWebsite.close();
    });

    WA.room.setTiles([
        { x: 250, y: 250, tile: "test", layer: "podium" },
    ]);

    bootstrapExtra().then(() => {
        console.log('Scripting API Extra ready');
    }).catch(e => console.error(e));

}).catch(e => console.error(e));

function closePopup(){
    if (currentPopup !== undefined) {
        currentPopup.close();
        currentPopup = undefined;
    }
}

function updatePopup(count: number) {
    if (currentPopup !== undefined) {
        currentPopup.close();
    }
    if (count > 0) {
        currentPopup = WA.ui.openPopup("timerPopup", "Remaining: " + count + " seconds", []);
    } else {
        currentPopup = WA.ui.openPopup("timerPopup", "Time's up!", []);
    }
}

export {};

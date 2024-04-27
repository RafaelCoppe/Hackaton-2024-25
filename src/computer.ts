import { ITiledMapTileLayer } from "@workadventure/tiled-map-type-guard/dist/ITiledMapTileLayer";
import { getLayersMap } from "@workadventure/scripting-api-extra";
import { closePopup } from "./functions";
import { getCurrentTicket } from "./functions";

const layers = getLayersMap();

let popup: any;
let popupContent = "";

export function updateStepArea() {
  let current_ticket = getCurrentTicket();
  if (popup) {
    closePopup(popup);
  }
  if (current_ticket) {
    popupContent =
      '"' +
      current_ticket.description +
      '"' +
      "\nComposants : " +
      current_ticket.submitted_count +
      "/" +
      current_ticket.components.length;
    popup = WA.ui.openPopup("computerActionPopup", popupContent, []);
  }
}

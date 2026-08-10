const standalone = document.getElementById("root")?.hasAttribute("standalone") || false;
import { MediaContext } from "../../libs/media.js";
import { ModelObserver } from "../../libs/model.js";
import { playSound } from "../../libs/sound.js";
import { showPopover, showTooltip, hideTooltip } from "../../libs/views.js";
const media = MediaContext(standalone);
const model = ModelObserver(standalone ? 0 : "ModsListButton_HS");


const updateButton = () => {
const button = document.querySelector(".modsButton");
if (!button) return;
button.style.display = model.model.modsCount > 0 ? "block" : "none";
const isMediumScreen = media.width > 1366;
const isHighlighted = model.model.alerts;
const layout = isHighlighted
? media.scale > 1
? { width: 128, height: 128, x: 200, y: 300 }
: isMediumScreen
? { width: 64, height: 64, x: 225, y: 160 }
: { width: 48, height: 48, x: 230, y: 60 }
: media.scale > 1
? { width: 64, height: 64, x: 40, y: 230 }
: isMediumScreen
? { width: 32, height: 32, x: 55, y: 140 }
: { width: 24, height: 24, x: 60, y: 60 };
const image = button.querySelector(".modsIcon");
if (image) {
image.style.backgroundPositionX = `-${layout.x}px`;
image.style.backgroundPositionY = `-${layout.y}px`;
image.style.width = `${layout.width}px`;
image.style.height = `${layout.height}px`;
}
const buble = button.querySelector(".modsBuble");
if (buble) {
buble.style.opacity = isHighlighted ? 1 : 0;
buble.querySelector(".modsBubleValue").textContent = model.model.alerts;
}
if (standalone) {
return;
}
if (media.scale > 1 && media.scale < 2) {
const offset = media.width * media.scale < 1366 ? 30 : 15;
const padding = 6 + offset / media.scale;
button.style.marginRight = `${padding}rem`;
} else {
button.style.marginRight = "6rem";
}
};


const createButton = () => {
const button = document.createElement("div");
button.className = "modsButton";
button.addEventListener("click", () => {
model.model.onButtonClick({ standalone });
playSound("play");
hideTooltip();
showPopover(button, "ModsListPopover_HS");
});
button.addEventListener("mouseenter", () => {
playSound("highlight");
showTooltip(model.model.title, model.model.description);
});
button.addEventListener("mouseleave", () => {
hideTooltip();
});
const image = document.createElement("div");
image.className = "modsIcon";
const buble = document.createElement("div");
buble.className = "modsBuble";

const bubleWrapper = document.createElement("div");
bubleWrapper.className = "modsBubleWrapper";
buble.appendChild(bubleWrapper);

const bubleValue = document.createElement("div");
bubleValue.className = "modsBubleValue";
bubleWrapper.appendChild(bubleValue);

button.appendChild(image);
button.appendChild(buble);

return button;
};
engine.whenReady.then(() => {
media.onUpdate(() => {
updateButton();
});
media.subscribe();
model.onUpdate(() => {
updateButton();
});
model.subscribe();
if (standalone) {
const wrapper = document.querySelector(
"div.media-wrapper"
);
wrapper.appendChild(createButton());
updateButton();
return;
}
const observer = new MutationObserver(() => {
const gameMenuButton = document.querySelector(
'div[data-test-id="menu"]',
);
const footerSection = gameMenuButton?.parentNode;
if (
gameMenuButton &&
footerSection &&
!footerSection.querySelector(".modsButton")
) {
footerSection.insertBefore(createButton(), gameMenuButton);
updateButton();
}
});

observer.observe(document.body, { childList: true, subtree: true });
});

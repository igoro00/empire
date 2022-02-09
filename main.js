import { loadMap } from "./loadMap.js";
import { Person } from "./Person.js";
import { hexToUInt32, sleep } from "./utils.js";

window.canvas = document.getElementById("canvas");
const multiplier = 0.5
canvas.width = 640*multiplier;
canvas.height = 480*multiplier;
const t = document.getElementById("fps");

window.mapBuf = await loadMap(
  "map.bmp",
  canvas.width,
  canvas.height,
  0xff000000
);
var ctx = canvas.getContext("2d");

const data = ctx.createImageData(canvas.width, canvas.height);
const buf = new Uint32Array(data.data.buffer);


window.getIdxFromXY = (x, y) => {
  return y * canvas.width + x;
};
window.getXYFromIdx = (idx) => [
  idx % canvas.width,
  Math.floor(idx / canvas.width),
];

// initializing array with the same dimensions as the background
window.people = Array.from(buf).map((_) => undefined);

function draw() {
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const i = getIdxFromXY(x, y);
      if (people[i] !== undefined) {
        buf[i] = people[i].tribe;
      } else {
        buf[i] = mapBuf[i] ? 0xff00ff00 : 0xffff0000;
      }
    }
  }
  ctx.putImageData(data, 0, 0);
}
function update() {
  people.forEach((person) => {
    if (person !== undefined) {
      //dont waste Math.random()
      const choice = Math.random();
      if (choice < 0.3) {
        person.breed(
          Math.round(Math.random() * 2) - 1,
          Math.round(Math.random() * 2) - 1
        );
      } else if (choice < 0.8) {
        person.move(
          Math.round(Math.random() * 2) - 1,
          Math.round(Math.random() * 2) - 1
        );
      }
    }
  });
}

//precompute all indexes at once at the start of each frame
//so it doesnt run the same forEach for every person
function preUpdate() {
  people.forEach((person, i) => {
    if (person !== undefined) {
      person.idx = i;
    }
  });
}

let frametime = 0;

function loop() {
  var start = performance.now();
  // preUpdate();
  update();
  draw();
  frametime = performance.now() - start;

  window.requestAnimationFrame(loop);
}
const showPerf = () => {
  t.innerHTML = `
Frame time: ${frametime.toFixed(2)}ms (${(1000 / frametime).toFixed(2)}fps)
Population: ${people.filter((elem) => elem !== undefined).length}
`;
};
setInterval(showPerf, 1000);
showPerf();
function getCursorPosition(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const x = Math.round((event.clientX - rect.left) * multiplier);
  const y = Math.round((event.clientY - rect.top) * multiplier);
  return { x, y };
}
canvas.addEventListener("mousedown", function (e) {
  const cursorPos = getCursorPosition(canvas, e);
  console.log(cursorPos);
  const idx = getIdxFromXY(cursorPos.x, cursorPos.y);
  const color = hexToUInt32(document.querySelector("#newPersonColor").value)
  console.log(color.toString(16))
  people[idx] = new Person(color, idx);
});
window.requestAnimationFrame(loop);

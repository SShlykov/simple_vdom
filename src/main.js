import createElement from "./vdom/createElement.js";
import render from "./vdom/render.js";
import mount from "./vdom/mount.js";
import diff from "./vdom/diff.js";

const createVApp = (count) =>
  createElement("div", {
    attrs: {
      id: "app",
      count: count,
    },
    children: [
      String(count),
      createElement("br"),
      createElement("input"),
      createElement("div", {
        children: [
          "images",
          createElement("br"),
          ...Array.from({ length: count }, () =>
            createElement("img", {
              attrs: {
                src:
                  "https://media.giphy.com/media/2A75RyXVzzSI2bx4Gj/source.gif",
              },
            })
          ),
        ],
      }),
    ],
  });

let count = 0;
let virtualApp = createVApp(count);
const app = render(virtualApp);
let rootElement = mount(app, document.getElementById("app"));

setInterval(() => {
  count++;
  const newVirtualApp = createVApp(count);
  const patch = diff(virtualApp, newVirtualApp);
  rootElement = patch(rootElement);
  virtualApp = newVirtualApp;
}, 1000);

console.log(app);

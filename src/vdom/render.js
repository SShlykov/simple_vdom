const renderElement = ({ tagName, attrs, children }) => {
  const element = document.createElement(tagName);

  for (const [k, v] of Object.entries(attrs)) {
    element.setAttribute(k, v);
  }

  for (const child of children) {
    const _child = render(child);
    element.appendChild(_child);
  }

  return element;
};

const render = (vNode) => {
  if (typeof vNode === "string") {
    return document.createTextNode(vNode);
  }

  return renderElement(vNode);
};

export default render;

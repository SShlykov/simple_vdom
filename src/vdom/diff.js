import render from "./render.js";

const zip = (xs, ys) => {
  const zippped = [];
  for (let i = 0; i < Math.min(xs.length, ys.length); i++) {
    zippped.push([xs[i], ys[i]]);
  }
  return zippped;
};

const diffAttrs = (oldAttrs, newAttrs) => {
  const patchList = [];
  // Создает новые атрибуты
  for (const [k, v] of Object.entries(newAttrs)) {
    patchList.push((node) => {
      node.setAttribute(k, v);
      return node;
    });
  }
  // Удаляет старые атрибуты
  for (const k in oldAttrs) {
    if (!(k in newAttrs)) {
      patchList.push((node) => {
        node.removeAttribute(k, v);
        return node;
      });
    }
  }

  return (node) => {
    for (const patch of patchList) {
      patch(node);
    }
  };
};

const diffChildren = (oldChildren, newChildren) => {
  const childPatchList = [];
  for (const [oldChild, newChild] of zip(oldChildren, newChildren)) {
    childPatchList.push(diff(oldChild, newChild));
  }

  const additionalChildPatchList = [];
  for (const additionalChild of newChildren.slice(oldChildren.length)) {
    additionalChildPatchList.push((node) => {
      node.appendChild(render(additionalChild));
      return node;
    });
  }

  return (parent) => {
    for (const [patch, child] of zip(childPatchList, parent.childNodes)) {
      patch(child);
    }
    for (const patch of additionalChildPatchList) {
      patch(parent);
    }
    return parent;
  };
};

const diff = (oldNode, newNode) => {
  if (newNode === undefined) {
    return (node) => {
      node.remove();
      return undefined;
    };
  }

  if (typeof oldNode === "string" || typeof newNode === "string") {
    if (oldNode !== newNode) {
      return (node) => {
        const _newNode = render(newNode);
        node.replaceWith(_newNode);
        return _newNode;
      };
    } else {
      return (node) => undefined;
    }
  }

  if (oldNode.tagName !== newNode.tagName) {
    return (node) => {
      const _newNode = render(newNode);
      node.replaceWith(_newNode);
      return _newNode;
    };
  }

  const patchAttrs = diffAttrs(oldNode.attrs, newNode.attrs);
  const patchChildren = diffChildren(oldNode.children, newNode.children);

  return (node) => {
    patchAttrs(node);
    patchChildren(node);
    return node;
  };
};

export default diff;

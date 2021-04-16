figma.showUI(__html__, { width: 300, height: 185 });

const nodeTypes = [
  "FRAME",
  "COMPONENT",
  "INSTANCE",
  "GROUP",
  "RECTANGLE",
  "POLYGON",
  "VECTOR",
  "COMPONENT_GROUP",
];

figma.ui.onmessage = (msg) => {
  if (msg.type === "set-outer-radius-range") {
    const { selection } = figma.currentPage;
    function setRangeRadius(node) {
      figma.root.children.flatMap((pageNode) =>
        pageNode.selection.forEach((node) => {
          if (nodeTypes.includes(node.type)) {
            node.cornerRadius = Number(msg.outerRadius || 0);
            let paddingValue = Number(node.paddingTop);
            for (let innerN of node.children) {
              innerN.cornerRadius = Number(msg.outerRadius || 0) - paddingValue;
            }
          }
        })
      );
      node.onmouseup = () => {
        figma.notify(`Outer radius set to ${node.cornerRadius}!`);
      };
    }
    setRangeRadius(selection);
  }

  if (msg.type === "set-outer-radius") {
    const { selection } = figma.currentPage;
    function setOuterRadius(node) {
      for (node of selection) {
        // let outerRadius = Number(node.outerRadius);
        // figma.ui.postMessage({ cornerRadius: outerRadius });
        for (let innerN of node.children) {
          let innerRadius = Number(innerN.cornerRadius);
          let paddingValue = Number(node.paddingTop);
          if (
            node.paddingLeft === paddingValue &&
            node.paddingLeft === node.paddingBottom
          ) {
            node.cornerRadius = innerRadius + paddingValue;
            figma.notify(`Outer radius set to ${node.cornerRadius}!`);
          } else if (
            node.paddingLeft === paddingValue &&
            node.paddingLeft !== node.paddingBottom
          ) {
            node.topLeftRadius = innerRadius + paddingValue;
            node.topRightRadius = innerRadius + paddingValue;
            figma.notify(`Outer radius set to ${node.topLeftRadius}!`);
          } else if (
            node.paddingLeft !== paddingValue &&
            node.paddingLeft === node.paddingBottom
          ) {
            node.bottomLeftRadius = innerRadius + paddingValue;
            node.bottomRightRadius = innerRadius + paddingValue;
            figma.notify(`Outer radius set to ${node.bottomLeftRadius}!`);
          } else if (
            node.paddingLeft !== paddingValue ||
            node.paddingLeft !== node.paddingBottom
          ) {
            figma.notify("Padding values must be equal");
          }
        }
      }
    }
    setOuterRadius(selection);
  }

  if (msg.type === "set-inner-radius") {
    const { selection } = figma.currentPage;
    function setInnerRadius(node) {
      for (node of selection) {
        for (let innerN of node.children) {
          let outerRadius = Number(node.cornerRadius);
          let paddingValue = Number(node.paddingTop);
          if (
            node.paddingLeft === node.paddingTop ||
            node.paddingLeft === node.paddingBottom
          ) {
            innerN.cornerRadius = outerRadius - paddingValue;
            figma.notify(`Inner radius set to ${innerN.cornerRadius}!`);
          } else {
            if (
              node.paddingLeft !== node.paddingTop ||
              node.paddingLeft !== node.paddingBottom
            ) {
              figma.notify("Padding values must be equal");
            }
          }
        }
      }
    }
    setInnerRadius(selection);
  }
};

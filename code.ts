figma.showUI(__html__, { width: 300, height: 105 });

let nodeTypes = ["FRAME", "COMPONENT", "INSTANCE"];
let childNodeTypes = ["FRAME", "COMPONENT", "INSTANCE", "RECTANGLE"];

figma.ui.onmessage = (msg) => {
  if (msg.type === "set-outer-radius") {
    const { selection } = figma.currentPage;
    function setOuterRadius(node) {
      for (node of selection) {
        if (nodeTypes.includes(node.type)) {
          for (let innerN of node.children) {
            if (node.paddingLeft !== node.paddingTop) {
              figma.notify("Padding values must be equal");
            }
            if (childNodeTypes.includes(node.type)) {
              if (node.paddingLeft === node.paddingTop) {
                let innerRadius = Number(innerN.cornerRadius);
                let paddingValue = Number(node.paddingTop);
                node.cornerRadius = innerRadius + paddingValue;
                figma.notify(`Outer radius set to ${node.cornerRadius}!`);
              }
            }
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
        if (nodeTypes.includes(node.type)) {
          for (let innerN of node.children) {
            if (node.paddingLeft !== node.paddingTop) {
              figma.notify("Padding values must be equal");
            }
            if (childNodeTypes.includes(node.type)) {
              let outerRadius = Number(node.cornerRadius);
              let paddingValue = Number(node.paddingTop);
              if (
                paddingValue >= outerRadius &&
                node.paddingLeft === node.paddingTop
              ) {
                figma.notify(
                  "The padding size is too large to require a border radius on the inner element"
                );
              } else if (node.paddingLeft === node.paddingTop) {
                innerN.cornerRadius = outerRadius - paddingValue;
                figma.notify(`Inner radius set to ${innerN.cornerRadius}!`);
              }
            }
          }
        }
      }
    }
    setInnerRadius(selection);
  }
};

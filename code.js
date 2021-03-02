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
                        let innerRadius = Number(innerN.cornerRadius);
                        let paddingValue = Number(node.paddingTop);
                        if (node.paddingLeft === paddingValue &&
                            node.paddingLeft === node.paddingBottom) {
                            node.cornerRadius = innerRadius + paddingValue;
                            figma.notify(`Outer radius set to ${node.cornerRadius}!`);
                        }
                        else if (node.paddingLeft === paddingValue &&
                            node.paddingLeft !== node.paddingBottom) {
                            node.topLeftRadius = innerRadius + paddingValue;
                            node.topRightRadius = innerRadius + paddingValue;
                            figma.notify(`Outer radius set to ${node.topLeftRadius}!`);
                        }
                        else if (node.paddingLeft !== paddingValue &&
                            node.paddingLeft === node.paddingBottom) {
                            node.bottomLeftRadius = innerRadius + paddingValue;
                            node.bottomRightRadius = innerRadius + paddingValue;
                            figma.notify(`Outer radius set to ${node.bottomLeftRadius}!`);
                        }
                        else {
                            if (node.paddingLeft !== paddingValue ||
                                node.paddingLeft !== node.paddingBottom) {
                                figma.notify("Padding values must be equal");
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
                        if (childNodeTypes.includes(node.type)) {
                            let outerRadius = Number(node.cornerRadius);
                            let paddingValue = Number(node.paddingTop);
                            if (node.paddingLeft === node.paddingTop &&
                                node.paddingLeft === node.paddingBottom) {
                                innerN.cornerRadius = outerRadius - paddingValue;
                                figma.notify(`Outer radius set to ${innerN.cornerRadius}!`);
                            }
                            else if (node.paddingLeft === node.paddingTop &&
                                node.paddingLeft !== node.paddingBottom) {
                                innerN.topLeftRadius = outerRadius - paddingValue;
                                innerN.topRightRadius = outerRadius - paddingValue;
                                figma.notify(`Outer radius set to ${innerN.topLeftRadius}!`);
                            }
                            else if (node.paddingLeft !== node.paddingTop &&
                                node.paddingLeft === node.paddingBottom) {
                                innerN.bottomLeftRadius = outerRadius - paddingValue;
                                innerN.bottomRightRadius = outerRadius - paddingValue;
                                figma.notify(`Outer radius set to ${innerN.bottomLeftRadius}!`);
                            }
                            else {
                                if (node.paddingLeft !== node.paddingTop ||
                                    node.paddingLeft !== node.paddingBottom) {
                                    figma.notify("Padding values must be equal");
                                }
                            }
                        }
                    }
                }
            }
        }
        setInnerRadius(selection);
    }
};

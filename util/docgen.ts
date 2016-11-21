"use strict";
import * as fs from "fs";

const Module = require("module");
const originalLoad = Module._load;

// Mock require() because some of the modules we import
// require browser APIs, which are not present in node.
Module._load = function(path: any, parent: any) {
    // If we aren't requiring the main plugin file, return a dummy module.
    if (path.indexOf("plugins") === -1 && parent.filename.indexOf("plugins/index.ts") === -1) {
        return "module.exports = {};";
    }
    return originalLoad.apply(this, arguments);
};

import { PLUGINS } from "../src/plugins";

let doc = `# Plugins

Ace features a large set of plugins that all either change or add features. Want to suggest a new plugin? Join us in [#feature-requests](https://discord.gg/yuTBwVk) on Discord.
`;

for (const plugin of PLUGINS) {
    doc += `
## ${plugin.name} v${plugin.version} ${plugin.disableByDefault ? "(disabled by default)" : ""}

${plugin.description}
`;

    (plugin.media || []).forEach(media => {
        if (media.url) {
            doc += `[![${plugin.name} media](${media.image})](${media.url})\n`;
        } else {
            doc += `![${plugin.name} media](${media.image})\n`;
        }
    });
}

fs.writeFileSync("./PLUGINS.md", doc);
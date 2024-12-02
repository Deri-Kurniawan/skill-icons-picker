import fs from "fs";

const API_URL =
  "https://raw.githubusercontent.com/tandpfun/skill-icons/refs/heads/main";

function getIcons(text) {
  const regex = /\|\s*`([^`]+)`\s*\|.*?\<img src="\.\/icons\/([^"]+)\.svg"/g;
  const matches = [...text.matchAll(regex)];

  return matches.map((match) => ({
    iconId: match[1],
    label: match[2].replace(/-Dark/g, ""),
    src: `${match[2]}.svg`,
  }));
}

console.info("Fetching icons from", `${API_URL}/readme.md`);
fetch(`${API_URL}/readme.md`)
  .then((res) => res.text())
  .then(async (readmeText) => {
    const icons = getIcons(readmeText);

    const updatedIcons = icons;
    // const updatedIcons = await Promise.all(
    //   icons.map(async (icon) => {
    //     try {
    //       const response = await fetch(`${API_URL}/icons/${icon.src}`);
    //       if (!response.ok) {
    //         console.error(`Failed to fetch ${icon.src}`);
    //         return { ...icon, svg: null };
    //       }
    //       const svgText = await response.text();
    //       return { ...icon, svg: svgText };
    //     } catch (err) {
    //       console.error(`Error fetching ${icon.src}:`, err);
    //       return { ...icon, svg: null };
    //     }
    //   })
    // );

    fs.readFile("src/lib/const.ts", "utf8", (err, data) => {
      if (err) {
        console.error("Error reading const.ts:", err);
        return;
      }

      const iconsVarRegex = /export const ICONS = \[.*?\];/s;
      if (!iconsVarRegex.test(data)) {
        console.warn("ICONS not found in const.ts, adding it.");
        const newContent = `${data.trim()}\n\nexport const ICONS = ${JSON.stringify(
          updatedIcons,
          null,
          2
        )};\n`;
        fs.writeFileSync("src/lib/const.ts", newContent);
        console.info("Added new ICONS variable to const.ts");
        return;
      }

      const currentIconsMatch = data.match(iconsVarRegex);
      if (
        currentIconsMatch &&
        currentIconsMatch[0].includes(JSON.stringify(updatedIcons))
      ) {
        console.info("No new icons to update.");
        return;
      }

      const updatedContent = data.replace(
        iconsVarRegex,
        `export const ICONS = ${JSON.stringify(updatedIcons, null, 2).trim()};`
      );
      fs.writeFileSync("src/lib/const.ts", updatedContent);
      console.info("Updated ICONS variable in const.ts");
    });
  })
  .catch((err) => {
    console.error("Error fetching README.md:", err);
  });

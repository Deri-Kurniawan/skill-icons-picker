import { fetchSvg } from "@/app/actions";
import { useIconPicker } from "@/hooks/use-icon-picker";
import { Button } from "./ui/button";

const DEFAULT_FORMATS = ["svg", "png", "webp", "jpeg"] as const;

const IconDownloader = ({ formats = DEFAULT_FORMATS }) => {
  const { state } = useIconPicker();

  const performDownload = (url: string, fileName: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const saveAs = async (format: "svg" | "png" | "webp" | "jpeg") => {
    const srcUrl = state.generatedUrl;
    const svgText = await fetchSvg(srcUrl);
    const fileName = `skillicons_${state.theme}_${
      state.selectedIcons.length === 0
        ? "all"
        : state.selectedIcons.map((i) => i.iconId).join("-")
    }.${format}`;

    const blobSvg = new Blob([svgText], { type: "image/svg+xml" });
    const svgUrl = URL.createObjectURL(blobSvg);

    if (format === "svg") {
      performDownload(svgUrl, fileName);
    } else {
      const img = document.createElement("img");
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          if (blob) {
            const downloadUrl = URL.createObjectURL(blob);
            performDownload(downloadUrl, fileName);
          }
        }, `image/${format}`);
      };

      img.src = svgUrl;
    }
  };

  return (
    <>
      {formats.map((format) => (
        <Button
          key={format}
          onClick={() => saveAs(format)}
          className="uppercase"
        >
          .{format}
        </Button>
      ))}
    </>
  );
};

export default IconDownloader;

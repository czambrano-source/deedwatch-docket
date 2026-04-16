import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, Download } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  blobUrl: string | null;
  fileName?: string;
  title?: string;
  mimeType?: string;
}

export function PreviewDocModal({ open, onClose, blobUrl, fileName, title, mimeType }: Props) {
  if (!blobUrl) return null;
  const isPdf = (mimeType ?? "").includes("pdf");
  const isImage = (mimeType ?? "").startsWith("image/");

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-0 gap-0 flex flex-col">
        <DialogHeader className="px-5 py-3 border-b flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-base">{title ?? "Documento"}</DialogTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => window.open(blobUrl, "_blank")} className="gap-1.5">
              <ExternalLink className="w-3.5 h-3.5" /> Abrir en pestana
            </Button>
            <a href={blobUrl} download={fileName ?? "documento"}>
              <Button size="sm" variant="outline" className="gap-1.5">
                <Download className="w-3.5 h-3.5" /> Descargar
              </Button>
            </a>
          </div>
        </DialogHeader>
        <div className="flex-1 bg-muted/20 overflow-hidden">
          {isPdf ? (
            <iframe src={blobUrl} className="w-full h-full border-0" title={title ?? "PDF"} />
          ) : isImage ? (
            <div className="w-full h-full flex items-center justify-center p-4">
              <img src={blobUrl} alt={title ?? "imagen"} className="max-w-full max-h-full object-contain" />
            </div>
          ) : (
            <iframe src={blobUrl} className="w-full h-full border-0" title={title ?? "Documento"} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

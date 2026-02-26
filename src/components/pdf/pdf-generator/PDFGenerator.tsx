"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import type { ReactElement } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button/button";

export interface PDFGeneratorProps {
  document: ReactElement;
  title: string;
  buttonText: string;
}

export function PDFGenerator({
  document,
  title,
  buttonText,
}: PDFGeneratorProps) {
  const fileName = title.trim().replace(/\s+/g, "-") + ".pdf";

  return (
      <PDFDownloadLink
        document={document}
        fileName={fileName}
      >
        {({ loading, error,  }) => (
          <>
            {loading ? <Loader2 className="animate-spin" size={18} aria-hidden /> :
            <Button variant="primary" >{buttonText}</Button>
            }
            
          </>
        )}
      </PDFDownloadLink>
  );
}

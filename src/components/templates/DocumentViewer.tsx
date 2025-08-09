import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Copy, Printer, Share2, X, FileText } from 'lucide-react';
import { GeneratedDocument } from '@/types/templates';
import { useToast } from '@/hooks/use-toast';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

interface DocumentViewerProps {
    document: GeneratedDocument | null;
    isOpen: boolean;
    onClose: () => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
    document,
    isOpen,
    onClose
}) => {
    const [isDownloading, setIsDownloading] = useState(false);
    const [isCopying, setIsCopying] = useState(false);
    const { toast } = useToast();

    const handleCopyToClipboard = async () => {
        if (!document) return;

        setIsCopying(true);
        try {
            await navigator.clipboard.writeText(document.content);
            toast({
                title: "Kopyalandı!",
                description: "Belge içeriği panoya kopyalandı.",
            });
        } catch (error) {
            console.error('Copy failed:', error);
            toast({
                title: "Hata",
                description: "Kopyalama işlemi başarısız oldu.",
                variant: "destructive"
            });
        } finally {
            setIsCopying(false);
        }
    };

    // Format document content with proper styling and add legal disclaimer
    const formatDocumentContent = (content: string) => {
        const legalDisclaimer = `

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚨 YASAL UYARI:
Bu belge yalnızca genel bilgilendirme amaçlıdır ve hukuki tavsiye niteliği taşımaz.
Bu şablonun kullanımından doğabilecek her türlü sorumluluk kullanıcıya aittir.
Önemli hukuki işlemler için mutlaka kalifiye bir avukattan danışmanlık alınız.
ARTIKLO bu şablonun içeriğinden sorumlu değildir.`;

        const contentWithDisclaimer = content + legalDisclaimer;

        return contentWithDisclaimer
            .replace(/\n\n/g, '\n\n')
            .replace(/^\s*([A-ZÜÇĞIŞÖÜ][A-ZÜÇĞIŞÖÜa-züçğışöü\s]*):?\s*$/gm, '<h3>$1</h3>')
            .replace(/🚨 YASAL UYARI:/g, '<h3 style="color: #dc2626; font-weight: bold;">🚨 YASAL UYARI:</h3>')
            .replace(/━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━/g, '<hr style="border: 2px solid #dc2626; margin: 20px 0;">')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>');
    };

    const handleDownloadDocx = async () => {
        if (!document) return;

        setIsDownloading(true);
        try {
            // Parse content and create structured paragraphs
            const lines = document.content.split('\n').filter(line => line.trim() !== '');
            const paragraphs: Paragraph[] = [];

            // Add document title
            paragraphs.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: document.title,
                            bold: true,
                            size: 32,
                        }),
                    ],
                    heading: HeadingLevel.TITLE,
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 400 },
                })
            );

            // Process content lines
            lines.forEach((line) => {
                const trimmedLine = line.trim();

                if (trimmedLine === '') return;

                // Check if line is a heading (starts with capital letters and ends with colon or is all caps)
                const isHeading = /^[A-ZÜÇĞIŞÖÜ][A-ZÜÇĞIŞÖÜa-züçğışöü\s]*:?\s*$/.test(trimmedLine) ||
                    /^[A-ZÜÇĞIŞÖÜ\s]+$/.test(trimmedLine);

                if (isHeading) {
                    paragraphs.push(
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: trimmedLine.replace(':', ''),
                                    bold: true,
                                    size: 24,
                                }),
                            ],
                            heading: HeadingLevel.HEADING_2,
                            spacing: { before: 300, after: 200 },
                        })
                    );
                } else {
                    // Regular paragraph
                    paragraphs.push(
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: trimmedLine,
                                    size: 22,
                                }),
                            ],
                            spacing: { after: 120 },
                            alignment: AlignmentType.JUSTIFIED,
                        })
                    );
                }
            });

            // Add legal disclaimer
            paragraphs.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
                            size: 18,
                            color: "DC2626",
                        }),
                    ],
                    spacing: { before: 300 },
                    alignment: AlignmentType.CENTER,
                })
            );

            paragraphs.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "🚨 YASAL UYARI:",
                            size: 20,
                            bold: true,
                            color: "DC2626",
                        }),
                    ],
                    spacing: { before: 200 },
                    alignment: AlignmentType.CENTER,
                })
            );

            paragraphs.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "Bu belge yalnızca genel bilgilendirme amaçlıdır ve hukuki tavsiye niteliği taşımaz. Bu şablonun kullanımından doğabilecek her türlü sorumluluk kullanıcıya aittir. Önemli hukuki işlemler için mutlaka kalifiye bir avukattan danışmanlık alınız. ARTIKLO bu şablonun içeriğinden sorumlu değildir.",
                            size: 18,
                            color: "666666",
                        }),
                    ],
                    spacing: { before: 200, after: 300 },
                    alignment: AlignmentType.JUSTIFIED,
                })
            );

            // Add footer
            paragraphs.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `\n\nOluşturulma Tarihi: ${document.generatedAt.toLocaleDateString('tr-TR')}`,
                            size: 18,
                            italics: true,
                        }),
                        new TextRun({
                            text: `\nARTIKLO - Hukuki Belge Basitleştirme Platformu`,
                            size: 18,
                            italics: true,
                        }),
                    ],
                    spacing: { before: 400 },
                    alignment: AlignmentType.CENTER,
                })
            );

            // Create document
            const doc = new Document({
                sections: [
                    {
                        properties: {},
                        children: paragraphs,
                    },
                ],
            });

            // Generate and save
            const blob = await Packer.toBlob(doc);
            const fileName = `${document.title.replace(/[^a-zA-Z0-9çğıöşüÇĞIİÖŞÜ\s]/g, '')}.docx`;
            saveAs(blob, fileName);

            toast({
                title: "İndirildi!",
                description: "DOCX belgesi başarıyla indirildi.",
            });
        } catch (error) {
            console.error('DOCX download failed:', error);
            toast({
                title: "Hata",
                description: "DOCX indirme işlemi başarısız oldu.",
                variant: "destructive"
            });
        } finally {
            setIsDownloading(false);
        }
    };

    const handleDownloadTxt = () => {
        if (!document) return;

        try {
            // Add legal disclaimer to content
            const legalDisclaimer = `

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚨 YASAL UYARI:
Bu belge yalnızca genel bilgilendirme amaçlıdır ve hukuki tavsiye niteliği taşımaz.
Bu şablonun kullanımından doğabilecek her türlü sorumluluk kullanıcıya aittir.
Önemli hukuki işlemler için mutlaka kalifiye bir avukattan danışmanlık alınız.
ARTIKLO bu şablonun içeriğinden sorumlu değildir.`;

            const contentWithDisclaimer = document.content + legalDisclaimer;

            // Create blob with UTF-8 encoding for Turkish characters
            const blob = new Blob([contentWithDisclaimer], {
                type: 'text/plain;charset=utf-8'
            });
            const url = URL.createObjectURL(blob);

            // Create download link
            const link = window.document.createElement('a');
            link.href = url;
            link.download = `${document.title.replace(/[^a-zA-Z0-9çğıöşüÇĞIİÖŞÜ\s]/g, '')}.txt`;

            // Trigger download
            window.document.body.appendChild(link);
            link.click();
            window.document.body.removeChild(link);

            // Cleanup
            URL.revokeObjectURL(url);

            toast({
                title: "TXT İndirildi!",
                description: "Metin belgesi başarıyla indirildi.",
            });
        } catch (error) {
            console.error('TXT download failed:', error);
            toast({
                title: "Hata",
                description: "TXT indirme işlemi başarısız oldu.",
                variant: "destructive"
            });
        }
    };

    const handlePrint = () => {
        if (!document) return;

        // Create a new window for printing
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            toast({
                title: "Hata",
                description: "Yazdırma penceresi açılamadı.",
                variant: "destructive"
            });
            return;
        }

        const formattedContent = formatDocumentContent(document.content);

        const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${document.title}</title>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: 'Times New Roman', serif;
              line-height: 1.8;
              margin: 40px;
              color: #2c3e50;
              background: white;
            }
            h1 {
              text-align: center;
              margin-bottom: 40px;
              color: #1a365d;
              font-size: 24px;
              font-weight: bold;
              border-bottom: 2px solid #1a365d;
              padding-bottom: 10px;
            }
            h3 {
              color: #2d3748;
              font-size: 16px;
              font-weight: bold;
              margin: 25px 0 15px 0;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .content {
              font-size: 14px;
              text-align: justify;
              margin-bottom: 40px;
            }
            .content strong {
              font-weight: bold;
              color: #1a365d;
            }
            .content em {
              font-style: italic;
            }
            .footer {
              margin-top: 50px;
              text-align: center;
              font-size: 12px;
              color: #718096;
              border-top: 1px solid #e2e8f0;
              padding-top: 20px;
            }
            @media print {
              body {
                margin: 20px;
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
              }
              .footer { page-break-inside: avoid; }
              h1, h3 { page-break-after: avoid; }
            }
          </style>
        </head>
        <body>
          <h1>${document.title}</h1>
          <div class="content">${formattedContent}</div>
          <div class="footer">
            <strong>ARTIKLO</strong> - Hukuki Belge Basitleştirme Platformu<br>
            Oluşturulma Tarihi: ${document.generatedAt.toLocaleDateString('tr-TR')}
          </div>
        </body>
      </html>
    `;

        printWindow.document.write(printContent);
        printWindow.document.close();

        // Wait for content to load then print
        printWindow.onload = () => {
            printWindow.print();
            printWindow.close();
        };
    };

    const handleShare = async () => {
        if (!document) return;

        // Check if Web Share API is supported
        if (navigator.share) {
            try {
                await navigator.share({
                    title: document.title,
                    text: `ARTIKLO ile oluşturulmuş belge: ${document.title}`,
                    url: window.location.href
                });
            } catch (error) {
                // User cancelled or error occurred
                console.log('Share cancelled or failed:', error);
            }
        } else {
            // Fallback: copy current page URL
            try {
                await navigator.clipboard.writeText(window.location.href);
                toast({
                    title: "Bağlantı Kopyalandı!",
                    description: "Sayfa bağlantısı panoya kopyalandı.",
                });
            } catch (error) {
                toast({
                    title: "Hata",
                    description: "Paylaşım işlemi başarısız oldu.",
                    variant: "destructive"
                });
            }
        }
    };

    if (!document) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col mt-8 mb-8">
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle className="flex items-center justify-between">
                        <span>{document.title}</span>
                        <Button variant="ghost" size="sm" onClick={onClose}>
                            <X className="h-4 w-4" />
                        </Button>
                    </DialogTitle>
                </DialogHeader>

                {/* Document Content */}
                <div className="flex-1 overflow-y-auto bg-white border border-gray-200 rounded-lg p-8 my-4">
                    <div className="prose max-w-none">
                        <div
                            className="font-serif text-base leading-loose text-gray-900"
                            dangerouslySetInnerHTML={{ __html: formatDocumentContent(document.content) }}
                            style={{
                                fontFamily: 'Times New Roman, serif',
                                lineHeight: '1.8',
                                textAlign: 'justify'
                            }}
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex-shrink-0 flex justify-between items-center pt-4 border-t">
                    <div className="text-sm text-gray-500">
                        Oluşturulma: {document.generatedAt.toLocaleString('tr-TR')}
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCopyToClipboard}
                            disabled={isCopying}
                            className="flex items-center gap-2"
                        >
                            <Copy className="h-4 w-4" />
                            {isCopying ? 'Kopyalanıyor...' : 'Kopyala'}
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handlePrint}
                            className="flex items-center gap-2"
                        >
                            <Printer className="h-4 w-4" />
                            Yazdır
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleShare}
                            className="flex items-center gap-2"
                        >
                            <Share2 className="h-4 w-4" />
                            Paylaş
                        </Button>

                        <Button
                            onClick={handleDownloadDocx}
                            disabled={isDownloading}
                            size="sm"
                            className="flex items-center gap-2"
                        >
                            <Download className="h-4 w-4" />
                            {isDownloading ? 'İndiriliyor...' : 'DOCX İndir'}
                        </Button>

                        <Button
                            variant="outline"
                            onClick={handleDownloadTxt}
                            size="sm"
                            className="flex items-center gap-2"
                        >
                            <FileText className="h-4 w-4" />
                            TXT İndir
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
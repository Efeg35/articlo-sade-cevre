import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteConfirmModalProps {
    isOpen: boolean;
    isDeleting: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
    isOpen,
    isDeleting,
    onConfirm,
    onCancel
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && !isDeleting && onCancel()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Belgeyi Silmek İstiyor musunuz?</DialogTitle>
                </DialogHeader>
                <p>Bu işlem geri alınamaz. Seçili belge kalıcı olarak silinecek.</p>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onCancel}
                        disabled={isDeleting}
                    >
                        Vazgeç
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Siliniyor..." : "Evet, Sil"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
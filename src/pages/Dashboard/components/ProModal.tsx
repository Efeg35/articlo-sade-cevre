import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ProModalProps {
    isOpen: boolean;
    onClose: () => void;
    onJoinWaitlist: () => Promise<void>;
}

export const ProModal: React.FC<ProModalProps> = ({
    isOpen,
    onClose,
    onJoinWaitlist
}) => {
    const handleJoinWaitlist = async () => {
        try {
            await onJoinWaitlist();
            onClose();
        } catch (error) {
            // Error handling is done in the parent component
            console.error('Error joining waitlist:', error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Artiklo PRO Çok Yakında!</DialogTitle>
                    <DialogDescription>
                        'PRO ile Detaylı İncele' gibi gelişmiş özellikler, yakında sunulacak olan Artiklo PRO abonelerine özeldir. PRO özellikleri kullanıma sunulduğunda ilk siz haberdar olmak ve özel lansman indirimlerinden faydalanmak ister misiniz?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Kapat
                    </Button>
                    <Button onClick={handleJoinWaitlist}>
                        Evet, Beni Listeye Ekle
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
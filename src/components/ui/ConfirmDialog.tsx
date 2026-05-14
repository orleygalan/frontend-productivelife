import Modal from "./Modal";

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    loading?: boolean;
}

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, loading, }: ConfirmDialogProps) {

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <p className="text-sm text-gray-500 mb-6">{message}</p>
            <div className="flex gap-3 justify-end">
                <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                >
                    Cancelar
                </button>
                <button
                    onClick={onConfirm}
                    disabled={loading}
                    className="px-4 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 transition-colors"
                >
                    {loading ? 'Eliminando...' : 'Eliminar'}
                </button>
            </div>
        </Modal>
    )
}
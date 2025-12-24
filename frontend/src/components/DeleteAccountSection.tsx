'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/hooks/useAuth';
import { AlertTriangle } from 'lucide-react';

export function DeleteAccountSection() {
    const router = useRouter();
    const { logout } = useAuth();
    const { success, error } = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmText, setConfirmText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteAccount = async () => {
        if (confirmText !== 'DELETE') return;

        setIsDeleting(true);
        try {
            await authApi.deleteAccount();
            success('Your account has been permanently deleted');
            await logout();
            router.push('/login');
        } catch (err) {
            error('Failed to delete account. Please try again.');
            console.error('Delete account error:', err);
        } finally {
            setIsDeleting(false);
            setIsModalOpen(false);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setConfirmText('');
    };

    return (
        <>
            <div className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                    <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                            Delete Account
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Permanently remove your account and all associated data. This action cannot be undone.
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => setIsModalOpen(true)}
                        className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-900/50 dark:hover:bg-red-900/20"
                    >
                        Delete Account
                    </Button>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title="Delete Account"
            >
                <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/20">
                        <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                            <p className="font-medium text-red-800 dark:text-red-400">
                                This action is irreversible
                            </p>
                            <p className="text-red-700 dark:text-red-500 mt-1">
                                Deleting your account will permanently remove all your data, including todos and profile information.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Type <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-red-600 dark:text-red-400">DELETE</span> to confirm
                        </label>
                        <Input
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            placeholder="DELETE"
                            disabled={isDeleting}
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button
                            variant="secondary"
                            onClick={handleCloseModal}
                            disabled={isDeleting}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleDeleteAccount}
                            disabled={confirmText !== 'DELETE' || isDeleting}
                            isLoading={isDeleting}
                            className="flex-1"
                        >
                            Delete Account
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}

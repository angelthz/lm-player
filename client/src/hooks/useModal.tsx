// hooks/useModalRoot.js
import { useEffect, useState } from 'react';

export function useModalRoot(selectorID: string) {
    const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);

    useEffect(() => {
        // Check if modal-root already exists
        let root = document.getElementById(selectorID);

        if (!root) {
            // Create new root element and append to body
            root = document.createElement('div');
            root.id = selectorID;
            document.body.appendChild(root);
        }

        // Store in state for component re-renders
        setModalRoot(root);

        // Cleanup when component unmounts
        return () => {
            // Remove root if no children remain
            if (root && root.childNodes.length === 0) {
                document.body.removeChild(root);
            }
        };
    }, []);

    return modalRoot;
}
import { useEffect, useState } from "react";

/**
 * Un hook personnalisé pour surveiller l'état de la connexion réseau.
 *
 * @returns {Object} Un objet contenant une propriété `isOnline` qui indique si l'utilisateur est en ligne.
 *
 * @remarks
 * Ce hook utilise l'API `navigator.onLine` pour déterminer l'état de la connexion réseau.
 * Il met à jour l'état en écoutant les événements `load`, `online` et `offline` de la fenêtre.
 * 
 * @example
 * ```typescript
 * const { isOnline } = useNetworkStatus();
 * console.log(isOnline); // Affiche true si en ligne, false sinon
 * ```
 */
const useOnlineStatus = () => {
    const [isOnline, setOnline] = useState<boolean>(true);

    const updateNetworkStatus = () => {
        setOnline(navigator.onLine);
    };

    // Parfois, l'événement de chargement ne se déclenche pas sur certains navigateurs,
    // c'est pourquoi nous appelons manuellement updateNetworkStatus lors du montage initial
    useEffect(() => {
        updateNetworkStatus();
    }, []);

    useEffect(() => {
        window.addEventListener("load", updateNetworkStatus);
        window.addEventListener("online", updateNetworkStatus);
        window.addEventListener("offline", updateNetworkStatus);

        return () => {
            window.removeEventListener("load", updateNetworkStatus);
            window.removeEventListener("online", updateNetworkStatus);
            window.removeEventListener("offline", updateNetworkStatus);
        };
    }, [navigator.onLine]);

    return { isOnline };
};

export default useOnlineStatus;
import {useEffect} from "react";

const useClickEvent = (refs: React.RefObject<HTMLDivElement>[], actions: (() => void)[]) => {
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            refs.forEach((ref, index) => {
                if (ref.current && !ref.current.contains(event.target as Node)) {
                    actions[index]();
                }
            });
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [refs, actions]);
};

export default useClickEvent;

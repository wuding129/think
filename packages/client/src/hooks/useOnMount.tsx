import { useEffect } from "react";

export function useOnMount(fn, clear = () => {}) {
  useEffect(() => {
    fn && fn();

    return () => {
      clear && clear();
    };
  }, []);
}

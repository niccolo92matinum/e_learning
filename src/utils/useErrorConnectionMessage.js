import { useEffect, useState } from "react";
import useInterval from "./useInterval";
import log from "loglevel";

export default function useErrorConnectionMessage() {
  const [isOnline, setIsOnline] = useState(true);

  const handleOffline = () => {
    setIsOnline(false);
  };

  const fetchCheckConnectionFile = () => {
    fetch("./check_connection.txt?" + Date.now(), {
      method: "GET",
      headers: { "Content-Type": "text/html; charset=utf-" },
    })
      .then((res) => res)
      .then((data) => {
        log.debug("Connection check ✅");
      })
      .catch((err) => {
        handleOffline();
        log.error("Warning! No communication with the platform. ❌");
      });
  };

  useEffect(() => {
    fetchCheckConnectionFile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useInterval(fetchCheckConnectionFile, 30000); // effettua il check ogni 30 secondi
  return isOnline;
}

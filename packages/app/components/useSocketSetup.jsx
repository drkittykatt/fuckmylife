import { useEffect, useContext } from "react";
import socket from "../socket";
import { AccountContext } from "./AccountContext";

const useSocketSetup = () => {
  const { setUser } = useContext(AccountContext);
  useEffect(() => {
    socket.connect();
    socket.on("connect_error", () => {
      //   setUser({ loggedIn: false });
      console.log("connection error");
    });
    return () => {
      socket.off("connect_error");
    };
  }, [setUser]);
};

export default useSocketSetup;

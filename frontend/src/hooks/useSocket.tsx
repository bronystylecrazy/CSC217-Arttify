import Cookies from "js-cookie";
import { useLayoutEffect } from "react";
import { Options, useSocketIO } from "react-use-websocket";

export function onMessage<T = any>(event, cb: (data: T) => void) {
    const { lastJsonMessage } = useSocket<T>();
    useLayoutEffect(() => {
        if (lastJsonMessage) {
            console.log(lastJsonMessage);
            if ((lastJsonMessage as any).type === event) {
                cb((lastJsonMessage as any).payload);
            }
        }
    }, [lastJsonMessage]);
}


function useSocket<T = any>(options: Options = {}) {
    const socket = useSocketIO(`https://arttifysocket.devsirawit.com`, {
        share: true,
        fromSocketIO: true,
        shouldReconnect: (closeEvent) => true,
        reconnectInterval: 5000,
    });

    return { ...socket, lastJsonMessage: socket.lastJsonMessage as T };
};

export default useSocket;
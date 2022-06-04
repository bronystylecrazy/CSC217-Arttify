import React, { useEffect } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "@/styles/xterm.scss";
import { Resizable } from "re-resizable";
import ResizeObserver from "react-resize-observer";
import c from "ansi-colors";
import useSocket, { onMessage } from "@/hooks/useSocket";

let term;
const fitAddon = new FitAddon();

const XTerminal = () => {

    const prompt = () => {
        var shellprompt = "$ ";
        term.write("\r" + shellprompt);
    };

    const { sendMessage } = useSocket();

    // useEffect(() => {
    //     sendJsonMessage({
    //         type: "build.start",
    //         payload: null
    //     });
    // }, [sendJsonMessage]);

    onMessage("build.log", (message) => {
        term.write(message);
        prompt();
    });

    
    onMessage("build.err", (message) => {
        term.write(`\x1b[31m${message}\x1b[m`);
        prompt();
    });

    useEffect(() => {
        sendMessage(`42["build.start", null]`);
        term = new Terminal({
            convertEol: true,
            fontFamily: `Inconsolata`,
            fontSize: 18,
            rows: 20,
            // fontWeight: 900,
            rendererType: "canvas",

        });

        //Styling
        term.setOption("theme", {
            background: "#030508",
            // foreground: "white"
        });
        term.setOption('cursorBlink', true);
        // term.write('\x1b[31mWelcome to term.js!\x1b[m\r\n');

        // Load Fit Addon
        term.loadAddon(fitAddon);

        // Open the terminal in #terminal-container
        term.open(document.getElementById("xterm"));

        //Write text inside the terminal
        // term.write(c.magenta("I am ") + c.blue("Blue") + c.red(" and i like it"));

        // Make the terminal's size and geometry fit the size of #terminal-container
        fitAddon.fit();

        // term.onKey(key => {
        //     const char = key.domEvent.key;
        //     if (char === "Enter") {
        //         prompt();

        //     } else if (char === "Backspace") {
        //         term.write("\b \b");
        //     } else {
        //         term.write(char);
        //     }
        // });

        prompt();

        return () => {
            // term.destroy();
            // document.getElementById('terminal')!.remove();
        };
    }, []);


    return <Resizable
        // width={350}
        // height={350}
        style={{
            width: '100%',
            height: '450px'
        }}
    >
        <div id="xterm" style={{ height: "100%", width: "100%", borderRadius: '5px', overflow: 'hidden' }} />
        <ResizeObserver
            onResize={rect => {
                fitAddon.fit();
                console.log("Resized. New bounds:", rect.width, "x", rect.height);
            }}
            onPosition={rect => {
                console.log("Moved. New position:", rect.left, "x", rect.top);
            }}
        />
    </Resizable>
};

export default XTerminal;



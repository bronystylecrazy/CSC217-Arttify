import { ThemeProvider } from "@mui/material";
import { Provider } from "react-redux";
import AppRouter from "./AppRouter";
import store from "./stores";
import { darkTheme } from "./theme";

const App = () => {
    return (
        <ThemeProvider theme={darkTheme}>
            <Provider store={store}>
                <AppRouter />
            </Provider>
        </ThemeProvider>
    );
};

export default App;
import { Toaster } from "sonner";
import "./App.css";
import { AppRouter } from "./router/Router";

function App() {
  return (
    <>
      <Toaster richColors />
      <AppRouter />
    </>
  );
}

export default App;

import { NextUIProvider } from "@nextui-org/react";
import TRPCWrapper from "./shared/components/trpc";
import "@/shared/styles/global.css";
import Router from "./shared/components/router";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <NextUIProvider>
      <TRPCWrapper>
        <Router />
        <Toaster position="bottom-center" />
      </TRPCWrapper>
    </NextUIProvider>
  );
}

export default App;

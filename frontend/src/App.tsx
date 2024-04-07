import { NextUIProvider } from "@nextui-org/react";
import TRPCWrapper from "./shared/components/trpc";
import "@/shared/styles/global.css";
import Router from "./shared/components/router";

function App() {
  return (
    <NextUIProvider>
      <TRPCWrapper>
        <Router />
      </TRPCWrapper>
    </NextUIProvider>
  );
}

export default App;

import { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./routes/AppRouter";


function App() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center w-screen h-screen">
          {/* <Spinner /> */}
        </div>
      }
    >
     <BrowserRouter>
           <AppRouter />
         </BrowserRouter>
    </Suspense>
  );
}

export default App;

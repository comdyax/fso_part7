import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

//ReactDOM.createRoot(document.getElementById("root")).render(<App />);

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BlogContextProvider } from "./components/BlogContext";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <BlogContextProvider>
      <App />
    </BlogContextProvider>
  </QueryClientProvider>,
);

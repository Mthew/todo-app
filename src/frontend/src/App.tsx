import { AuthProvider } from "@/context";
import { AppRouter } from "@/routes";

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;

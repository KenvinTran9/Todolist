import App from "@/components/App.jsx";
import Header from "@/components/Header.jsx";
export default function Home() {
  return (
    <main className="main bg-white p-8 m-8 rounded-xl shadow-sm max-w-lg w-full  ">
      <Header />
      <App />
    </main>
  );
}
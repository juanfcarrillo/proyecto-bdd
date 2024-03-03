import { NavBar } from "src/components/NavBar";
import { TallerContext } from "src/context/useTallerContext";

export default function ModulesLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: { taller: string };
}>) {
  return (
    <main className="h-[100%] justify-center items-center">
      <NavBar />
      <TallerContext codTaller={params.taller}>
        {children}
      </TallerContext>
    </main>
  );
}

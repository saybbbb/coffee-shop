import type { Metadata } from "next";
import Footer from "@/components/Footer";
import MenuExperience from "@/components/menu/MenuExperience";

export const metadata: Metadata = {
  title: "The Menu",
  description:
    "Explore Nurvana Café's full menu — signature brews, chilled blends, seasonal specials and fresh pastries. Order ahead for pickup.",
};

export default function MenuPage() {
  return (
    <>
      <MenuExperience />
      <Footer />
    </>
  );
}

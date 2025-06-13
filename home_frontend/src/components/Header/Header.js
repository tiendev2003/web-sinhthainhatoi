import { useEffect, useState } from "react";
import MainHeader from "../MainHeader/MainHeader";
import TopHeader from "../TopHeader/TopHeader";
import "./Header.css";

function Header() {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className={`header-container ${isSticky ? "sticky" : ""}`}>
      <TopHeader />
      <MainHeader />
    </header>
  );
}

export default Header;

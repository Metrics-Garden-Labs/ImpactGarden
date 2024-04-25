import Image from "next/image";
import Attestbox from "../components/attestbox";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Sidebar from "./sidebar";
import ProfilePage from "./profilepage";

export default function Projects() {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">  {/* Ensure this div fills the height minus Navbar and Footer */}
          <Sidebar />
          <main className="flex-1 overflow-auto">  {/* This ensures the main content takes the rest of the horizontal space */}
            <ProfilePage />
          </main>
        </div>
        <Footer />
      </div>
    );
  }
  


//TODO: make the footer just at the bottom once you have scrolled to the botto
        //its taking too much space at the bottom of the page
import {
  OrganizationSwitcher,
  SignOutButton,
  SignedIn,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

function Topbar() {
  return (
    <nav className="topbar shadow-2xl shadow-purple-950">
      <Link href="/" className="flex items-center gap-4">
        <Image src="/assets/logo.svg" alt="logo" width={28} height={28} />
        <p className="text-heading3-bold text-light-1 max-xs:hidden">Threads</p>
      </Link>

      <div className="flex items-center gap-1">
        <div className="block">
          <SignedIn>
            <UserButton />
            {/* <div className="flex cursor-pointer">
                <Image
                  src="/assets/logout.svg"
                  alt="logout"
                  width={24}
                  height={24}
                />
              </div> */}
          </SignedIn>
        </div>

        {/* <OrganizationSwitcher 
        appearance={{
            elements: {
                organizationalSwitcherTrigger: "py-2 px-4"
            }
        }}/> */}
      </div>
    </nav>
  );
}

export default Topbar;

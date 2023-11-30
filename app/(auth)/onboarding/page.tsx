import AccountProfile from "@/components/forms/AccountProfile";
import { currentUser } from "@clerk/nextjs";

async function Page() { 
    const user = await currentUser();
    if (!user) return null; // avoid typescript warning

    const userInfo = null;

    const userData = {
        id: user.id,
        objectId: userInfo?._id,
        username: userInfo ? userInfo?.username : user.username,
        name: userInfo ? userInfo?.name : user.firstName ?? "",
        bio: userInfo ? userInfo?.bio : "",
        image: userInfo ? userInfo?.image : user.imageUrl,
      };

    return (
        <main className="mx-auto flex max-w-3xl flex-col justify-start px-16 py-20">
            <h1 className="head-text">Onboarding</h1>
            <p className="mt-3 text-base-regular text-light-2">Complete your profile now to use Threads</p>

            <section className="mt-9 bg-dark-2 shadow-2xl shadow-gray-950 p-10">
                <AccountProfile user={userData} btnTitle="Continue"/>
            </section>
        </main>
    )
}
export default Page;
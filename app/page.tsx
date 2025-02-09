import HomePage from "@/components/Pages/Home";
import { initialProfile } from "@/lib/initial-profile"

const page = async() => {
  await initialProfile();

  return <HomePage/>
}

export default page;
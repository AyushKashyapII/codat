import HomePage from "@/components/Pages/Home";
import { initialProfile } from "@/lib/initial-profile"

const page = async() => {
  const profile = initialProfile();

  if (!profile){
    return <HomePage/>
  }
  return <HomePage/>
}

export default page;
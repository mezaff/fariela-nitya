import ProfileMemberView from "@/components/views/member/Profile";
import userServices from "@/services/user";
import { User } from "@/type/user.type";
import { useSession } from "next-auth/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type Propstypes = {
  setToaster: Dispatch<SetStateAction<{}>>;
};

const ProfilePage = ({ setToaster }: Propstypes) => {
  const [profile, setProfile] = useState<User | {}>({});
  const session: any = useSession();
  useEffect(() => {
    if (session.data?.accessToken && Object.keys(profile).length === 0) {
      const getProfile = async () => {
        const { data } = await userServices.getProfile(
          session.data?.accessToken
        );
        setProfile(data.data);
      };
      getProfile();
    }
  }, [profile, session]);
  return (
    <>
      <ProfileMemberView
        profile={profile}
        setProfile={setProfile}
        session={session}
        setToaster={setToaster}
      />
    </>
  );
};

export default ProfilePage;

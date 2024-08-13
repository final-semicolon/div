import ProfileSetting from '../_components/ProfileSetting';
import DeleteAccountButton from '../_components/setting/DeleteAccountButton';

const ProfilePage = () => {
  return (
    <div className="ml-[100px] ">
      <ProfileSetting />
      <DeleteAccountButton />
    </div>
  );
};

export default ProfilePage;

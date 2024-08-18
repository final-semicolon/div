import ProfileSetting from '../_components/ProfileSetting';
import DeleteAccountButton from '../_components/setting/DeleteAccountButton';

const ProfilePage = () => {
  return (
    <div className="md:p-14">
      <ProfileSetting />
      <DeleteAccountButton />
    </div>
  );
};

export default ProfilePage;

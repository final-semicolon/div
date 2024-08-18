import ProfileSetting from '../_components/ProfileSetting';
import DeleteAccountButton from '../_components/setting/DeleteAccountButton';

const ProfilePage = () => {
  return (
    <div className="mb-3 md:p-14">
      <ProfileSetting />
      <DeleteAccountButton />
      <div className="h-2 bg-neutral-50" />
    </div>
  );
};

export default ProfilePage;

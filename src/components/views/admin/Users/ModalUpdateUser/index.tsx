import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import userServices from "@/services/user";
import { User } from "@/type/user.type";
import { useSession } from "next-auth/react";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";

type Propstypes = {
  setUsersData: Dispatch<SetStateAction<User[]>>;
  setToaster: Dispatch<SetStateAction<{}>>;
  updatedUser: User | any;
  setUpdatedUser: Dispatch<SetStateAction<{}>>;
  session: any;
};
const ModalUpdateUser = (props: Propstypes) => {
  const { updatedUser, setUpdatedUser, setUsersData, setToaster, session } =
    props;
  const [isLoading, setIsLoading] = useState(false);
  const handleUpdateUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const form: any = event.target as HTMLFormElement;
    const data = {
      role: form.role.value,
    };

    const result = await userServices.updateUser(
      updatedUser.id,
      data,
      session.data?.accessToken
    );
    if (result.status === 200) {
      form.reset();
      setIsLoading(false);
      setUpdatedUser({});
      const { data } = await userServices.getAllUsers();
      setUsersData(data.data);
      setToaster({
        variant: "success",
        message: "Update user successfully",
      });
    } else {
      setIsLoading(false);
      setToaster({
        variant: "danger",
        message: "Failed to update user",
      });
    }
  };
  return (
    <Modal onClose={() => setUpdatedUser({})}>
      <h1>Update User</h1>
      <form onSubmit={handleUpdateUser}>
        <Input
          name="fullname"
          label="Fullname"
          type="text"
          defaultValue={updatedUser.fullname}
          disabled
        />
        <Input
          name="email"
          label="Email"
          type="text"
          defaultValue={updatedUser.email}
          disabled
        />
        <Input
          name="phone"
          label="Phone"
          type="text"
          defaultValue={updatedUser.phone}
          disabled
        />
        <Select
          label="Role"
          name="role"
          defaultValue={updatedUser.role}
          options={[
            { label: "Member", value: "member" },
            { label: "Admin", value: "admin" },
          ]}
        />
        <Button type="submit">{isLoading ? "Updating..." : "Update"}</Button>
      </form>
    </Modal>
  );
};

export default ModalUpdateUser;

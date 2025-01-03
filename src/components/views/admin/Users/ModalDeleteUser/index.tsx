import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import userServices from "@/services/user";
import styles from "./ModalDeleteUser.module.scss";
import { Dispatch, SetStateAction, useState } from "react";
import { User } from "@/types/user.type";

type Proptypes = {
  setUsersData: Dispatch<SetStateAction<User[]>>;
  setToaster: Dispatch<SetStateAction<{}>>;
  deletedUser: User | any;
  setDeletedUser: Dispatch<SetStateAction<{}>>;
};

const ModalDeleteUser = (props: Proptypes) => {
  const { deletedUser, setDeletedUser, setUsersData, setToaster } = props;
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    const result = await userServices.deleteUser(deletedUser.id);
    if (result.status === 200) {
      setIsLoading(false);
      setToaster({
        variant: "success",
        message: "Delete user successfully",
      });
      setDeletedUser({});
      const { data } = await userServices.getAllUsers();
      setUsersData(data.data);
    } else {
      setIsLoading(false);
      setToaster({
        variant: "danger",
        message: "Failed to Delete user",
      });
    }
  };
  return (
    <Modal onClose={() => setDeletedUser({})}>
      <h1 className={styles.modal__title}>Are you sure?</h1>
      <Button type="button" onClick={() => handleDelete()}>
        {isLoading ? "Deleting..." : "Yes, delete"}
      </Button>
    </Modal>
  );
};

export default ModalDeleteUser;

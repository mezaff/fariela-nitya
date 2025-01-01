import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import styles from "./ModalAddProduct.module.scss";
import { Product } from "@/types/product.type";
import InputFile from "@/components/ui/InputFile";
import productServices from "@/services/product";
import { useSession } from "next-auth/react";
import { uploadFile } from "@/lib/firebase/service";
import Image from "next/image";

type Proptypes = {
  setModalAddProduct: Dispatch<SetStateAction<boolean>>;
  setToaster: Dispatch<SetStateAction<{}>>;
  setProductsData: Dispatch<SetStateAction<Product[]>>;
};

// const ModalAddProduct = (props: Proptypes) => {
//   const { setModalAddProduct, setToaster, setProductsData } = props;
//   const [isLoading, setIsLoading] = useState(false);
//   const [stockCount, setStockCount] = useState([{ size: "", qty: 0 }]);
//   const [uploadedImage, setUploadedImage] = useState<File | null>(null);
//   const session: any = useSession();

//   const handleStock = (e: any, i: number, type: string) => {
//     const newStockCount: any = [...stockCount];
//     newStockCount[i][type] = e.target.value;
//     setStockCount(newStockCount);
//   };
//   const uploadImage = (id: string, form: any) => {
//     const file = form.image.files[0];
//     const newName = "main." + file.name.split(".")[1];
//     if (file) {
//       uploadFile(
//         id,
//         file,
//         newName,
//         "products",
//         async (status: boolean, newImageURL: string) => {
//           if (status) {
//             const data = {
//               image: newImageURL,
//             };

//             const result = await productServices.updateProduct(
//               id,
//               data,
//               session.data?.accessToken
//             );

//             if (result.status === 200) {
//               setIsLoading(false);
//               setUploadedImage(null);
//               form.reset();
//               setModalAddProduct(false);
//               const { data } = await productServices.getAllProducts();
//               setProductsData(data.data);
//               setToaster({
//                 variant: "success",
//                 message: "Add product successfully",
//               });
//             } else {
//               setIsLoading(false);
//               setToaster({
//                 variant: "danger",
//                 message: "Failed to add product",
//               });
//             }
//           } else {
//             setIsLoading(false);
//             setToaster({
//               variant: "danger",
//               message: "Failed to add product",
//             });
//           }
//         }
//       );
//     }
//   };

//   const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     setIsLoading(true);
//     const form: any = event.target as HTMLFormElement;
//     const data = {
//       name: form.name.value,
//       price: form.price.value,
//       category: form.category.value,
//       status: form.status.value,
//       stock: stockCount,
//       image: "",
//     };

//     const result = await productServices.addProduct(
//       data,
//       session.data?.accessToken
//     );

//     if (result.status === 200) {
//       uploadImage(result.data.data.id, form);
//     }

//     return (
//       <Modal onClose={() => setModalAddProduct(false)}>
//         <h1>Add Product</h1>
//         <form onSubmit={handleSubmit} className={styles.form}>
//           <Input
//             label="Name"
//             name="name"
//             type="text"
//             placeholder="Insert product name"
//           />
//           <Input
//             label="Price"
//             name="price"
//             type="number"
//             placeholder="Insert product price"
//           />
//           <Select
//             label="Category"
//             name="category"
//             options={[
//               { label: "Men", value: "men" },
//               { label: "Women", value: "women" },
//             ]}
//           />
//           <Select
//             label="Status"
//             name="status"
//             options={[
//               { label: "Released", value: "true" },
//               { label: "Not Released", value: "false" },
//             ]}
//           />
//           <label htmlFor="stock">Stock</label>
//           {stockCount.map((item: { size: string; qty: number }, i: number) => (
//             <div className={styles.form__stock} key={i}>
//               <div className={styles.form__stock__item}>
//                 <Input
//                   label="Size"
//                   name="size"
//                   type="text"
//                   placeholder="Insert product size"
//                   onChange={(e) => {
//                     handleStock(e, i, "size");
//                   }}
//                 />
//               </div>
//               <div className={styles.form__stock__item}>
//                 <Input
//                   label="QTY"
//                   name="qty"
//                   type="number"
//                   placeholder="Insert product quantity"
//                   onChange={(e) => {
//                     handleStock(e, i, "qty");
//                   }}
//                 />
//               </div>
//             </div>
//           ))}
//           <Button
//             type="button"
//             className={styles.form__stock__button}
//             onClick={() => setStockCount([...stockCount, { size: "", qty: 0 }])}
//           >
//             Add New Stock
//           </Button>
//           <label htmlFor="image">Image</label>
//           <InputFile
//             name="image"
//             uploadedImage={uploadedImage}
//             setUploadedImage={setUploadedImage}
//           />
//           <Button type="submit" disabled={isLoading}>
//             {isLoading ? "Loading..." : "Add Product"}
//           </Button>
//         </form>
//       </Modal>
//     );
//   };
// };

const ModalAddProduct = (props: Proptypes) => {
  const { setModalAddProduct, setToaster, setProductsData } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [stockCount, setStockCount] = useState([{ size: "", qty: 0 }]);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const session: any = useSession();

  const handleStock = (e: any, i: number, type: string) => {
    const newStockCount: any = [...stockCount];
    newStockCount[i][type] = e.target.value;
    setStockCount(newStockCount);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const form: any = event.target as HTMLFormElement;
    const data = {
      name: form.name.value,
      price: form.price.value,
      category: form.category.value,
      status: form.status.value,
      stock: stockCount,
      image: "",
    };

    const result = await productServices.addProduct(
      data,
      session.data?.accessToken
    );

    if (result.status === 200) {
      uploadImage(result.data.data.id, form);
    }
  };

  const uploadImage = (id: string, form: any) => {
    const file = form.image.files[0];
    const newName = "main." + file.name.split(".")[1];
    if (file) {
      uploadFile(
        id,
        file,
        newName,
        "products",
        async (status: boolean, newImageURL: string) => {
          if (status) {
            const data = {
              image: newImageURL,
            };

            const result = await productServices.updateProduct(
              id,
              data,
              session.data?.accessToken
            );

            if (result.status === 200) {
              setIsLoading(false);
              setUploadedImage(null);
              form.reset();
              setModalAddProduct(false);
              const { data } = await productServices.getAllProducts();
              setProductsData(data.data);
              setToaster({
                variant: "success",
                message: "Add product successfully",
              });
            } else {
              setIsLoading(false);
              setToaster({
                variant: "danger",
                message: "Failed to add product",
              });
            }
          } else {
            setIsLoading(false);
            setToaster({
              variant: "danger",
              message: "Failed to add product",
            });
          }
        }
      );
    }
  };

  return (
    <Modal onClose={() => setModalAddProduct(false)}>
      <h1>Add Product</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          label="Name"
          name="name"
          type="text"
          placeholder="Insert product name"
        />
        <Input
          label="Price"
          name="price"
          type="number"
          placeholder="Insert product price"
        />
        <Select
          label="Category"
          name="category"
          options={[
            { label: "Men", value: "men" },
            { label: "Women", value: "women" },
          ]}
        />
        <Select
          label="Status"
          name="status"
          options={[
            { label: "Released", value: "true" },
            { label: "Not Released", value: "false" },
          ]}
        />
        <label htmlFor="image">Image</label>
        <div className={styles.form__image}>
          {uploadedImage ? (
            <Image
              width="200"
              height="200"
              src={URL.createObjectURL(uploadedImage)}
              alt="image"
              className={styles.form__image__preview}
            />
          ) : (
            <div className={styles.form__image__placeholder}>No Image</div>
          )}
          <InputFile
            name="image"
            uploadedImage={uploadedImage}
            setUploadedImage={setUploadedImage}
          />
        </div>
        <label htmlFor="stock">Stock</label>
        {stockCount.map((item: { size: string; qty: number }, i: number) => (
          <div className={styles.form__stock} key={i}>
            <div className={styles.form__stock__item}>
              <Input
                label="Size"
                name="size"
                type="text"
                placeholder="Insert product size"
                onChange={(e) => {
                  handleStock(e, i, "size");
                }}
              />
            </div>
            <div className={styles.form__stock__item}>
              <Input
                label="QTY"
                name="qty"
                type="number"
                placeholder="Insert product quantity"
                onChange={(e) => {
                  handleStock(e, i, "qty");
                }}
              />
            </div>
          </div>
        ))}
        <Button
          type="button"
          className={styles.form__stock__button}
          onClick={() => setStockCount([...stockCount, { size: "", qty: 0 }])}
        >
          Add New Stock
        </Button>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : "Add Product"}
        </Button>
      </form>
    </Modal>
  );
};

export default ModalAddProduct;

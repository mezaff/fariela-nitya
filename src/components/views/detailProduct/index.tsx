import { Product } from "@/types/product.type";
import styles from "./DetailProduct.module.scss";
import Image from "next/image";
import { convertIDR } from "@/utils/currency";
import Button from "@/components/ui/Button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useState } from "react";
import userServices from "@/services/user";

type Proptypes = {
  product: Product | any;
  cart: any;
  productId: string | string[] | undefined;
  setToaster: Dispatch<SetStateAction<{}>>;
};

const DetailProductView = (props: Proptypes) => {
  const { product, cart, productId, setToaster } = props;
  const { status }: any = useSession();
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState("");

  const handleAddToCart = async () => {
    if (selectedSize !== "") {
      let newCart = [];

      // Validasi `cart` sebagai array
      if (Array.isArray(cart)) {
        if (
          cart.filter(
            (item: any) => item.id === productId && item.size === selectedSize
          ).length > 0
        ) {
          newCart = cart.map((item: any) => {
            if (item.id === productId && item.size === selectedSize) {
              item.qty += 1;
            }
            return item;
          });
        } else {
          newCart = [
            ...cart,
            {
              id: productId,
              qty: 1,
              size: selectedSize,
            },
          ];
        }
      } else {
        // Jika `cart` tidak valid, buat array baru
        newCart = [
          {
            id: productId,
            qty: 1,
            size: selectedSize,
          },
        ];
      }

      try {
        const result = await userServices.addToCart({
          carts: newCart,
        });
        if (result.status === 200) {
          setSelectedSize("");
          setToaster({
            variant: "success",
            message: "Successfully add to cart",
          });
        }
      } catch (error) {
        setToaster({
          variant: "danger",
          message: "Failed to add to cart",
        });
      }
    }
  };

  return (
    <div className={styles.detail}>
      <div className={styles.detail__main}>
        <div className={styles.detail__main__left}>
          <Image
            src={product?.image}
            alt={product?.name}
            width={500}
            height={500}
            className={styles.detail__main__left__image}
          />
        </div>
        <div className={styles.detail__main__right}>
          <h1>{product?.name}</h1>
          <h3 className={styles.detail__main__right__category}>
            {product?.category}
          </h3>
          <h3 className={styles.detail__main__right__price}>
            {convertIDR(product?.price)}
          </h3>
          <p className={styles.detail__main__right__description}>
            {product?.description}
          </p>
          <p className={styles.detail__main__right__subtitle}>Select Size</p>
          <div className={styles.detail__main__right__size}>
            {product?.stock?.map((item: { size: string; qty: number }) => (
              <div
                className={styles.detail__main__right__size__item}
                key={item.size}
              >
                <input
                  className={styles.detail__main__right__size__item__input}
                  type="radio"
                  id={`size-${item.size}`}
                  name="size"
                  disabled={item.qty === 0}
                  onClick={() => setSelectedSize(item.size)}
                  checked={selectedSize === item.size}
                />
                <label
                  className={styles.detail__main__right__size__item__label}
                  htmlFor={`size-${item.size}`}
                >
                  {item.size}
                </label>
              </div>
            ))}
          </div>
          <Button
            className={styles.detail__main__right__add}
            type={status === "authenticated" ? "submit" : "button"}
            onClick={() => {
              status === "unauthenticated"
                ? router.push(`/auth/login?callbackUrl=${router.asPath}`)
                : handleAddToCart();
            }}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DetailProductView;

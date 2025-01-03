import { Product } from "@/types/product.type";
import styles from "./Cart.module.scss";
import Image from "next/image";
import { convertIDR } from "@/utils/currency";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import { Fragment } from "react";
import Button from "@/components/ui/Button";

type Proptypes = {
  cart: any;
  products: Product[];
};
const CartView = (props: Proptypes) => {
  const { cart, products } = props;

  const getProduct = (id: string) => {
    const product = products.find((product) => product.id === id);
    return product;
  };

  const getOptionsSize = (id: string, selected: string) => {
    const product = products.find((product) => product.id === id);
    const options = product?.stock.map(
      (stock: { size: string; qty: number }) => {
        if (stock.qty > 0) {
          return {
            label: stock.size,
            value: stock.size,
            selected: stock.size === selected,
          };
        }
      }
    );
    const data = options?.filter((option) => option !== undefined);
    return data;
  };

  const getTotalPrice = () => {
    const total = cart.reduce(
      (acc: number, item: { id: string; size: string; qty: number }) => {
        const product: any = getProduct(item.id);
        return (acc += parseInt(product?.price) * item.qty);
      },
      0
    );
    return total;
  };

  return (
    <div className={styles.cart}>
      <div className={styles.cart__main}>
        <h1 className={styles.cart__main__title}>Cart</h1>
        <div className={styles.cart__main__list}>
          {cart.map((item: { id: string; size: string; qty: number }) => (
            <Fragment key={`${item.id}-${item.size}`}>
              <div className={styles.cart__main__list__item}>
                {getProduct(item.id)?.image && (
                  <Image
                    src={`${getProduct(item.id)?.image}`}
                    width={150}
                    height={150}
                    alt={`${item.id}-${item.size}`}
                    className={styles.cart__main__list__item__image}
                  />
                )}
                <div className={styles.cart__main__list__item__info}>
                  <h4 className={styles.cart__main__list__item__info__title}>
                    {getProduct(item.id)?.name}
                  </h4>
                  <p className={styles.cart__main__list__item__info__category}>
                    {getProduct(item.id)?.category}
                  </p>
                  <div className={styles.cart__main__list__item__info__data}>
                    <label
                      className={
                        styles.cart__main__list__item__info__data__size
                      }
                    >
                      Size
                      <Select
                        name="size"
                        options={getOptionsSize(item.id, item.size)}
                      />
                    </label>
                    <label
                      className={styles.cart__main__list__item__info__data__qty}
                    >
                      Quantity
                      <Input
                        className={
                          styles.cart__main__list__item__info__data__qty__input
                        }
                        name="qty"
                        type="number"
                        defaultValue={item.qty}
                      />
                    </label>
                  </div>
                  <button
                    type="button"
                    className={styles.cart__main__list__item__info__delete}
                  >
                    <i className="bx bxs-trash" />
                  </button>
                </div>
                <h4 className={styles.cart__main__list__item__price}>
                  {convertIDR(getProduct(item.id)?.price)}
                </h4>
              </div>
              <hr className={styles.cart__main__list__divider} />
            </Fragment>
          ))}
        </div>
      </div>
      <div className={styles.cart__summary}>
        <h1 className={styles.cart__summary__title}>Summary</h1>
        <div className={styles.cart__summary__item}>
          <h4>Subtotal</h4>
          <p>{convertIDR(getTotalPrice())}</p>
        </div>
        <div className={styles.cart__summary__item}>
          <h4>Delivery</h4>
          <p>{convertIDR(0)}</p>
        </div>
        <div className={styles.cart__summary__item}>
          <h4>Tax</h4>
          <p>{convertIDR(0)}</p>
        </div>
        <hr />
        <div className={styles.cart__summary__item}>
          <h4>Total</h4>
          <p>{convertIDR(getTotalPrice())}</p>
        </div>
        <hr />
        <Button type="button" className={styles.cart__summary__button}>
          Checkout
        </Button>
      </div>
    </div>
  );
};

export default CartView;

import instance from "@/lib/axios/instance";

export const productServices = {
  getAllProducts: () => instance.get("/api/product"),
};

export default productServices;

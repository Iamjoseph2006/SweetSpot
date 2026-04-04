export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  active?: boolean;
};

export type ProductInput = {
  name: string;
  description: string;
  price: number;
  image?: string;
};

import React, { createContext, useState, useContext, ReactNode } from "react";
type Product = {
  code: string;
  product_name: string;
  ingredients_text: string;
  selected_images: {
    front: {
      small: {
        en: string;
      };
    };
  };
  allergens_tags?: string[];
};

type ScannedProductsContextType = {
  products: Product[];
  addProduct: (product: Product) => void;
};

const ScannedProductsContext = createContext<
  ScannedProductsContextType | undefined
>(undefined);

export const ScannedProductsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [products, setProducts] = useState<Product[]>([]);

  const addProduct = (newProduct: Product) => {
    setProducts((prev) => {
      const filtered = prev.filter(
        (product) => product.code !== newProduct.code
      );
      const updated = [newProduct, ...filtered];
      return updated.slice(0, 10); // Keep only the latest 10 items
    });
  };

  return (
    <ScannedProductsContext.Provider value={{ products, addProduct }}>
      {children}
    </ScannedProductsContext.Provider>
  );
};

export const useScannedProducts = () => {
  const context = useContext(ScannedProductsContext);
  if (!context)
    throw new Error(
      "useScannedProducts must be used within a ScannedProductsProvider"
    );
  return context;
};

import { useState } from 'react';
import { createProduct } from '../services/api';
import { ProductInput } from '../domain/models/product';

export function useAdminProductsViewModel() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const create = async (input: { name: string; description: string; price: string; image: string }) => {
    const payload: ProductInput = {
      name: input.name.trim(),
      description: input.description.trim(),
      price: Number(input.price),
      image: input.image.trim(),
    };

    if (!payload.name || Number.isNaN(payload.price)) {
      return { success: false as const, error: 'Completa nombre y precio válidos' };
    }

    setIsSubmitting(true);
    try {
      const response = await createProduct(payload);
      if (response.error) {
        return { success: false as const, error: response.error };
      }

      return { success: true as const, error: '' };
    } finally {
      setIsSubmitting(false);
    }
  };

  return { create, isSubmitting };
}

export type ProductDraft = {
  name: string;
  description: string;
  price: string;
  image: string;
};

export const EMPTY_PRODUCT_DRAFT: ProductDraft = {
  name: '',
  description: '',
  price: '',
  image: '',
};

export function buildProductPayload(draft: ProductDraft) {
  const payload = {
    name: draft.name.trim(),
    description: draft.description.trim(),
    price: Number(draft.price),
    image: draft.image.trim(),
  };

  if (!payload.name) {
    return { error: 'El nombre es obligatorio' } as const;
  }

  if (!Number.isFinite(payload.price) || payload.price <= 0) {
    return { error: 'El precio debe ser un número mayor a cero' } as const;
  }

  return { payload } as const;
}

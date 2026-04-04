import { buildProductPayload, EMPTY_PRODUCT_DRAFT, ProductDraft } from '../domain/product';
import {
  activateProduct,
  createProduct,
  deleteProduct,
  getProducts,
  inactivateProduct,
  Product,
  updateProduct,
} from '../services/api';

export async function loadAdminProducts() {
  const items = await getProducts();
  return items;
}

export async function createProductFromDraft(draft: ProductDraft) {
  const parsed = buildProductPayload(draft);
  if ('error' in parsed) return parsed;

  const result = await createProduct(parsed.payload);
  return result.error ? { error: result.error } : { success: true as const };
}

export async function updateProductFromDraft(productId: number, draft: ProductDraft) {
  const parsed = buildProductPayload(draft);
  if ('error' in parsed) return parsed;

  const result = await updateProduct(productId, parsed.payload);
  return result.error ? { error: result.error } : { success: true as const };
}

export async function toggleProductState(product: Product) {
  const result = product.active === false ? await activateProduct(product.id) : await inactivateProduct(product.id);
  return result.error ? { error: result.error } : { success: true as const };
}

export async function removeProduct(productId: number) {
  const result = await deleteProduct(productId);
  return result.error ? { error: result.error } : { success: true as const };
}

export function initialProductDraft() {
  return { ...EMPTY_PRODUCT_DRAFT };
}

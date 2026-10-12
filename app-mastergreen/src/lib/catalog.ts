const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR').trim();

type CatalogProduct = { name: string; category?: string | null; description?: string | null };

// Use the saved web category verbatim. Legacy cached "catalog" suggestions are ignored.
export const productCategory = (product: CatalogProduct) => product.category || '';

export const productCategoryLabel = (product: CatalogProduct) =>
  productCategory(product).trim() ? productCategory(product) : 'Sem categoria';

export function catalogCategories(products: readonly CatalogProduct[]) {
  return Array.from(new Set(products.map(productCategory)))
    .sort((left, right) => left.localeCompare(right, 'pt-BR'));
}

export function filterCatalog<T extends CatalogProduct>(
  products: readonly T[], query: string, category: string | null,
): T[] {
  const search = normalize(query);
  return products.filter(product =>
    (category === null || productCategory(product) === category) &&
    normalize(`${product.name} ${productCategoryLabel(product)} ${product.description || ''}`).includes(search),
  );
}

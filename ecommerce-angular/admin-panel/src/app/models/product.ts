export interface Product{
    _id?: string,
    title?: string,
    description?: string,
    content?: string,
    coverImage?: string,
    gallery?: Gallery[],
    price?: number,
    stock?: number,
    category?: string,
    status?: string,
    sales?: string,
    rating?: string,
    updatedAt?: string,
}

interface Gallery{
    _id?: string,
    path?: string
}
export interface Config{
    _id?: any,
    categories: Array<Category>,
    shopName?: string,
    serie?: string,
    correlation?: string,
    logo?: string
}

interface Category{
    name?: string
}
import { ViewColumn, ViewEntity } from "typeorm";

@ViewEntity({
    expression: `
    WITH prefetch AS (select 
            product.id                                                                          AS id,
            ROUND(AVG(CASE WHEN product_grade.grade IS NOT NULL THEN product_grade.grade END))  AS grade,
            COUNT(product_grade.grade)                                                          AS countGrade
        from product
                left join custom_product on custom_product.productId = product.id
                RIGHT JOIN product_grade ON product.id = product_grade.productId
        GROUP BY product.id)
    select product.id                                                               AS id,
        coalesce(custom_product.name, product.name)                                 AS name,
        coalesce(custom_product.code, product.code)                                 AS code,
        product.model                                                               AS model,
        product.gs1_country                                                         AS country,
        coalesce(custom_product.brand, product.brand)                               AS brand,
        coalesce(custom_product.categories, product.categories)                     AS categories,
        p.grade                                                                     AS grade,
        p.countGrade                                                                AS countGrade

    from product
            left join custom_product on custom_product.productId = product.id
            LEFT JOIN prefetch p on p.id = product.id;
    `
})
export class ConcreteProductView { 

    @ViewColumn()
    public id: number;

    @ViewColumn()
    public code: string;

    @ViewColumn()
    public name: string;

    @ViewColumn()
    public country: string;

    @ViewColumn()
    public brand: string;

    @ViewColumn()
    public categories: string;

    @ViewColumn()
    public grade: number;

    @ViewColumn()
    public countGrade: number;
}
import { Decimal } from "@prisma/client/runtime/library"

export type GigFormType = {
    gig_name: string,
    reviews: number,
    price: number,
    gig_desc: string,
    short_gig_desc: string,
    subcategory: number,
}

export type GigFormUserType = {
    gig_name: string,
    price: number,
    gig_desc: string,
    short_gig_desc: string,
    subcategory: number,
}

export type GigFormAdminType = {
    gig_name: string,
    reviews: number,
    price: number,
    gig_desc: string,
    rating: number,
    short_gig_desc: string,
    subcategory: number,
    removed: boolean
}
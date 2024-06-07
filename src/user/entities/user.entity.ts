export type UserType = {
    user_id: number,
    full_name: string,
    email: string,
    phone: string,
    birthday: string,
    gender: string,
    role: string,
    skill: string[],
    certification: string[],
    avatar: string,
}

export type UserQueryType = {
    pageIndex: number,
    pageSize: number,
    keyword: string
}
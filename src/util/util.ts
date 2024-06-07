import { HttpException, HttpStatus } from "@nestjs/common"

export const checkUserRole = (role: string) => {
    if (role !== "ADMIN") {
        throw new HttpException("Unauthorized.", HttpStatus.UNAUTHORIZED)
    }
}

export const formatStrToArr = (str: string) => {
    if (!str || str == "") {
        return []
    }

    return str.split(', ')
}

export const formatArrToStr = (arr: string[]) => {

    if (arr.length == 0) {
        return ""
    }

    let output = ""
    arr.map((item) => {
        output += item + ", "
    })

    return output.slice(0, -2)
}
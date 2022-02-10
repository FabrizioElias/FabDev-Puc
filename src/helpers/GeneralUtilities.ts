import { DateTime } from 'luxon'

function isObjectEmpty(obj: object): boolean {
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            return false
        }
    }

    return true
}

export function IsStringNullOrWhitespace(value: any): value is null | undefined {
    if (typeof value === 'string') {
        return IsNullOrUndefined(value) || value.length === 0 || !value.trim()
    } else {
        return IsNullOrUndefined(value)
    }
}

export function IsNullOrUndefined(value: any): value is null | undefined {
    return value === null || value === undefined
}

export function isNullOrEmpty(value: unknown): value is null | undefined {
    if (value === null) {
        return true
    }

    switch (typeof value) {
        case 'undefined':
            return true
        case 'string':
            return value === ''
        case 'number':
            return isNaN(value)
        case 'object':
            if (Array.isArray(value)) {
                return value.length < 1
            }

            if (typeof NodeList !== 'undefined' && value instanceof NodeList) {
                return value.length < 1
            }

            if (typeof HTMLCollection !== 'undefined' && value instanceof HTMLCollection) {
                return value.length < 1
            }

            return value?.constructor?.name === 'Object' && isObjectEmpty(value)
        case 'bigint':
        case 'function':
        case 'boolean':
        case 'symbol':
            return false
    }
}

export function IsString(value: any): value is string {
    return typeof value === 'string'
}

export function isValidCPF(cpf: string): boolean {
    if (typeof cpf !== 'string') return false
    cpf = cpf.replace(/[\s.-]*/gim, '')
    if (
        !cpf ||
        cpf.length != 11 ||
        cpf == '00000000000' ||
        cpf == '11111111111' ||
        cpf == '22222222222' ||
        cpf == '33333333333' ||
        cpf == '44444444444' ||
        cpf == '55555555555' ||
        cpf == '66666666666' ||
        cpf == '77777777777' ||
        cpf == '88888888888' ||
        cpf == '99999999999'
    ) {
        return false
    }
    var sum = 0
    var remainder
    for (var i = 1; i <= 9; i++) sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i)
    remainder = (sum * 10) % 11
    if (remainder == 10 || remainder == 11) remainder = 0
    if (remainder != parseInt(cpf.substring(9, 10))) return false
    sum = 0
    for (var j = 1; j <= 10; j++) sum = sum + parseInt(cpf.substring(j - 1, j)) * (12 - j)
    remainder = (sum * 10) % 11
    if (remainder == 10 || remainder == 11) remainder = 0
    if (remainder != parseInt(cpf.substring(10, 11))) return false
    return true
}

export function base64ToArrayBuffer(base64: string) {
    const binaryString = window.atob(base64) // Comment this if not using base64
    const bytes = new Uint8Array(binaryString.length)
    return bytes.map((byte, i) => binaryString.charCodeAt(i))
}

export function createAndDownloadBlobFile(body: Uint8Array, filename: string, extension = 'pdf') {
    const blob = new Blob([body])
    const fileName = `${filename}.${extension}`
    const link = document.createElement('a')
    // Browsers that support HTML5 download attribute
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', fileName)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }
}

export function replaceAndCastIfString(value: string | number, find: string | RegExp, replace: string): number {
    if (typeof value === 'string') {
        return Number(value.replace(find, replace))
    } else {
        return value
    }
}

export function replaceAndCastIfNumber(value: string | number, find: string | RegExp, replace: string): string {
    if (typeof value === 'number') {
        return value.toString().replace(find, replace)
    } else {
        return value.replace(find, replace)
    }
}

export function getDateTime(value: string | DateTime): DateTime {
    if (typeof value === 'string') {
        return DateTime.fromISO(value)
    } else {
        return value
    }
}
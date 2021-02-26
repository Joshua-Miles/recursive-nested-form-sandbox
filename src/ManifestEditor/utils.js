export function when(condition, callback) {
    if (condition) {
        return callback()
    } else {
        return null
    }
}
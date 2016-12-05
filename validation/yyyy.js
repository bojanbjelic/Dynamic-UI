module.exports = {
    validate: (input) => /^\d{4}$/.test(input) && Number(input) >= new Date().getFullYear(),
    getError: () => 'Input must be a valid year'
}

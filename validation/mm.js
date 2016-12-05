module.exports = {
    validate: (input) => /^\d{2}$/.test(input) && [Number(input)].every((n) => n > 0 && n < 13),
    getError: () => 'Input must be a valid month'
}

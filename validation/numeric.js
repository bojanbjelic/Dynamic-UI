module.exports = {
    validate: (input) => /^\d+$/.test(input),
    getError: () => 'Input must be a number'
}

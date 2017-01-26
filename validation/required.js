module.exports = {
    validate: (input) => input && input.trim() != '',
    getError: () => 'This field is required'
}
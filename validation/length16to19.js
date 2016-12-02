module.exports = {
    validate: (input) => /^.{16,19}$/.test(input),
    getError: ()=> "Input lengt must be between 16 to 19"
}

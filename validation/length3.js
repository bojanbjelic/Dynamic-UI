module.exports = {
    validate: (input) => /^.{3}$/.test(input),
    getError: ()=> "Input lengt must be between 16 to 19"
}

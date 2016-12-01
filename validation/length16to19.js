module.exports = {
    validate: function(input){
        return /^.{16,19}$/.test(input);
    }
}

checkResponseCode = (code) => {
    output = {
        code,
        message: "Error unknown"
    }
    const first_digit = parseInt(code.toString()[0]);
    switch(first_digit) {
        case 2:
          output.message = "Ok"
          break;
        case 3:
          output.message = "Ok"
          break;
        case 4:
          output.message = "Client error"
          break;
        case 5:
          output.message = "Server error"
          break;
        default:
          break;
    }
    return output;
}

module.exports.checkResponseCode = checkResponseCode;

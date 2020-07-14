export default function validateInput (type, checkingText) {
    var regexp = '';
    var checkingResult = '';
    switch (type) {
        case "email":
            regexp = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
            checkingResult = regexp.exec(checkingText);
            if (checkingResult !== null) {
                return {
                    isInputValid: true,
                    errorMessage: ''
                };
            } else {
                return {
                    isInputValid: false,
                    errorMessage: 'Email is in the form abc@xyz.ghi (.xnh)'
                };
            }
        case "password":
            regexp = /^(?!.* )(?=.*\d)(?=.*[A-Z]).{8,20}$/;
            checkingResult = regexp.exec(checkingText);
            if (checkingResult !== null) {
                return {
                    isInputValid: true,
                    errorMessage: ''
                };
            } else {
                return {
                    isInputValid: false,
                    errorMessage: 'Password must be between 8-20 characters, including numbers and letters, with at least 1 uppercase letter'
                };
            }
        case "RePassword":
            const { password } = this.state;
            if (checkingText === password.value && checkingText !== null) {
                return {
                    isInputValid: true,
                    errorMessage: ''
                };
            }
            if (checkingText !== password.value) {
                return {
                    isInputValid: false,
                    errorMessage: 'Mật khẩu không khớp'
                };
            }
            else {
                return {
                    isInputValid: false,
                    errorMessage: 'Mật khẩu không khớp'
                };
            }
        case "myfirstName":
            regexp = /^[^\s].+[^\s]$/;
            checkingResult = regexp.exec(checkingText);
            if (checkingResult !== null) {
                return {
                    isInputValid: true,
                    errorMessage: ''
                };
            } else {
                return {
                    isInputValid: false,
                    errorMessage: 'Không có kí tự trắng ở đầu và cuối'
                };
            }
        case "lastName":
            regexp = /^^[^\s].+[^\s]$/;
            checkingResult = regexp.exec(checkingText);
            if (checkingResult !== null) {
                return {
                    isInputValid: true,
                    errorMessage: ''
                };
            } else {
                return {
                    isInputValid: false,
                    errorMessage: 'Không có kí tự trắng ở đầu và cuối'
                };
            }
        case "dob":
            regexp = /^(?:(?:(?:(?:(?:[1-9]\d)(?:0[48]|[2468][048]|[13579][26])|(?:(?:[2468][048]|[13579][26])00))(\/|-|\.)(?:0?2\1(?:29)))|(?:(?:[1-9]\d{3})(\/|-|\.)(?:(?:(?:0?[13578]|1[02])\2(?:31))|(?:(?:0?[13-9]|1[0-2])\2(?:29|30))|(?:(?:0?[1-9])|(?:1[0-2]))\2(?:0?[1-9]|1\d|2[0-8])))))$/;
            checkingResult = regexp.exec(checkingText.toString());
            if (checkingResult !== null) {
                // if (true) {
                return {
                    isInputValid: true,
                    errorMessage: ''
                };
            } else {
                return {
                    isInputValid: false,
                    errorMessage: 'Không đúng định dạng'
                };
            }
        case "phoneNumber":
            regexp = /^\d{10,11}$/;
            checkingResult = regexp.exec(checkingText);
            if (checkingResult !== null) {
                return {
                    isInputValid: true,
                    errorMessage: ''
                };
            } else {
                return {
                    isInputValid: false,
                    errorMessage: 'Phone must number contains 10-11 numbers'
                };
            }
        default:
            return null;
    }
}

function isValidEmailAddress(emailAddress) {
    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return emailRegex.test(emailAddress)
}
function isValidUsername(username) {
    if (typeof username !== 'string' || username.trim() === '' || /\d/.test(username) || username.length < 2 || username.length > 25) {
        return false
    }

    return true
}
function isValidPassword(password) {
    if (typeof password !== 'string' || password.trim() === '' || /\s/.test(password)) {
        return false
    }
    var pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])[0-9a-zA-Z!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]{8,}$/;

    return pattern.test(password)
}

var form = layui.form;
form.verify({
    username: function (value, elem) {
        if (!value || value.trim().length === 0) {
            return 'Username is required.'
        }
        if (!(isValidUsername(value))) {
            return 'The length of username should between 2 and 25, and should not contains number.'
        }
    },
    email: function (value, elem) {
        if (!value || value.trim().length === 0) {
            return 'Email is required.'
        }
        if (!(isValidEmailAddress(value))) {
            return 'Email is invalid.'
        }
    },
    password: function (value, elem) {
        if (!value || value.trim().length === 0) {
            return 'password is required.'
        }
        if (!(isValidPassword(value))) {
            return ' There needs to be at least one lowercase character, at least one uppercase character, there has to be at least one number and there has to be at least one special character, and should be a minimum of 8 characters long.'
        }
    },
    password2: function (value, elem) {
        if (!value || value.trim().length === 0) {
            return 'password is required.'
        }
        let p = $('#password').val()
        console.log(p)
        if (value !== p) {
            return 'The confirm password is not the same as password.'
        }
    },
});
var index = -1
form.on('submit(register)', function (data) {
    if (index !== -1) {
        return false
    }
    index = layer.msg('Loading...', {
        icon: 16,
        shade: 0.01
    });;
    $.post({
        url: '/register',
        data: data.field,
        success: (data) => {
            if (data.success) {
                layer.msg("Register successfully.")
                window.setTimeout(() => {
                    window.location.href = '/login'
                }, 1000)
            }
        },
        error: (e) => {
            layer.msg(e?.responseJSON?.error ?? 'error');
        },
        complete: () => {
            layer.close(index);
            index = -1
        }
    })
    return false;
});
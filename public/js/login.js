

function isValidEmailAddress(emailAddress) {
    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return emailRegex.test(emailAddress)
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
            return 'Password is invalid.'
        }
    },
});
var index = -1
form.on('submit(login)', function (data) {
    if (index !== -1) {
        return false
    }
    index = layer.msg('Loading...', {
        icon: 16,
        shade: 0.01
    });;
    $.post({
        url: '/login',
        data: data.field,
        success: (data) => {
            if (data.success) {
                layer.msg("Login successfully.")
                let returnUrl = new URL(window.location.href).searchParams.get('return')
                window.setTimeout(() => {
                    window.location.href = returnUrl ?? '/'
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
var form = layui.form;
form.verify({
    title: function (value, elem) {
        if (!value || value.trim().length === 0) {
            return 'Title is required.'
        }
        if (value.length > 100) {
            return 'The maxinum length of title is 100.'
        }
    },
    director: function (value, elem) {
        if (!value || value.trim().length === 0) {
            return 'Director is required.'
        }
        if (value.length > 100) {
            return 'The maxinum length of director is 100.'
        }
    },
    studio: function (value, elem) {
        if (!value || value.trim().length === 0) {
            return 'Studio is required.'
        }
        if (value.length > 100) {
            return 'The maxinum length of studio is 100.'
        }
    },
    dateReleased: function (value, elem) {
        if (!value) {
            return 'Released date is required.'
        }
    },
    duration: function (value, elem) {
        let n = Number.parseFloat(value)
        if (isNaN(n) || n <= 60) {
            return 'Duration is required and should be greater than 60 seconds.'
        }
    },
    plot: function (value, elem) {
        if (!value || value.trim().length === 0) {
            return
        }
        if (value.length > 1000) {
            return 'The maxinum length of title is 100.'
        }
    },
});

var index = -1
form.on('submit(publish)', function (data) {
    if (index !== -1) {
        return false
    }
    index = layer.msg('Loading...', {
        icon: 16,
        shade: 0.01
    });;

    var formData = new FormData(data.elem)
    $.post({
        url: '/admin/movies',
        data: formData,
        processData: false,
        contentType: false,
        success: (data) => {
            if (data.success) {
                layer.msg("Publish successfully.")
                window.setTimeout(() => {
                    window.location.href = '/'
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
layui.use('form', () => {
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
        }
    });
    form.on('submit(publish)', function (data) {
        var values = form.val('publish');
        $.post({
            url: '/admin/movies',
            data: values,
            success: (data) => {
                console.log(data)
            },
            error: (e) => {
                layer.msg(e?.responseJSON?.error ?? 'error');
            }
        })
        return false;
    });
})
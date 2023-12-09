var rate = layui.rate;
var currentRate = 5
rate.render({
    elem: '.movie-rate',
    readonly: true,
});
rate.render({
    elem: '#review-rate',
    half: true,
    text: true,
    value: currentRate,
    setText: function (value) {
        this.span.text(value);
    },
    choose: function (value) {
        currentRate = value
    }
});
function review() {
    if (!window.isLogin) {
        window.location.href = '/login?return=' + encodeURIComponent(window.location.href)
    } else {
        $("#reviewPanel").addClass('review-overlay-show')
    }
}
function hideReview() {
    $("#reviewPanel").removeClass('review-overlay-show')
}
var index = -1
function submitReview() {
    if (index !== -1) {
        return false
    }
    let tmp = window.location.pathname.split('/')
    let movieId = tmp[tmp.length - 1]

    let review = $('#review').val()
    if (!review || review.trim().length === 0) {
        layer.msg("Say something.")
    }
    else {
        index = layer.msg('Loading...', {
            icon: 16,
            shade: 0.01
        });;
        let obj = {
            rating: currentRate,
            review: review,
            movieId: movieId
        }
        $.post({
            url: '/user/review',
            data: obj,
            success: (data) => {
                if (data.success) {
                    layer.msg("Review successfully.")
                    window.setTimeout(() => {
                        window.location.reload()
                    }, 1000);
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
    }
}
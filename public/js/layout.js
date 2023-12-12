$(() => {
    var dropdown = layui.dropdown;
    let userInfoEle = document.getElementById('userInfo_user')
    if (userInfoEle) {
        dropdown.render({
            elem: userInfoEle, // 绑定元素选择器，此处指向 class 可同时绑定多个元素
            data: [
                {
                    title: 'Home Page',
                    id: 0
                },
                {
                    title: 'My Reviews',
                    id: 2
                },
                {
                    title: 'Logout',
                    id: 1
                }],
            click: function (obj) {
                if (obj.id === 0) {
                    window.location.href = '/'
                }
                else if (obj.id === 1) {
                    window.location.href = '/logout'
                }
                else if (obj.id === 2) {
                    window.location.href = '/user/reviews'
                }
            }
        });
    }

    let adminInfoEle = document.getElementById('userInfo_admin')
    if (adminInfoEle) {
        dropdown.render({
            elem: adminInfoEle, // 绑定元素选择器，此处指向 class 可同时绑定多个元素
            data: [{
                title: 'Home Page',
                id: 0
            }, {
                title: 'My Reviews',
                id: 3
            }, {
                title: 'Add a movie',
                id: 2
            }, {
                title: 'Logout',
                id: 1
            }],
            click: function (obj) {
                if (obj.id === 0) {
                    window.location.href = '/'
                }
                else if (obj.id === 1) {
                    window.location.href = '/logout'
                } else if (obj.id === 2) {
                    window.location.href = '/admin/publish'
                } else if (obj.id === 3) {
                    window.location.href = '/user/reviews'
                }
            }
        });
    }

    if (window.location.pathname === '/' || window.location.pathname === '') {
        let url = new URL(window.location.href)
        if (url.searchParams.has('q')) {
            $('#show_search_term').val(url.searchParams.get('q'))
        }
        $('#search-container').show()
        // document.getElementById('searchShows').onsubmit = (e) => {
        //     let val = $('#show_search_term').val()
        //     if (!val || val.trim().length === 0)
        //         return false
        // }
    }
})
var dropdown = layui.dropdown;
let userInfoEle = document.getElementById('userInfo_user')
if (userInfoEle) {
    dropdown.render({
        elem: userInfoEle, // 绑定元素选择器，此处指向 class 可同时绑定多个元素
        data: [{
            title: 'Logout',
            id: 1
        }],
        click: function (obj) {
            if (obj.id === 1) {
                window.location.href = '/logout'
            }
        }
    });
}

let adminInfoEle = document.getElementById('userInfo_admin')
if (adminInfoEle) {
    dropdown.render({
        elem: adminInfoEle, // 绑定元素选择器，此处指向 class 可同时绑定多个元素
        data: [{
            title: 'Logout',
            id: 1
        }, {
            title: 'Add a movie',
            id: 2
        }],
        click: function (obj) {
            if (obj.id === 1) {
                window.location.href = '/logout'
            } else if (obj.id === 2) {
                window.location.href = '/admin/publish'
            }
        }
    });
}
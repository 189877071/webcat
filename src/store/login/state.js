export const login = {
    user: {
        value: '',
        success: false,
        text: ''
    },
    pass: {
        value: '',
        success: false,
        text: ''
    },
    verify: {
        value: '',
        success: false,
        text: ''
    },
    imgbox: 0,
    delayed: false,
    key: '',
    stop: 1
}

export const register = {
    user: {
        value: '',
        success: false,
        text: ''
    },
    email: {
        value: '',
        success: false,
        text: ''
    },
    pass: {
        value: '',
        success: false,
        text: ''
    },
    repass: {
        value: '',
        success: false,
        text: ''
    },
    verify: {
        value: '',
        success: false,
        text: ''
    },
    emailv: {
        value: '',
        success: false,
        text: ''
    },
    passbox: 0,
    imgbox: 0,
    emailvbox: 0,
    submit: '获取邮箱验证码',
    time: 20,
    stop: 1,
    jump: 3
}

export const mask = {
    android: {
        display: 'none',
        title: '下载 Android App',
        src: '/image/android.png'
    },
    ios: {
        display: 'none',
        title: '下载 ios App',
        src: '/image/ios.png'
    },
    web: {
        display: 'none',
        title: '使用手机浏览器浏览',
        src: '/image/web.png'
    },
    load: {
        display: 'none'
    },
    updatepass: {
        display: 'none',
        step: 1,
        emailSubmit: '获取验证码',
        submit: '确 认',
        email: {
            value: '',
            success: false,
            text: ''
        },
        pass: {
            value: '',
            success: false,
            text: ''
        },
        repass: {
            value: '',
            success: false,
            text: ''
        },
        verify: {
            value: '',
            success: false,
            text: ''
        }
    },
    getusers: false,
    getusersUrl: 'https://www.jsonhappy.com/getuser.html'
}


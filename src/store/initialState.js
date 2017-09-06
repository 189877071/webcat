
export let registerState = {
    username: {
        value: '',
        success: false,
        text: ''
    },
    email: {
        value: '',
        success: false,
        text: ''
    },
    password: {
        value: '',
        success: false,
        text: '',
        h: 0
    },
    rePassword: {
        value: '',
        success: false,
        text: '',
        h: 0
    },
    verify: {
        value: '',
        success: false,
        text: ''
    },
    emailVerify: {
        h: 0,
        state: 1,
        value: '',
        text: '',
        success: '',
        submit: '获取邮箱验证码',
        time: 120
    },
    login: {
        uservalue: '',
        usersuccess: false,
        usertext: '',
        passvalue: '',
        passsuccess: false,
        passtext: '',
        h: 0,
        delayed: false,
        key: ''
    }
}

export let maskState = {
    android: {
        dispatch: 'none',
        title: '下载 Android App',
        src: '/image/timg.jpg'
    },
    ios: {
        dispatch: 'none',
        title: '下载 ios App',
        src: '/image/timg.jpg'
    },
    web: {
        dispatch: 'none',
        title: '使用手机浏览器浏览',
        src: '/image/timg.jpg'
    },
    updatePassword: {
        dispatch: 'none'
    },
    load: {
        dispatch: 'none'
    }
}


export let updatepassState = {
    email: {
        value: '',
        text: '',
        success: false
    },
    newpass: {
        value: '',
        text: '',
        success: false
    },
    repass: {
        value: '',
        text: '',
        success: false
    },
    verify: {
        value: '',
        text: '',
        success: false
    },
    mask: true
}

export let usersAtate = {
    all: [],
    user: {
        age: '',
        email: '',
        ext: '',
        headphoto: '',
        id: '',
        logindate: '',
        name: '',
        synopsis: '',
        username: ''
    },
    catWindow: [],
    zindex: 0,
    listzindex: 0,
}
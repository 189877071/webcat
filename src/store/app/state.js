// 当前的层级
export const zindex = 0;

export const activeDataState = {
    active: {
        age: 0,
        email: '',
        ext: '',
        headphoto: '',
        id: 0,
        logindate: '',
        name: '',
        synopsis: '',
        username: ''
    },
    users: [],
    zindex: 0,
    audio: localStorage.getItem('audio') ? false : true
}

const biaoqing = [];

for (let i = 1; i < 25; i++) {
    biaoqing.push({ table: i > 9 ? i : '0' + i, src: `/image/biaoqing/${i}.png` });
}

export const catDataState = {
    list: [
        // {
        //     age: 0, // 年龄
        //     email: '', // 邮箱
        //     ext: '', // 性别
        //     headphoto: '', // 头像地址
        //     id: 0, // id
        //     logindate: '', // 登录时间
        //     name: '', // 昵称
        //     synopsis: '', // 简介
        //     username: '', // 用户名
        //     editorvalue: '', // 编辑器内容
        //     login: 0, // 是否登录 0 没有 1 已经登录
        //     biaoqingshow: false, // 是否显示表情包 
        //     // 位置
        //     offset: {
        //         left: 0, top: 0, zIndex: 0
        //     },
        //     // 聊天记录
        //     record: [
        //         { content: '', send: 0, time: Date.now() }
        //     ]
        // }
    ],
    boxList: [
        // {
        //     age: 0, // 年龄
        //     email: '', // 邮箱
        //     ext: '', // 性别
        //     headphoto: '', // 头像地址
        //     id: 0, // id
        //     logindate: '', // 登录时间
        //     name: '', // 昵称
        //     synopsis: '', // 简介
        //     username: '', // 用户名
        //     editorvalue: '', // 编辑器内容
        //     login: 0, // 是否登录 0 没有 1 已经登录
        //     // 聊天记录
        //     record: [
        //         { content: '', send: 0, time: Date.now() } // send = 0 自己发送 = 1 为别人发送
        //     ]
        // }
    ],
    boxActive: 0,
    boxZindex: 0,
    filter: '',
    biaoqing,
    videoCall: {
        show: false,
        id: null,
        zIndex: 0,
        opaction: 1, // 操作 1 为视频通话 2 为显示是否同意连接
        hename: '', // 连接的用户名
        myname: '', // 自己的用户名
        headphoto: ''
    },
    audioCall: {
        show: false,
        id: null,
        zIndex: 0,
        opaction: 1, // 操作 1 为视频通话 2 为显示是否同意连接
        hename: '', // 连接的用户名
        myname: '', // 自己的用户名
        headphoto: ''
    },
    file: {
        src: '',
        show: false
    },
    showImg: {
        src: '',
        show: false
    }
}

export const setState = {
    active: {
        age: 0,
        email: '',
        ext: '',
        headphoto: '',
        id: 0,
        logindate: '',
        name: '',
        synopsis: '',
        username: ''
    },
    setEmail: {
        show: false,
        newEmail: '',
        emailText: '',
        verify: '',
        verifyText: '',
        submit: '获取验证码',
        step: 1,
    },
    setPass: {
        show: false,
        newPass: '',
        newPassText: '',
        rePass: '',
        rePassText: ''
    },
    show: false,
    onoff: true,
    btnText: '提 交',
    upatePhoto: false,
    img: [],
    imgActive: 0,
    setPhoto: false
}
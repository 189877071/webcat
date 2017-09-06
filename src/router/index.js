export default [
    {
        path: '/',
        getComponent(location, callback) {
            import("../containers/Loader")
                .then(module => callback(null, module))
                .catch(err => console.log(err));
        }
    },
    {
        path: '/login',
        getComponent(location, callback) {
            import('../containers/Login')
                .then(module => callback(null, module))
                .catch(err => console.log(err));
        },
        childRoutes: [
            { path: '/login/:operation' }
        ]
    },
    {
        path: '/app',
        getComponent(location, callback) {
            import('../containers/App')
                .then(module => callback(null, module))
                .catch(err => console.log(err));
        }
    }
]
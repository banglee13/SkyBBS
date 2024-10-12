var app = new Vue({
    el: '#user',
    data: {
        users: [],
        newName: '',
        newEmail: '',
        newPassword: '',
        isLogin: false,
        nowUser: '',
        nowEmail: '',
        nowPassword: ''
    },
    methods: {
        register: function() {
            if (this.newName === '' || this.newEmail === '' || this.newPassword === '') {
                alert("请填写完整信息");
                return;
            }
            if (this.newPassword.length < 6) {
                alert("密码长度至少6位");
                return;
            }

            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailPattern.test(this.newEmail)) {
                alert("请输入有效的邮箱地址");
                return;
            }

            for (let user of this.users) {
                if (user.name === this.newName) {
                    alert("该用户名已被注册，请选择其他用户名");
                    return;
                }
                if (user.email === this.newEmail) {
                    alert("该邮箱已被注册，请选择其他邮箱");
                    return;
                }
            }

            const newUser = { name: this.newName, email: this.newEmail, password: this.newPassword };
            this.users.push(newUser);
            this.nowUser = this.newName;
            this.nowEmail = this.newEmail;
            this.newName = '';
            this.newEmail = '';
            this.newPassword = '';
            alert("成功注册");
            this.isLogin = true;

            // 保存状态和用户数据
            localStorage.setItem('isLogin', true);
            localStorage.setItem('nowUser', this.nowUser);
            this.saveUsers(); // 保存用户数据
        },
        login: function() {
            for (let user of this.users) {
                if (user.email === this.newEmail && user.password === this.newPassword) {
                    this.isLogin = true;
                    alert("成功登陆");
                    this.nowUser = user.name;
                    this.nowEmail = user.email;
                    this.newName = '';
                    this.newEmail = '';
                    this.newPassword = '';
                    localStorage.setItem('isLogin', true);
                    localStorage.setItem('nowUser', this.nowUser);
                    return;
                }
            }
            alert("错误的邮箱或密码");
        },
        logout: function() {
            this.isLogin = false;
            this.newName = '';
            this.newEmail = '';
            this.newPassword = '';
            this.nowUser = '';
            this.nowEmail = '';
            alert("成功登出");
            // 仅清除登录状态，不清除用户信息
            localStorage.removeItem('isLogin');
            localStorage.removeItem('nowUser');
        },
        saveUsers: function() {
            localStorage.setItem('users', JSON.stringify(this.users)); // 保存用户数据到 localStorage
        },
        loadUsers: function() {
            const usersStr = localStorage.getItem('users');
            if (usersStr) {
                this.users = JSON.parse(usersStr); // 从 localStorage 加载用户数据
            }
        }
    },
    created() {
        const loggedIn = localStorage.getItem('isLogin');
        if (loggedIn) {
            this.isLogin = true;
            this.nowUser = localStorage.getItem('nowUser');
        }
        this.loadUsers(); // 初始化时加载用户数据
    }
});


var app1 = new Vue({
    el: '#blog',
    data: {
        blogs: [],
        newTitle: '',
        newContent: '',
        replyContents: []
    },
    methods: {
        addBlog: function() {
            if (!app.isLogin) { // 检查是否登录
                alert("请先登录才能发帖");
                return;
            }
            if (this.newTitle === '' || this.newContent === '') {
                alert("请填写完整信息");
                return;
            }
            const newBlog = {
                title: this.newTitle,
                content: this.newContent,
                createtime: new Date().toLocaleString(),
                author: app.nowUser,
                reply: []
            };
            this.blogs.push(newBlog);
            this.saveBlogs(); // 保存到 localStorage
            this.newTitle = '';
            this.newContent = '';
            alert("成功添加");
        },
        deleteBlog: function(index) {
            if (this.blogs[index].author !== app.nowUser) {
                alert("您没有权限删除这篇帖子");
                return;
            }
            this.blogs.splice(index, 1);
            this.saveBlogs(); // 更新 localStorage
            alert("成功删除");
        },
        replyBlog: function(index) {
            if (!app.isLogin) {
                alert("请先登录才能回复");
                return;
            }
            if (this.replyContents[index].trim() === '') {
                alert("回复内容不能为空");
                return;
            }
            this.blogs[index].reply.push({
                name: app.nowUser,
                content: this.replyContents[index],
                createtime: new Date().toLocaleString()
            });
            this.replyContents[index] = '';
            this.saveBlogs(); // 更新 localStorage
            alert("成功回复");
        },
        deleteReply: function(blogIndex, replyIndex) {
            if (this.blogs[blogIndex].reply[replyIndex].name !== app.nowUser) {
                alert("您没有权限删除这条回复");
                return;
            }
            this.blogs[blogIndex].reply.splice(replyIndex, 1); // 删除指定回复
            this.saveBlogs(); // 更新 localStorage
            alert("成功删除回复");
        },
        saveBlogs: function() {
            localStorage.setItem('blogs', JSON.stringify(this.blogs)); // 将博客数组转换为字符串并保存
        },
        loadBlogs: function() {
            const blogsStr = localStorage.getItem('blogs');
            if (blogsStr) {
                this.blogs = JSON.parse(blogsStr); // 从 localStorage 加载博客数据
            }
        }
    },
    created() {
        this.loadBlogs(); // 初始化时加载博客数据
    },
    computed: {
        userBlogs() {
            return this.blogs.filter(blog => blog.author === app.nowUser);
        }
    }
});
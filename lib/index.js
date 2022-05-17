
/**
 * 用于处理kocq消息事件的中间件
 */

class KocqMessage {

    constructor(conf = { sync: true }) {
        this.conf = conf;
        this.$middlewares = [];
    }

    /**
     * 消息的二级中间件
     */

    use(middleware) {
        if (typeof middleware === "function") this.$middlewares.push(middleware);
        else if (typeof middleware === "object" && typeof middleware.install === "function") middleware.install(addMiddleware.bind(this));
        /** 兼容v1版本 */
        else if (typeof middleware === "object" && typeof middleware.apply === "function") this.$middlewares.push(middleware.apply());
        else throw new TypeError("传入类型错误！");
        return this;
    }

    callback() {
        const fnMiddleware = this.$compose(this.$middlewares);
        const fnMiddlewareSync = this.$composeSync(this.$middlewares);
        const handleMessage = async (ctx, next) => {
            if (ctx.postType !== 'message') return;
            if (this.conf.sync) await fnMiddlewareSync(ctx, next);
            else fnMiddleware(ctx, next);
            await next();
        }
        return handleMessage;
    }

    /** 异步模式 */
    $compose(middlewares) {
        return function (ctx, next) {
            let hasNexted = false;
            let onceNext = () => {
                if (!hasNexted) { hasNexted = true; return next(); }
                else return Promise.resolve();
            };
            for (let mid of middlewares) mid(ctx, onceNext);
        }
    }

    /** 同步模式 */
    $composeSync(middlewares) {
        return async function (ctx, next) {
            let hasNexted = false;
            let onceNext = () => {
                if (!hasNexted) { hasNexted = true; return next(); }
                else return Promise.resolve();
            };
            for (let mid of middlewares) await mid(ctx, onceNext);
        }
    }

    /**
     * 插件安装的方法
     */

    install(add) {
        add(this.callback());
    }

}

/** 
 * 用作install方法给用户自定义添加插件 
 */

function addMiddleware(middleware) {
    if (typeof middleware === "function") this.$middlewares.push(middleware);
    else throw new TypeError("addMiddleware方法需要一个函数对象作为参数！");
}

module.exports = KocqMessage;
<template>
    <Upload
        ref="upload"
        :default-file-list="[]"
        :on-success="handleSuccess"
        :on-format-error="handleFormatError"
        :format="format"
        :max-size="2048"
        type="drag"
        :headers="{
            token: user.token
        }"
        action="/api/sys/oss/upload">
        <div class="upload-view">
            <div v-if="!image" class="icon">
                <Icon size="35" type="ios-image" />
                <span>上传图片</span>
            </div>
            <img v-else :src="url">
        </div>
    </Upload>
</template>

<script>
    import { createNamespacedHelpers } from 'vuex'
    const system = createNamespacedHelpers('system')
    export default {
        props: {
            format: {
                type: Array,
                default() {
                    return ['jpg','jpeg','png']
                }
            },
            value: String
        },
        data() {
            return {
                image: this.value,
                percent: 0
            }
        },
        watch: {
            value(v) {
                this.image = v
            }
        },
        methods: {
            handleSuccess(res) {
                const { code, msg, url } = res 
                if (code === 0) {
                    this.image = url
                    return this.$emit('input', url)
                }
                this.$Notice.error({
                    title: '错误',
                    desc: msg
                })
            },
            handleFormatError(e) {
                this.$Notice.error({
                    title: '错误',
                    desc: `文件${e.name}格式不正确, 文件格式必须为 ${this.format.join('，')}`
                })
            }
        },
        computed: {
            ...system.mapGetters([
                'user'
            ]),
            url() {
                if (/^\/renren-fast/.test(this.image)) {
                    return this.image.replace(/^\/renren-fast/, '/api') + '&token=' + this.user.token
                }
                // 本地图片加 token 访问
                if (RegExp(location.host).test(this.image)) {
                    return this.image + '&token=' + this.user.token
                }
                return this.image
            }
        }
    }
</script>

<style lang="less" scoped>
    .upload-view {
        width: 100%;
        height: 100px;
        padding: 10px;
        .icon {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100%;
            padding-top: 10px;
        }
        img {
            height: 100%;
            box-sizing: border-box;
        }
    }
</style>
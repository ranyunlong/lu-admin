<template>
    <span class="role-authorization">
        <div class="item" v-if="value.type === 0 || value.type === 1">
            <Checkbox
                style="margin-right:15px;" 
                v-model="value.selected"
                :disabled="disabled"
                :label="value.roleId">
                <!-- <Icon :type="value.icon"></Icon> -->
                <span>{{value.name}}</span>
            </Checkbox>
        </div>
        <Checkbox
            v-else
            style="margin-right:15px;" 
            v-model="value.selected"
            :disabled="disabled"
            :label="value.roleId">
            <!-- <Icon :type="value.icon"></Icon> -->
            <span>{{value.name}}</span>
        </Checkbox>
        <div class="item-list" style="padding-left:10px;" v-show="value.selected && value.children.length > 0" >
            <RoleAuthorization v-for="role in value.children" :key="role.roleId" :disabled="!value.selected" :value="role" />
        </div>
    </span>
</template>

<script>
    export default {
        name: 'RoleAuthorization',
        props: {
            value: Object,
            disabled: Boolean
        }
    }
</script>

<style scoped lang="less">
</style>
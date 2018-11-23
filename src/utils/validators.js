import { 
    isMobilePhone    
} from 'validator'


export const MobilePhone = (rule, value, callback) => {
    isMobilePhone(value, rule.locale || 'zh-CN') ? callback() : callback(true)
}
/*
 * @Author: your name
 * @Date: 2019-11-29 11:49:49
 * @LastEditTime: 2019-11-29 12:06:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \egg-restapi-module-tool\app\utils\match.js
 */
module.exports = () => {
    class MathBase {
        // 加法
        add(...list) {
            return list.reduce(MathBase._add)
        }

        // 减法
        subtract(...list) {
            return list.reduce(MathBase._subtract)
        }

        // 乘法
        multiply(...list) {
            return list.reduce(MathBase._multiply)
        }

        // 除法
        divide(...list) {
            return list.reduce(MathBase._divide)
        }

        // 加法
        static _add(n, m) {
            const {F,S,T,l1,l2} = MathBase.getInteger(n,m);
            return (F[0] * T + F[1] * T / Math.pow(10, l1) + S[0] * T + S[1] * T / Math.pow(10, l2)) / T
        }

        // 减法
        static _subtract(n, m) {
            const {F,S,T,l1,l2} = MathBase.getInteger(n,m);
            return (F[0] * T + F[1] * T / Math.pow(10, l1) - S[0] * T - S[1] * T / Math.pow(10, l2)) / T
        }

        // 乘法
        static _multiply(n, m) {
            const {F,S,T,l1,l2} = MathBase.getInteger(n,m);
            return ((F[0] * T + F[1] * T / Math.pow(10, l1)) * (S[0] * T + S[1] * T / Math.pow(10, l2))) / T / T
        }

        // 除法
        static _divide(n, m) {
            const {F,S,T,l1,l2} = MathBase.getInteger(n,m);
            return ((F[0] * T + F[1] * T / Math.pow(10, l1)) / (S[0] * T + S[1] * T / Math.pow(10, l2)))
        }


        static numToString(tempArray) {
            if (typeof tempArray === 'number') {
                return tempArray.toString()
            }
            return '0'
        }

        static handleNum(n) {
            n = n.toString();
            let temp = n.split('.');
            temp.push(temp[1].length);
            return temp
        }

        static getInteger(n,m){
            n = typeof n === 'string' ? n : MathBase.numToString(n);
            m = typeof m === 'string' ? m : MathBase.numToString(m);
            let F = n.indexOf('.') !== -1 ? MathBase.handleNum(n) : [n, 0, 0],
                S = m.indexOf('.') !== -1 ? MathBase.handleNum(m) : [m, 0, 0],
                l1 = F[2], l2 = S[2],
                L = Math.max(l1,l2),
                T = Math.pow(10, L);
            return {
                F,
                S,
                T,
                l1,
                l2
            }
        }
    }
    return MathBase
}

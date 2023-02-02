/**
 * 
 * @param  {...(string | { string: any } | any[])} args
 * @returns 
 */
export const classNames = (...args) => {
   const calcObj = (obj) => Object
      .entries(obj)
      .filter(entry => !!entry[1])
      .map(entry => entry[0])
      .join(' ')

   const calcArr = (arr) => arr
      .filter(item => !!item)
      .map(item => {
         if (typeof item !== 'object')
            return item.toString()
         if (item.__proto__ === Object.prototype)
            return calcObj(item)
         if (item.__proto__ !== Array.apply.prototype)
            return calcArr(item)
         throw new Error('wrong type of args')
      }).join(' ')

   return calcArr(args).trim()
};
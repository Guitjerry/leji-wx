/**
 * isFloat
 * 检测一个值是否为浮点数
 *
 * @param {any} n
 * @return {boolean}
 */
exports.isFloat = n =>
  Number(n) === n && n % 1 !== 0;

/**
 * decimalPlaces
 * 计算数字的小数点长度
 *
 * @param {number} num
 * @return {number}
 */

exports.decimalPlaces = num => {
  const match = (''+num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);

  if (!match) { return 0 }

  return Math.max(
    0,
    // Number of digits right of decimal point.
    (match[1] ? match[1].length : 0)
    // Adjust for scientific notation.
    - (match[2] ? +match[2] : 0)
  )
};

/**
 * maybeToFixed
 * 如果小数点长度大于2的话，精确到2位
 *
 * @param {number} num
 */
exports.maybeToFixed = num =>
  exports.decimalPlaces(num) > 2 ? Number(Number(num).toFixed(2)) : Number(num);


/**
 * obj2query
 * 对象 => query string
 *
 * @param {object} obj
 * @return {string}
 */
exports.obj2query = obj =>
  Object.keys(obj).reduce((prev, key, index, arr) => {
    const value = obj[key];
    if (value == null) return prev;

    return `${prev}${key}=${encodeURIComponent(value)}${index !== arr.length - 1 ? '&' : ''}`
  }, '');

/**
 * payTimeFormat
 * secs => min-sec
 *
 * @param {number}
 * @return {string}
 */
exports.payTimeFormat = value =>
  `${~~(value / 60)}分${value % 60}秒`;


/**
 * jsonSize
 * 获取一个json的大小（Byte）
 *
 * @param {object} json JS对象
 * @return {number}
 */
exports.jsonSize = json => {
  const str = JSON.stringify(json);
  return ~-encodeURI(str).split(/%..|./).length
};

/**
 * appendTail
 * 将一个数组拼接到另一个数组的尾部
 *
 * @param {array} body 原数组
 * @param {array} tail 拼接到原数组的新数组
 * @param {string} key 用于辨识的属性名
 * @param {number} offset 辨识范围, 值越大辨识速度越慢、范围越广，默认为5
 */
exports.appendTail = (body, tail, key) => {
  const offset = Math.min(body.length, tail.length);
  const bodySamples = body.slice(body.length - offset).map(bodySample => bodySample[key]);
  let i = 0;
  do {
    if (tail[i] && bodySamples.indexOf(tail[i][key]) > -1) delete tail[i]
  } while(++i < offset);
  tail = tail.filter(t => t);
  body.push(...tail);
  return body
};

/**
 * formatTime
 * 计算时间
 *
 * @param {string} date
 */
exports.formatTime = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
};

const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : '0' + n
};

/* eslint-disable camelcase */
export const calculateGroupDescriptions = (params = {}) => {
  const {
    boughtPrice,     // 原价
    boughtCount,     // 买了多少件
    is_owner,        // 是否团长
    ladder,          // 阶梯
    price_ladder,    // 阶梯价格
    mode,            // 拼团模式
    integral,        // 积分
    partake_count,   // 已参加人数
    goods_count,     // 已买总件数
  } = params;

  let group = {};
  let _currentState = '';              // 拼团情况
  let isOwner = is_owner;              // 是否为团长
  let isFormed = false;                // 是否已经成团
  let hasNext = false;                 // 是否有下一级阶梯
  let leastCount = 0;                  // 还差多少到达下一级
  let leastSaves = 0;                  // 到达下一级时能返多少元
  let steps = [];                      // 阶梯的汇总
  let stepNow = null;                  // 当前阶梯
  let stepNext = null;                 // 下级阶梯
  let currentCount = mode === 'people' // 当前情况
    ? partake_count
    : goods_count;
  let unit = mode === 'people'         // 当前所用单位
    ? '人'
    : '件商品';

  if (ladder.length && price_ladder.length) {
    const _ladder = ladder.sort((a, b) => (a.index > b.index));
    const _price_ladder = price_ladder.sort((a, b) => (a.index > b.index));

    for (let i = 0; i < _ladder.length; i++)
      steps.push({
        ..._ladder[i],
        ..._price_ladder[i],
      });

    steps.map((x) => {
      if (currentCount >= x.num)
        stepNow = x;
    });

    if (stepNow !== null) {
      const _index = steps.findIndex((x) => (x === stepNow));
      stepNext = (_index + 1) < steps.length
        ? steps[_index + 1]
        : (
          currentCount < stepNow.num ? stepNow : null
        );
      isFormed = _index >= 1 || currentCount >= stepNow.num;
    } else {
      stepNext = steps[0];
    }

    if (stepNext) {
      hasNext = true;
      const {num, price} = stepNext;
      leastCount = num - currentCount;
      leastSaves = (boughtPrice - parseFloat(price)) * boughtCount;
      leastSaves = leastSaves.toFixed(2);
    }
  }

  const credicts = integral && integral > 0
    ? `获${integral}积分`
    : '';

  if (isFormed) {
    if (isOwner) {
      if (hasNext)       // 是团长，已成团且有下一阶梯目标
        _currentState = `已成团${credicts}，还差${leastCount + unit}可节省${leastSaves}元`;
      else               // 是团长，已成团且没有下一阶梯目标
        _currentState = `已成团${credicts}，共${partake_count}人已买${goods_count}件`;
    } else {
      if (hasNext)       // 不是团长，已成团且有下一阶梯目标
        _currentState = `已成团，还差${leastCount + unit}可节省${leastSaves}元`;
      else               // 不是团长，已成团且没有下一阶梯目标
        _currentState = `已成团，共${partake_count}人已买${goods_count}件`;
    }
  } else {
    if (isOwner)         // 未成团且是团长
      _currentState = `还差${leastCount + unit}成团${(integral && integral > 0) ? '可' + credicts : ''}，快邀请好友吧~`;
    else                 // 未成团且不是团长
      _currentState = `还差${leastCount + unit}成团，快邀请好友吧~`;
  }

  group._currentState = _currentState;
  group._leastCount = leastCount;

  return group;
};


export const calculateEstimateDeliveryTime = (params = {}) => {
  const {
    estimate_time,  // 后台配置的时间
    add_time,       // 订单添加时间
  } = params;

  let _sendDate = '';

  let now = new Date(add_time);
  let tomorrow = new Date(add_time);
  tomorrow.setDate(now.getDate() + 1);
  let dateMap = {
    today: [
      now.getFullYear(),
      `0${now.getMonth() + 1}`.slice(-2),
      `0${now.getDate()}`.slice(-2),
    ].join('.'),
    tomorrow: [
      tomorrow.getFullYear(),
      `0${tomorrow.getMonth() + 1}`.slice(-2),
      `0${tomorrow.getDate()}`.slice(-2),
    ].join('.'),
  };
  Array.from(estimate_time).map(
    ({add, send, sendtype}, index, array) => {
      if (_sendDate) return;

      const [sendStart, sendEnd] = send;
      const [orderStart, orderEnd] = add.map(
        (x) => {
          if (!x) return;
          const [h, m] = x.split(':');
          const t = new Date();
          t.setHours(h);
          t.setMinutes(m);
          return t;
        });

      if (
        (now >= orderStart && now < orderEnd)
        || (index === array.length - 1)
      )
        _sendDate = `${dateMap[sendtype]} ${sendStart}-${sendEnd}`;
    }
  );

  return _sendDate;
};


export const verifyCustomizedData = (params = {}) => {
  const {
    type,
    name,
    value,
    required,
    length,
    minimum,
    maximum,
  } = params;

  if (required && value === undefined)
    return `${name} 不能为空`;

  if (type === 'string' && value !== undefined) {
    if (required && String(value).trim().length < 1)
      return `${name} 不能为空`;
    if (length && String(value).trim().length > length)
      return `${name} 长度不能大于 ${length}`;
  }

  if (type === 'number' && value !== undefined) {
    if (required && String(value).trim().length < 1)
      return `${name} 不能为空`;
    if (minimum !== null && parseFloat(value) < minimum)
      return `${name} 不能小于 ${minimum}`;
    if (maximum !== null && parseFloat(value) > maximum)
      return `${name} 不能大于 ${maximum}`;
  }

  if (type === 'date') {}

  if (type === 'checkbox') {
    if (required && value && value.length < 1)
      return `${name} 不能为空`;
  }

  return false;
};

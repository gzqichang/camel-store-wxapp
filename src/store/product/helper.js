import {parse2Float} from '../../utils';
import {
  _TYPES,
  PRODUCT_TYPES,
  PRODUCT_FIELD_NAMES,
} from '../properties';


/* eslint-disable camelcase */
export const productListParser = (list = []) => {
  let _ = [];

  let modelNames = {};
  Object
    .entries(PRODUCT_TYPES)
    .map(([key, value]) => {
      modelNames[value] = key;
    });

  if (list.length) {
    _ = Array
      .from(list)
      .map(
        (item) => {
          const {
            model_type,
            groupbuy,
            groupbuy_info,
          } = item;
          const _model = modelNames[model_type];
          const _product = item[PRODUCT_FIELD_NAMES[_model]];

          let _groupType = '';
          let _image = '';
          let _sellPrice = 0;
          let _marketPrice = 0;
          let _credit = 0;

          if (groupbuy_info && groupbuy) {
            const {ladder_list, mode} = groupbuy_info;

            if (ladder_list[0])
              _groupType += ladder_list[0].num || '';

            if (mode)
              _groupType += mode === 'people' ? ' 人团' : ' 件团';
          }

          if (_product && _product.gtypes) {
            Array.from(_product.gtypes).map(
              ({price, market_price, credit, ladder_list}) => {
                if (price && _model !== _TYPES.credits)
                  if (
                    _sellPrice === 0
                    || parseFloat(price) < _sellPrice
                  )
                    _sellPrice = parseFloat(price);

                if (market_price && _model !== _TYPES.credits)
                  if (
                    _marketPrice === 0
                    || parseFloat(market_price) < _marketPrice
                  )
                    _marketPrice = parseFloat(market_price);

                if (groupbuy && ladder_list && ladder_list[0]) {
                  const {price} = ladder_list[0] || {};
                  if (_sellPrice > price)
                    _sellPrice = price;
                }

                if (_model === _TYPES.credits) {
                  if (!_marketPrice || _marketPrice > parseFloat(price) + credit) {
                    _marketPrice = parseFloat(price) + credit;
                    _credit = credit;
                    _sellPrice = price;
                  }
                  // if (!_credit || _credit > credit)
                  //   _credit = credit;
                }
              }
            );

            _sellPrice = parse2Float(_sellPrice);
            _marketPrice = parse2Float(_marketPrice);
            // if (_model !== _TYPES.credits) {
            //   _sellPrice = parse2Float(_sellPrice);
            //   _marketPrice = parse2Float(_marketPrice);
            // }
          }

          if (item.banner && item.banner[0])
            _image = item.banner[0].image;

          return {
            ...item,
            _model,
            _product,
            _groupType,
            _sellPrice,
            _marketPrice,
            _credit,
            _image,
          };
        });
  }

  return _;
};

export const productCreditParser = (gtypes = []) => {
  let _sellPrice = 0;
  let _marketPrice = 0;
  let _credit = 0;
  let _price_range = 0;
  if (gtypes.length) {
    Array.from(gtypes).map(
      ({price = 0, market_price = 0, credit}) => {
        if (!_price_range || _price_range > parseFloat(price) + credit) {
          _price_range = parseFloat(price) + credit;
          _marketPrice = market_price;
          _credit = credit;
          _sellPrice = price;
        }
      }
    );

    _sellPrice = parse2Float(_sellPrice);
    _marketPrice = parse2Float(_marketPrice);
  }

  return {
    _sellPrice,
    _marketPrice,
    _credit,
  };
};

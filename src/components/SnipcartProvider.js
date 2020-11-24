const React = require('react');
const {useStore, SnipcartContext} = require('../store');

/**
 * @param props : {currency, version}
 */
const SnipcartProvider = props => {
  const [state, dispatch] = useStore();
  const {defaultLang, locales} = props;
  const changeLanguage = lang => {
    const lng = locales[defaultLang] || {};
    window.Snipcart.api.session.setLanguage(lang, lng);
  };
  const addItem = item => {
    if (item !== {} || Boolean(item.id)) {
      window.Snipcart.api.cart.items.add(item);
    }
  }
  React.useEffect(() => {
    const listenSnipcart = () => {
      document.addEventListener('snipcart.ready', () => {
        dispatch({type: 'setReady', payload: true});
        changeLanguage(defaultLang);
      });
    };

    if (window.Snipcart !== undefined) {
      dispatch({type: 'setReady', payload: true});
      changeLanguage(defaultLang);
    } else {
      listenSnipcart();
    }
  }, [props, dispatch, defaultLang, locales]);

  return (
    <SnipcartContext.Provider value={{state, changeLanguage, addItem}}>
      {props.children}
    </SnipcartContext.Provider>
  );
};

SnipcartProvider.defaultProps = {
  version: '3.0.15',
  locales: {},
  defaultLang: 'en',
};

export default SnipcartProvider;

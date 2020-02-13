const nss = [
    'App'
];

exports.nss = nss;

const lngs = ['en', 'zh'];
exports.lngs = lngs;

exports.i18nScannerOptions = {
    // debug: true,
    func: {
        list: ['t', 'props.t', 'props.t!', 'this.props.t', 'i18next.t', 'i18n.t', 'props.i18n!.t', 'this.props.t!', 'this.translate'],
        extensions: ['.ts', '.tsx'],
    },
    lngs: ['en', 'zh'],
    ns: nss,
    defaultLng: 'en',
    defaultNs: 'App',
    resource: {
        loadPath: 'translations/{{lng}}/{{ns}}.json',
        savePath: '{{lng}}/{{ns}}.json',
        jsonIndent: 2,
        lineEnding: '\n',
    },
    nsSeparator: ':', // namespace separator
    keySeparator: false, // key separator
    interpolation: {
        escapeValue: false, // not needed for react!!
        prefix: '{{',
        suffix: '}}',
    },
};


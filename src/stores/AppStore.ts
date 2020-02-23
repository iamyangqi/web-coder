import {action, observable} from "mobx";
import {Locales, Themes} from "../interfaces/app";

class AppStore {
    @observable theme: Themes = Themes.default;
    @observable locale: Locales = Locales.zh;

    @action
    setTheme(t: Themes) {
        this.theme = t;
    }

    @action
    setLocale(l: Locales) {
        this.locale = l;
    }
}

const appStore = new AppStore();

export default appStore;
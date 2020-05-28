import {I18N} from 'aurelia-i18n';
import XHR from 'i18next-xhr-backend';
import {Aurelia} from 'aurelia-framework';
import * as environment from '../config/environment.json';
import {PLATFORM} from 'aurelia-pal';

export function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .feature(PLATFORM.moduleName('resources/index'))
   // .plugin(PLATFORM.moduleName("aurelia-validation"))
    //.plugin(PLATFORM.moduleName("aurelia-validatejs"))
    .plugin(PLATFORM.moduleName('aurelia-i18n'), (instance) => {
      // register backend plugin
      instance.i18next.use(XHR);

      // adapt options to your needs (see http://i18next.com/docs/options/)
      instance.setup({
         backend: {                                  
            loadPath: '/locales/{{lng}}/{{ns}}.json',
         },
				
         lng : 'de',
         attributes : ['t','i18n'],
         fallbackLng : 'en',
         debug : false
      });
   });

  aurelia.use.developmentLogging(environment.debug ? 'debug' : 'warn');

  if (environment.testing) {
    aurelia.use.plugin(PLATFORM.moduleName('aurelia-testing'));
  }

  aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName('app')));
}

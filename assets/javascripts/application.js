import Vue  from 'vue';
import moment from 'moment';
import $ from 'jquery';

import flatMap from 'lodash/flatMap';
import map from 'lodash/map';

import 'jquery.scrollto';
import 'bootstrap-loader/extractStyles';

import '../stylesheets/application.css';

$(function() {
  if (window.DATA === undefined || window.DATA.type != 'schedule') {
    return;
  }

  let tabs = [
    {
      hash: 'timetable',
      tabElement: $('#timetable-tab'),
      contentElement: $('#timetable')
    },
    {
      hash: 'character',
      tabElement: $('#character-tab'),
      contentElement: $('#character')
    }
  ];
  let twitterTab = {
    hash: 'twitter',
    tabElement: $('#twitter-tab'),
    contentElement: $('#twitter')
  };
  if (twitterTab.tabElement.length !== 0) {
    tabs.push(twitterTab);
  }

  let updateTab = function(hash) {
    let tab = (function() {
      let i, n = tabs.length;
      for (i = 0; i < n; ++i) {
        if (hash.indexOf('#' + tabs[i].hash + '/') === 0) {
          return tabs[i];
        }
      }
    })();
    if (tab === undefined) {
      tab = tabs[0];
    }

    tabs.filter(t => t.hash != tab.hash).forEach(t => {
      t.tabElement.removeClass('active');
      t.contentElement.hide();
    });
    tab.tabElement.addClass('active');
    tab.contentElement.show();
  };

  let hashchange = function() {
    updateTab(location.hash);
  };

  $(window).on('hashchange', hashchange).triggerHandler('hashchange');

  $(document).on('click', 'a[href^="#"]', function() {
    let hash = $(this).attr('href');

    updateTab(hash);

    $(window).off('hashchange', hashchange);
    location.hash = hash;
    $(window).on('hashchange', hashchange);

    let target = $('*[name="' + decodeURI(hash.substring(1)) + '"]');
    if (target.length > 0) {
      $.scrollTo(target);
    }
    return false;
  });

  Vue.filter('to_time', function(value) {
    return moment(value).format('HH:mm');
  });

  let groupGreetings = function(greetings) {
    let table = {};
    greetings.forEach(greeting => {
      if (!(greeting.end_at in table)) {
        table[greeting.end_at] = {};
      }
      if (!(greeting.start_at in table[greeting.end_at])) {
        table[greeting.end_at][greeting.start_at] = [];
      }
      table[greeting.end_at][greeting.start_at].push(greeting);
    });

    return flatMap(table, (t, end_at) => {
      return flatMap(t, (g, start_at) => {
        return {
          start_at: start_at,
          end_at: end_at,
          greetings: g
        };
      });
    });
  };

  let vm = new Vue({
    el: '#contents',
    data: {
      rawGreetings: window.DATA.greetings,
      epoch: +new Date()
    },
    created: function() {
      setInterval(() => {
        if (moment().format('YYYY-MM-DD') == window.DATA.date) {
          $.ajax({
            url: '/api/schedule/' + moment(window.DATA.date).format('YYYY/MM/DD') + '/',
            dataType: 'json'
          }).done(data => {
            vm.$set('rawGreetings', data);
          });
        }
      }, 5 * 60 * 1000);

      setInterval(() => {
        let date;
        if (moment(date).format('YYYY-MM-DD') == window.DATA.date) {
          date = new Date();
          date.setMinutes(Math.floor(date.getMinutes() / 5) * 5);
          date.setSeconds(0);
          date.setMilliseconds(0);
        }
        else {
          date = moment(window.DATA.date).add(1, 'days').toDate();
        }
        vm.$set('epoch', +date);
      }, 1000);
    },
    computed: {
      groupedGreetingsDeleted: function() {
        return groupGreetings(this.rawGreetings.filter(greeting => greeting.deleted));
      },
      groupedGreetingsBeforeTheStart: function() {
        let epoch = this.epoch;

        return groupGreetings(this.rawGreetings.filter(greeting => {
          return !greeting.deleted && epoch < (+new Date(greeting.start_at));
        }));
      },
      groupedGreetingsInSession: function() {
        let epoch = this.epoch;

        return groupGreetings(this.rawGreetings.filter(greeting => {
          return !greeting.deleted && epoch >= (+new Date(greeting.start_at)) && epoch < (+new Date(greeting.end_at));
        }));
      },
      groupedGreetingsAfterTheEnd: function() {
        let epoch = this.epoch;

        return groupGreetings(this.rawGreetings.filter(greeting => {
          return !greeting.deleted && epoch >= (+new Date(greeting.end_at));
        }));
      },
      groupedGreetingsByCharacter: function() {
        let existingGreetings = this.rawGreetings.filter(greeting => !greeting.deleted);
        let characters = existingGreetings.reduce((result, greeting) => {
          return greeting.characters.reduce((result, character) => {
            result[character.id] = character;
            return result;
          }, result);
        }, {});

        let characterIdGreetingPairs = flatMap(existingGreetings, greeting => {
          return greeting.characters.map(character => {
            return [ character.id, greeting ];
          });
        });

        let grouped = characterIdGreetingPairs.reduce((result, pair) => {
          (result[pair[0]] || (result[pair[0]] = [])).push(pair[1]);
          return result;
        }, {});

        return map(grouped, (greetings, id) => {
          return { character: characters[id], greetings: greetings };
        });
      }
    }
  });
});

$(function() {
  $('#report-form').submit(function() {
    let place = $('select[name="place_id"] option:selected', this).text();
    let character = $('select[name="character_id"] option:selected', this).text();
    let status = place + ' で ' + character + ' に会ったよ！';
    let width = 575;
    let height = 400;
    let left = ($(window).width() - width) / 2;
    let top = ($(window).height() - height) / 2;
    window.open(
      'https://twitter.com/share?via=puro_greeting&' + [
        'text=' + encodeURIComponent(status),
        'url=',
        'hashtags=' + encodeURIComponent('ピューログリ')
      ].join('&'),
      'twitter',
      [
        'status=1',
        'width=' + width,
        'height=' + height,
        'left=' + left,
        'top=' + top
      ].join(',')
    );
    return false;
  });
});

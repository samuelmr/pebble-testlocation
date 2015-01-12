var UI = require('ui');
var watcher;

var locationOptions = {enableHighAccuracy: true};

var menuItems = [];
var activeAction = 0;

var menu = new UI.Menu({'sections': [
                          {'items': [{'title': 'Current position',
                                      'subtitle': 'Get'},
                                     {'title': 'Watch position',
                                      'subtitle': 'Start'}]}]});
menu.show();
var submenu = new UI.Menu({});
submenu.on('select', stopWatch);

menu.on('select', function(e) {
  activeAction = e.itemIndex;
  var modifiedItem = menu.item(0, activeAction);
  modifiedItem.subtitle = 'Please wait...';
  menu.item(0, activeAction, modifiedItem);
  stopWatch();
  if (activeAction == 1) {
    watcher = navigator.geolocation.watchPosition(
      showPosition,
      showError,
      locationOptions
    );
  }
  else {
    navigator.geolocation.getCurrentPosition(
      showPosition,
      showError,
      locationOptions
    );
  }
});
menu.on('longSelect', stopWatch);

function stopWatch() {
  if (watcher) {
    navigator.geolocation.clearWatch(watcher);
  }
}

function showPosition(position) {
  var modifiedItem = menu.item(0, activeAction);
  modifiedItem.subtitle = (activeAction == 1) ? 'Start' : 'Get';
  menu.item(0, activeAction, modifiedItem);
  menuItems[0] = {'title': 'Position',
                  'subtitle': position.coords.latitude + ',' +
                              position.coords.longitude};
  menuItems[1] = {'title': 'Accuracy',
                  'subtitle': position.coords.accuracy + ' m'};
  menuItems[2] = {'title': 'Heading',
                  'subtitle': position.coords.heading + '°'};
  menuItems[3] = {'title': 'Speed',
                  'subtitle': position.coords.speed + ' m/s'};
  menuItems[4] = {'title': 'Altitude',
                  'subtitle':  position.coords.altitude + ' m'};
  menuItems[5] = {'title': 'Alt accuracy',
                  'subtitle':  position.coords.altitudeAccuracy + ' m'};
  updateView();
}
function showError(error) {
  menuItems[0] = {'title': 'Error',
                  'subtitle': error.message};
  menuItems[1] = {'title': 'Code',
                  'subtitle': error.code};
  updateView();
}

      
function updateView() {
  submenu.items(0, menuItems);
  submenu.show();
}

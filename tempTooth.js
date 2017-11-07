
// MODULE: Pattern mediator -> sub\pub for statement store via module components ***bbz
var mediator = (function () {
    var subscribe = function (channel, fn) {
      if (!mediator.channels[channel]) {
        mediator.channels[channel] = [];
      }
      mediator.channels[channel].push({
        context: this, callback: fn
      });
      return this;
    },
      publish = function (channel) {
        if (!mediator.channels[channel]) return false;
        var args = Array.prototype.slice.call(arguments, 1);
        for (var i = 0, l = mediator.channels[channel].length; i < l; i++) {
          var subscription = mediator.channels[channel][i];
          subscription.callback.apply(subscription.context, args);
        }
        return this;
      };
  
    return {
      channels: {},
      publish: publish,
      subscribe: subscribe,
      installTo: function (obj) {
        obj.subscribe = subscribe;
        obj.publish = publish;
      }
    };
  
  })();
  
  var toothMap = {

  }
  
  mediator.installTo(toothMap);
  toothMap.subscribe('toothDataRecieved', function(data){
        this.tMap = JSON.parse(data)[0];
  });
  $.when( $.ajax( 'api/getToothMap/' ) )
    .then(function( data, textStatus, jqXHR ) {
        toothMap.publish('toothDataRecieved', data); 
    });
    
  // Tooth obj state (store)
  var tooth = {
    state: undefined, // initial focus editing abortEditing edited
    condition: undefined, //robust requiresTreatment cured implant removed
    position: undefined, // позиция в массиве зубов. Number||String
    descriptionText: undefined, //  расшифровка из легенды
    colorLegend: undefined,// Цвет из легенды
    comments: undefined, //Комментарий от врача
    serviceProvided: undefined, //Оказанные услуги
    currentServiceProvide: 'none', //Оказываемая сейчас услуга
    stateCondition: 'inactivated',
  
    states: {
      //состояния объекта зубы
      deactivating: {
        //не выбран
        initialize: function (target) {
          this.target = target;
          console.log('tooth deactivating on initialize');
        },
        setup: function () {
          console.log('tooth deactivating on setting up');
        },
        execute: function () {
          console.log('tooth deactivating on execute');
          //         this.target.changeState(this.target.states.deactivating);
          this.stateCondition = 'deactivated';
        },
      },
      activating: {
        initialize: function (target) {
          this.target = target;
          console.log('tooth activating on initialize');
        },
        setup: function () {
          console.log('tooth activating on setting up');
        },
        execute: function () {
          //         this.target.changeState(this.target.states.activating);
          console.log('tooth activating on execute');
          this.stateCondition = 'activated';
        },
        activate: function () {
          console.log('already activated');
        },
        deactivate: function () {
          this.target.changeState(this.target.states.deactivating);
        }
      },
      inactivating: {
        initialize: function (target) {
          this.target = target;
          console.log('tooth deactivating on initialize');
        },
        setup: function () {
          console.log('tooth deactivating on setting up');
          let opts = {}
              for (var key in toothMap.tMap) {
                if (toothMap[tMap].hasOwnProperty(key)) {
                   this[key] = toothMap.tMap[key];
                    opts[key] = toothMap[key];
                }
              }
              console.log(opts);
              return opts;
          },
               
           //robust requiresTreatment cured implant removed 
   
      
        execute: function () {
          //         this.target.changeState(this.target.states.inactivating);
          this.stateCondition = 'inactivated';
        },
        activate: function () {
          console.log('tooth activating from inactivating');
          this.target.changeState(this.target.states.activating);
        },
        deactivate: function () {
          console.log('tooth deactivating from inactivating');
          this.target.changeState(this.target.states.deactivating);
        }
      },
      focusing: {
        initialize: function (target) {
          this.target = target;
        }
      },
      editing: {
        initialize: function (target) {
          this.target = target;
        },
        edit: function () {
          this.state.changeState(this.target.states.editing);
        }
      }
    },
    initialize: function () {
      this.states.activating.initialize(this);
      this.states.deactivating.initialize(this);
  //     this.states.inactivating.initialize(this);
      this.state = this.states.inactivating;
    },
    activate: function () {
      this.state.activate();
    },
    deactivate: function () {
      this.state.deactivate();
    },
    focus: function () {
      this.state.focus();
    },
    edit: function () {
      this.state.edit();
    },
    inactivate: function () {
      this.state.inactivate();
    },
  
    changeState: function (state) {
      if (this.state !== state) {
        //       this.state.exit();
        //       this.state = state;
        //       this.state.enter();
        //       this.state.execute();
        this.state.deactivate();
        this.state = state;
        this.state.setup();
        this.state.execute();
      }
    }
  }
  
  
  
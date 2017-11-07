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
      },
      execute: function () {
//         this.target.changeState(this.target.states.inactivating);
        this.stateCondition = 'inactivated';
      },  
      activate: function () {
        console.log('tooth activating from inactivating');
        this.target.changeState(this.target.states.activating);
      },
      deactivate: function(){
           console.log('tooth deactivating from inactivating');
          this.target.changeState(this.target.states.activating);
      }
    },
//     deactivating: {
//       initialize: function (target) {
//         this.target = target;
//       },
//       deactivate: function () {
//         this.target.changeState(this.target.states.deactivating);
//       }
//     },
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
    this.states.inactivating.initialize(this);
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
  inactivate: function(){
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

Template.navItems.helpers({
    activeIfTemplateIs: function (template) {
        var currentRoute = Router.current();
        return currentRoute &&
        template === currentRoute.lookupTemplate() ? 'active' : '';
    }
});

Template.layout.helpers({

    loggingIn: function(){
        return Meteor.loggingIn();
    },

    loggedOut: function(){
        return !Meteor.loggingIn() && !Meteor.user();
    },

    loggedIn: function(){
        return !Meteor.loggingIn() && Meteor.user();
    },
});

Template.layout.onRendered(function () {

});

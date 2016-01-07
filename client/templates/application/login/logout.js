Template.logout.events({
    'click .logout': function(event){
        event.preventDefault();
        Meteor.logout();
    },
    
    'click .change_password' : function (event) {
        event.preventDefault();
        Router.go('/change/password');
    }
});
Meteor.methods({

    updateName: function (username) {
        _updateName(username);

    },

    initUserAndSprint : function(username){
        _updateName(username);
        Meteor.call('createUserDefaultSprint');
    },

    updateDefaultSprint : function(sprint_id){
        var sprint = Sprints.findOne({_id : sprint_id});
        if (sprint) {
            Meteor.users.update({_id: Meteor.userId()}, {$set: {"profile.default_sprint": sprint_id}});
        }
    }

});


function _updateName(name) {
    // Make sure the user is logged in before inserting a task
    if (!Meteor.userId()) {
        throw new Meteor.Error("not-authorized");
    }

    if (name.indexOf(' ') >= 0){
        throw new Meteor.Error(500, 'Error');
    } else {
        var users = Meteor.users.find({'profile.username': name}).fetch();
        if (users.length == 0) {
            Meteor.users.update({_id: Meteor.userId()}, {$set: {"profile.username": name}});
        } else {
            throw new Meteor.Error(500, 'Taken');
        }
    }
}
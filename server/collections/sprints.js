Meteor.methods({

    createSprint: function (name) {
        var userId = Meteor.userId();
        var cashMap = {};
        cashMap[userId] = 100000;

        var id = Sprints.insert({
            name: name,
            users: [userId],
            status: "Pending",
            cash: cashMap
        });

        return id;
    },

    updateSprintName : function(name, sprint_id) {
        var sprint = Sprints.findOne({_id : sprint_id});
        name = name.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
        if (sprint && name) {
            sprint.name = name;
            Sprints.update({_id : sprint._id}, sprint);
        } else {
            throw new Meteor.Error(500, 'Error');
        }
    },

    createUserDefaultSprint: function() {
        var userId = Meteor.userId();
        //var username = Meteor.user().profile.username + "'s default sprint";
        var cashMap = {};
        cashMap[userId] = 100000;

        var id = Sprints.insert({
            name: "default sprint",
            users: [userId],
            status: "Pending",
            cash: cashMap
        });

        var sprint_id = Meteor.user().profile.default_sprint;
        if (!sprint_id) {
            Meteor.users.update({_id: Meteor.userId()}, {$set: {"profile.default_sprint": id}});
        }

        return id;
    },

    addUserToSprint: function (username, sprint_id) {
        var user = Meteor.users.findOne({'profile.username': username});
        if (user) {
            var sprints = Sprints.find({_id: sprint_id, users: user._id}).fetch();
            if (sprints.length === 0) {
                var sprint = Sprints.findOne({_id: sprint_id});
                sprint.users.push(user._id);
                sprint.cash[user._id] = 100000;
                Sprints.update({_id: sprint_id}, sprint);
            } else {
                throw new Meteor.Error(500, 'In Sprint');
            }
        } else {
            throw new Meteor.Error(500, 'Not Found');
        }
    }
});
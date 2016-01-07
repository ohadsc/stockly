/**
 * Created by ohad on 2015-10-24.
 */

Template.createSprint.events({
    'click .btn.btn-default.create': function(event, template) {
        event.preventDefault();
        var sprintName = $('input').val();
        Meteor.call('createSprint', sprintName, function(err, sprint_id){
            Router.go('/sprints/'+ sprint_id +'/stocks');
        });

    }
});
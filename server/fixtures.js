if ( Companies.find().count() === 0 ) {
    var comps = JSON.parse(Assets.getText('companylist.json'))
    for (var i = 0; i < comps.length; i++) {
        Companies.update(
            {
                symbol : comps[i].Symbol
            },
            {
                name : comps[i].Name,
                symbol : comps[i].Symbol,
                sector: comps[i].Sector,
                industry : comps[i].industry
            },
            {
                upsert: true
            }
        );
    }
}

/*
if (Stocks.find({user_id : 'NqmgdRaiBvDyeodB6'}).fetch() !== 0 ) {
    var sprint = Sprints.findOne({"_id": "2BMHMoYDuXvWrjgAe"});
    sprint.cash["NqmgdRaiBvDyeodB6"] = 100000;
    Stocks.remove({user_id: 'NqmgdRaiBvDyeodB6'});
}*/